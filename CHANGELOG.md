# Changelog

All notable changes to this project are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-06-23

First production-ready release: 11th edition (#New40k) core rules RAG on Cloud Run.

### Added

- `POST /v1/ask` - rules Q&A with Firestore vector retrieval and Gemini 2.5 Flash-Lite
- `GET /health` - service health check
- Core rules parser - 156 chunks by rule number (`01.01` - `24.38`)
- Vision caption pass for 23 diagram-heavy pages (`caption-core-rules-pages`, `page_captions.json`)
- Firestore ingest with `has_figure` and `figure_description` on shared PDF pages
- Chat history cache - repeat questions skip the LLM
- Legacy edition guard - 9th/10th edition queries refused in character
- `download-rules`, `preview-chunks`, and `ingest-rules` CLIs
- CI/CD - ruff, pytest, Docker build, Pulumi deploy, Cloud Run smoke test (`europe-west1`)
- Local GCP auth fallback via gcloud user token when ADC is not configured

### Live

- API: https://roboto-guilliman-wifsng2koa-ew.a.run.app
- Firestore collection: `warhammer_rules_11th` (156 core rule documents)

### Not in v1

- Faction packs and remaining PDF profiles
- Firebase auth on `/v1/ask`
- WhatsApp (Twilio) channel
- Billing kill switch (budget alert only; see [roadmap](docs/roadmap.md))

[1.0.0]: https://github.com/Tyberium/roboto-guilliman/releases/tag/v1.0.0
