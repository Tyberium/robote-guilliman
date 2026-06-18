# Free tier and security

robote-guilliman is designed to stay inside GCP's free allowances where possible.
All infrastructure is Pulumi; all deploys run through GitHub Actions on push to `main`.

## Free tier budget

| Service | Free allowance (typical) | Our setting |
|---------|--------------------------|-------------|
| Cloud Run | 2M requests/mo, 180k vCPU-s, 360k GiB-s | `min-instances=0`, `max-instances=2`, `256Mi`, `cpu_idle=true` |
| Artifact Registry | 0.5 GB storage | Single service repo, tagged by git SHA |
| Firestore | Spark: 1 GiB, 50k reads / 20k writes per day | Shared `battleplan-dev-2024` project; vector index uses native Firestore (no extra nodes) |
| Vertex AI (Gemini Flash-Lite) | Pay-per-token, very low cost | Cache hits skip the LLM entirely |
| Vertex AI (embeddings) | Ingest is one-off; queries are small | `text-embedding-004` at query time only |
| GitHub Actions | 2,000 min/mo (private repo) | Test + deploy ~5-8 min per push |

## What we deliberately avoid (not free)

- **Global HTTPS load balancer** - ~$18+/month minimum
- **Identity-Aware Proxy on a dedicated LB** - pairs with the above
- **VPC Service Controls** - enterprise perimeter product
- **Cloud Run min-instances > 0** - always-on billing
- **Cloud Build** - use GitHub Actions instead (already free tier eligible)

## Security without a paid load balancer

battleplan.uk already uses **Firebase Auth** (Google sign-in). The free-tier pattern:

1. Cloud Run allows unauthenticated **ingress** (no LB required).
2. The FastAPI service verifies a **Firebase ID token** on `POST /v1/ask` (next implementation step).
3. Only signed-in battleplan users get answers; everyone else receives `401`.

This gives you auth comparable to IAP for club use, at zero LB cost.

Optional hardening later: App Check, rate limiting via Firestore counters, or Cloud Armor if traffic grows.

## Pulumi stack (`infra/pulumi`)

Creates:

- Artifact Registry Docker repo
- Runtime service account + Firestore / Vertex IAM
- Firestore vector index on `warhammer_rules_11th.embedding`
- Cloud Run v2 service

Stack config lives in `Pulumi.dev.yaml`. The container image URI is set by CI on each deploy.

## GitHub Actions secrets

| Secret | Purpose |
|--------|---------|
| `PULUMI_ACCESS_TOKEN` | Pulumi Cloud (free tier) state backend |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | WIF for keyless GCP auth from Actions |
| `GCP_SERVICE_ACCOUNT` | Deployer SA email (needs Run Admin, AR Writer, SA User, Project IAM Admin for bindings) |

**Simpler alternative:** replace the WIF auth step with `credentials_json: ${{ secrets.GCP_SA_KEY }}` if you have not set up Workload Identity Federation yet.

## Cost monitoring

Set a GCP billing budget alert at $1-5/month in the console. With min-instances=0 and query caching, idle cost should be near zero; spend tracks actual rules questions asked.
