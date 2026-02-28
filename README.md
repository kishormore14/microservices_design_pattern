# HRMS Microservices Enterprise Scaffold

Production-grade scaffold for React (Vite) and Angular frontends + NestJS/Express services on Kubernetes with Terraform-managed cloud infrastructure.

## Top-level Layout
- `services/`: independently deployable backend services (NestJS + Express gateway)
- `libs/`: shared protobuf contracts and shared libraries
- `frontend/`: React and Angular app scaffolds
- `infra/terraform/`: cloud infrastructure modules and env compositions
- `infra/helm/`: service and platform charts
- `charts/`: umbrella/aggregator charts
- `ci/`: load tests and CI support scripts
- `contracts/`: OpenAPI and Pact governance assets
- `docs/`: ADRs, runbooks, architecture docs
- `observability/`: Prometheus, Grafana, OTel, Jaeger configs
- `logging/`: Fluentd/Filebeat and Elasticsearch/Loki policy configs
- `security/`: Keycloak/Vault/network/Kyverno policy artifacts

## Mandatory P0 Layers Included
- Redis (`infra/terraform/modules/redis`)
- CDN CloudFront (`infra/terraform/modules/cdn`)
- ALB/NLB module (`infra/terraform/modules/load-balancer`)
- Backup/DR (`infra/terraform/modules/backup-dr`, `docs/runbooks/backup-disaster-recovery.md`)
- Config governance (`infra/k8s/external-secrets`, `docs/architecture/config-governance.md`)

## High-impact Layers Included
- Kubecost Helm values (`infra/helm/kubecost/values.yaml`)
- Workflow engine options (`infra/helm/temporal/values.yaml`, BullMQ scaffold in service)
- Contract governance (`.github/workflows/contract-governance.yml`, `contracts/`)

## Traffic Plane Separation
- Kong: north-south API gateway
- Istio: east-west service mesh

## Terraform quick start
```bash
terraform -chdir=infra/terraform/envs/development init -backend-config=backend.hcl
terraform -chdir=infra/terraform/envs/development workspace select development || terraform -chdir=infra/terraform/envs/development workspace new development
terraform -chdir=infra/terraform/envs/development plan
terraform -chdir=infra/terraform/envs/development apply
```

## 50k RPS Deployment Profile
Use the dedicated throughput profile for employee-profile-service:

```bash
helm upgrade --install hrms-employee infra/helm/employee-profile-service \
  --namespace hrms-production --create-namespace \
  -f infra/helm/employee-profile-service/values-production-50k.yaml \
  --set image.repository=ghcr.io/acme/hrms/employee-profile-service \
  --set image.tag=sha-<gitsha>
```

Run capacity validation:

```bash
k6 run ci/k6-50k-rps.js -e BASE_URL=https://api.hrms.internal
```

