# Enterprise SaaS Platform Blueprint (100k+ Concurrent Users)

## A) High-Level Architecture

### Text Architecture Diagram
```text
Users -> CDN (CloudFront/Cloudflare) -> WAF -> ALB (HTTP) / NLB (gRPC,TCP)
  -> Kong Gateway (north-south API concerns only)
  -> Istio IngressGateway + Mesh (east-west service traffic only)
  -> UI (React/Vite static via NGINX)
  -> API Gateway (Nest/Express edge)
      -> Domain Services (NestJS)
           -> Redis Cluster (sessions, caching, rate limits, locks)
           -> PostgreSQL primary + read replicas
           -> RabbitMQ (task + retry + DLQ)
           -> Kafka (event streaming)
           -> Temporal/BullMQ (workflows and scheduled jobs)
```

### Communication Model
- External synchronous: REST via Kong.
- Internal synchronous: gRPC through Istio mTLS.
- Internal asynchronous: Kafka (events), RabbitMQ (commands/retries), BullMQ/Temporal (workflows).

### Multi-region
- Primary/secondary with CloudFront global edge + regional ALB origins.
- Postgres PITR + cross-region snapshot copy.
- Redis replication group with failover policy.

## B) Frontend (React/Vite)
- CDN-first asset strategy with immutable hashes.
- Keycloak PKCE auth; token refresh and route guards.
- API client abstraction via Axios interceptors and typed contracts.

## C) Backend (NestJS)
- DDD service boundaries with separate data ownership.
- Kong for authn/z and rate limiting at edge; Istio for retries/timeouts/traffic splits inside mesh.
- Circuit breakers and timeout budgets per dependency.

## D) Data Layer
- PostgreSQL + read replicas.
- Redis as mandatory distributed cache tier.
- Flyway for migration governance.

## E) CI/CD
- Build -> test -> security scan -> contract checks -> image -> deploy canary -> SLO gate -> promote.
- GitFlow and immutable tags (`sha-*`, `vX.Y.Z`).

## F) Kubernetes & Infra
- Namespaces per environment and platform domains.
- Helm per service with HPA/VPA policy and zero-downtime rollout.
- External Secrets Operator + Vault for secret sync.

## G) Security
- OIDC (Keycloak), Vault dynamic creds, Kyverno enforcement, Istio STRICT mTLS.

## H) Observability
- OTel tracing/metrics + Prometheus/Grafana + Jaeger + ELK.

## I) Performance
- Cache chain: CloudFront -> Redis -> Postgres.
- Queue buffering and worker autoscaling for spikes.

## J) Reliability
- DLQ/parking-lot, retry policies, chaos drills, runbooked failover.

## K) Governance
- ESLint/Prettier/Husky/Sonar + OpenAPI and Pact gates.

## L) Cost/FinOps
- Kubecost required in all non-local clusters.
- Rightsize monthly, enforce requests/limits by policy.

## Key Clarification (Non-redundant)
- Kong = north-south API gateway responsibilities.
- Istio = east-west service mesh responsibilities.
- No duplicate policy ownership across both planes.
