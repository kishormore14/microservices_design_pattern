# Stack Profiles and Responsibility Boundaries

## Recommended Default for HRMS (Most Teams)
- React + NestJS + PostgreSQL + Redis + RabbitMQ + Kubernetes + Kong
- Add Kafka only for event-stream analytics/integration workloads.
- Add Istio only when mTLS + advanced traffic shaping is mandatory.

## Advanced Profile (Your Current Blueprint)
- Kong (north-south API gateway)
- Istio (east-west service mesh)
- Kafka + RabbitMQ dual messaging
- Temporal for long-running workflows

## Non-Negotiable Separation
- Kong handles external API concerns: auth at edge, request routing, rate limiting, API products.
- Istio handles service mesh concerns: mTLS, retries, traffic shifting, service-level telemetry.
- Never overlap policies unless explicitly required.
