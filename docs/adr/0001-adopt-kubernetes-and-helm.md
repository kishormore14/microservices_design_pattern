# ADR 0001: Adopt Kubernetes + Helm for Service Delivery

## Status
Accepted

## Context
The platform requires independent microservice deployability, blue/green style rollouts, and policy-based controls.

## Decision
Use Kubernetes as the runtime and Helm as the packaging/release mechanism.

## Consequences
- Standardized deployment contract for all teams.
- Stronger operational consistency for probes, HPA, and security context.
- Additional chart maintenance burden.
