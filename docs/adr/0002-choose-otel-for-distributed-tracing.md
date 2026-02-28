# ADR 0002: Use OpenTelemetry End-to-End

## Status
Accepted

## Context
Need consistent trace propagation from Angular frontend to NestJS services and downstream dependencies.

## Decision
Adopt OpenTelemetry SDK/collector with Jaeger backend for traces and Prometheus for metrics export.

## Consequences
- Vendor-neutral observability pipeline.
- Added operational overhead to run collector + tracing backend.
