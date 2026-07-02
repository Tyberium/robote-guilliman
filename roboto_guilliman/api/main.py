"""FastAPI service for Cloud Run - roboto-guilliman rules arbiter."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import Annotated

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google.genai.errors import ClientError
from pydantic import BaseModel, Field

from roboto_guilliman.ask_pipeline import run_ask
from roboto_guilliman.config import Settings, get_settings
from whatsapp_integration.gateway import router as whatsapp_router
from roboto_guilliman.gemini_client import GeminiArbiter
from roboto_guilliman.prompts import RetrievedChunk
from roboto_guilliman.retriever import ChatHistoryCache, RulesRetriever

logger = logging.getLogger(__name__)


class AskRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=4000)
    use_cache: bool = True


class ContextChunkResponse(BaseModel):
    page: int | None
    section_hint: str | None
    rule_number: str | None = None
    source: str | None
    has_figure: bool = False
    preview: str


class AskResponse(BaseModel):
    answer: str
    cached: bool
    context_chunks: list[ContextChunkResponse]


class AppState:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.retriever = RulesRetriever(settings)
        self.cache = ChatHistoryCache(settings)
        self.arbiter = GeminiArbiter(settings)


def _chunk_preview(chunk: RetrievedChunk, limit: int = 180) -> str:
    text = chunk.text.strip().replace("\n", " ")
    if len(text) <= limit:
        return text
    return text[: limit - 3] + "..."


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    app.state.ro_boto = AppState(settings)
    logging.basicConfig(level=settings.log_level.upper())
    logger.info(
        "roboto-guilliman online (project=%s, collection=%s)",
        settings.gcp_project_id,
        settings.firestore_collection,
    )
    yield


app = FastAPI(
    title="roboto-guilliman",
    description="Warhammer 11th edition rules arbiter for battleplan.uk",
    version="1.0.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(whatsapp_router)


@app.exception_handler(HTTPException)
async def http_exception_handler(_request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(Exception)
async def unhandled_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled API error")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal rules engine error."},
    )


def get_state() -> AppState:
    return app.state.ro_boto


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "roboto-guilliman"}


@app.post("/v1/ask", response_model=AskResponse)
def ask_rules(
    body: AskRequest,
    state: Annotated[AppState, Depends(get_state)],
) -> AskResponse:
    query = body.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query must not be empty.")

    try:
        answer, cached, chunks = run_ask(
            query,
            retriever=state.retriever,
            cache=state.cache,
            arbiter=state.arbiter,
            use_cache=body.use_cache,
        )
    except ClientError as exc:
        logger.exception("Vertex/Gemini API error")
        raise HTTPException(
            status_code=503,
            detail=(
                "Rules engine temporarily unavailable (Vertex AI). "
                "Try the Heresy example, which does not call the model."
            ),
        ) from exc

    return AskResponse(
        answer=answer,
        cached=cached,
        context_chunks=[
            ContextChunkResponse(
                page=chunk.page,
                section_hint=chunk.section_hint,
                rule_number=chunk.rule_number,
                source=chunk.source,
                has_figure=bool(chunk.figure_description),
                preview=_chunk_preview(chunk),
            )
            for chunk in chunks
        ],
    )


def run() -> None:
    settings = get_settings()
    uvicorn.run(
        "roboto_guilliman.api.main:app",
        host="0.0.0.0",
        port=settings.port,
        log_level=settings.log_level.lower(),
    )


if __name__ == "__main__":
    run()
