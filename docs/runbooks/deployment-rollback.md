# Deployment Rollback Runbook

```bash
kubectl config use-context hrms-production
helm list -n hrms-production
helm history hrms-employee -n hrms-production
helm rollback hrms-employee <REVISION> -n hrms-production
kubectl rollout status deploy/hrms-employee-profile-service -n hrms-production
```

Post-rollback checks:
- Error rate < 1%
- P95 latency < 500ms
- No restart loops

