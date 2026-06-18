"""Tests for prompt formatting."""

from roboto_guilliman.prompts import RetrievedChunk, build_cache_key, build_user_prompt, format_context


def test_format_context_includes_citation():
    chunks = [
        RetrievedChunk(
            text="Roll one D6.",
            page=17,
            section_hint="BATTLE-SHOCK TESTS",
            source="core_rules_11th",
        )
    ]
    rendered = format_context(chunks)
    assert "BATTLE-SHOCK TESTS" in rendered
    assert "page 17" in rendered
    assert "Roll one D6." in rendered


def test_build_user_prompt_includes_query():
    prompt = build_user_prompt(
        "What happens on a Battle-shock test?",
        [
            RetrievedChunk(
                text="See core rules.",
                page=1,
                section_hint=None,
                source=None,
            )
        ],
    )
    assert "Battle-shock test" in prompt
    assert "See core rules." in prompt


def test_cache_key_normalizes_whitespace_and_case():
    assert build_cache_key("  Foo Bar ") == build_cache_key("foo bar")
