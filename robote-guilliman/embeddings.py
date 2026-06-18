"""Vertex AI embeddings via google-genai."""

from __future__ import annotations

from google import genai
from google.genai import types

from ro_boto_guilliman.config import Settings, get_settings


class EmbeddingService:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.client = genai.Client(
            vertexai=True,
            project=self.settings.gcp_project_id,
            location=self.settings.gcp_location,
        )

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        response = self.client.models.embed_content(
            model=self.settings.embedding_model,
            contents=texts,
            config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT"),
        )
        return [list(embedding.values) for embedding in response.embeddings]

    def embed_query(self, query: str) -> list[float]:
        response = self.client.models.embed_content(
            model=self.settings.embedding_model,
            contents=query,
            config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY"),
        )
        return list(response.embeddings[0].values)
