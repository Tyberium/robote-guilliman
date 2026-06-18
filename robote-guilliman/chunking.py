"""Recursive text chunking tuned for rulebook PDF extraction."""

from __future__ import annotations

import re
from dataclasses import dataclass


DEFAULT_SEPARATORS = (
    "\n\n",
    "\n",
    ". ",
    " ",
    "",
)


@dataclass(frozen=True)
class TextChunk:
    text: str
    page: int
    chunk_index: int
    section_hint: str | None = None


def _split_text(text: str, separator: str) -> list[str]:
    if separator == "":
        return list(text)
    parts = text.split(separator)
    return [part + separator for part in parts[:-1]] + ([parts[-1]] if parts[-1] else [])


def recursive_split(
    text: str,
    *,
    chunk_size: int,
    chunk_overlap: int,
    separators: tuple[str, ...] = DEFAULT_SEPARATORS,
) -> list[str]:
    """Split text into overlapping chunks, preferring paragraph and line breaks."""
    text = text.strip()
    if not text:
        return []
    if len(text) <= chunk_size:
        return [text]

    separator = separators[-1]
    for candidate in separators:
        if candidate == "" or candidate in text:
            separator = candidate
            break

    splits = _split_text(text, separator)
    chunks: list[str] = []
    current = ""

    for piece in splits:
        candidate = current + piece
        if len(candidate) <= chunk_size:
            current = candidate
            continue

        if current:
            chunks.append(current.strip())
            overlap = current[-chunk_overlap:] if chunk_overlap else ""
            current = overlap + piece
        else:
            if len(piece) > chunk_size and len(separators) > 1:
                nested = recursive_split(
                    piece,
                    chunk_size=chunk_size,
                    chunk_overlap=chunk_overlap,
                    separators=separators[1:],
                )
                chunks.extend(nested)
                current = ""
            else:
                chunks.append(piece.strip())
                current = ""

    if current.strip():
        chunks.append(current.strip())

    return [chunk for chunk in chunks if chunk]


_SECTION_RE = re.compile(
    r"^(?:\d+\.\s+)?([A-Z][A-Z0-9 \-/']{2,60})$",
    re.MULTILINE,
)


def guess_section_hint(page_text: str) -> str | None:
    """Best-effort section header from ALL-CAPS lines common in GW rulebooks."""
    for line in page_text.splitlines():
        stripped = line.strip()
        if _SECTION_RE.match(stripped):
            return stripped
    return None


def chunk_page_text(
    page_text: str,
    *,
    page_number: int,
    chunk_size: int,
    chunk_overlap: int,
    start_index: int = 0,
) -> list[TextChunk]:
    section = guess_section_hint(page_text)
    raw_chunks = recursive_split(
        page_text,
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    return [
        TextChunk(
            text=chunk,
            page=page_number,
            chunk_index=start_index + index,
            section_hint=section,
        )
        for index, chunk in enumerate(raw_chunks)
    ]
