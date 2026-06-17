"""Gemini generation via google-genai."""

from __future__ import annotations

from google import genai
from google.genai import types

from ro_boto_guilliman.config import Settings, get_settings
from ro_boto_guilliman.prompts import SYSTEM_PERSONA, RetrievedChunk, build_user_prompt


class GeminiArbiter:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.client = genai.Client(
            vertexai=True,
            project=self.settings.gcp_project_id,
            location=self.settings.gcp_location,
        )

    def answer(self, query: str, chunks: list[RetrievedChunk]) -> str:
        if not chunks:
            return (
                "The provided rules do not cover this specific interaction. "
                "No relevant rule text was retrieved from the index."
            )

        response = self.client.models.generate_content(
            model=self.settings.llm_model,
            contents=build_user_prompt(query, chunks),
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PERSONA,
                temperature=0.2,
            ),
        )
        text = response.text
        if not text:
            return "The provided rules do not cover this specific interaction."
        return text.strip()
