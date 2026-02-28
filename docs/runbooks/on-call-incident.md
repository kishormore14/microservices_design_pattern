# On-Call Incident Runbook

1. Triage alert severity from Alertmanager.
2. Correlate affected service in Grafana and Jaeger trace graph.
3. Verify deployment history (`helm history <release> -n <ns>`).
4. If new release caused regression, rollback (`helm rollback <release> <rev>`).
5. Validate p95 and error-rate recovery for 30 minutes.
6. Open post-incident review ticket with timeline and corrective actions.
