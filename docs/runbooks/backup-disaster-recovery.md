# Backup and Disaster Recovery Runbook

## Objectives
- RPO: <= 5 minutes
- RTO: <= 30 minutes

## Daily
1. Verify AWS Backup jobs success for RDS resources.
2. Verify S3 lifecycle transitions and retention policies.
3. Check replica lag and WAL archive health.

## Monthly DR Drill
1. Restore latest snapshot into isolated recovery VPC.
2. Replay WAL to point-in-time target.
3. Run smoke tests for auth, core APIs, and data integrity.
4. Record elapsed recovery time and corrective actions.

## Emergency Failover
1. Freeze writes at gateway (maintenance mode).
2. Promote standby DB / restore latest snapshot.
3. Rotate DB secrets in Vault and refresh External Secrets.
4. Shift traffic through DNS/Global LB policy.
5. Monitor SLO recovery for 60 minutes.
