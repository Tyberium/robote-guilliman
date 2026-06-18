"""Tests for recursive chunking."""

from roboto_guilliman.chunking import chunk_page_text, recursive_split


def test_recursive_split_respects_chunk_size():
    text = "word " * 500
    chunks = recursive_split(text, chunk_size=200, chunk_overlap=20)
    assert len(chunks) > 1
    assert all(len(chunk) <= 220 for chunk in chunks)


def test_chunk_page_text_assigns_page_and_index():
    page_text = "BATTLE-SHOCK TESTS\n\nWhen a unit fails a Battle-shock test, apply the rules below."
    chunks = chunk_page_text(page_text, page_number=42, chunk_size=500, chunk_overlap=0)
    assert len(chunks) == 1
    assert chunks[0].page == 42
    assert chunks[0].chunk_index == 0
    assert chunks[0].section_hint == "BATTLE-SHOCK TESTS"


def test_empty_page_yields_no_chunks():
    chunks = chunk_page_text("   \n  ", page_number=1, chunk_size=100, chunk_overlap=0)
    assert chunks == []
