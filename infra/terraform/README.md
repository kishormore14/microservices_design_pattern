# Terraform Strategy

- Backend: S3 + DynamoDB locking (AWS), one bucket for all env states.
- Workspaces: `development`, `testing`, `production`.
- Naming: `${var.project}-${terraform.workspace}`.
- Region default: `us-east-1`.

## Bootstrap backend (development)
```bash
terraform -chdir=infra/terraform/envs/development init -backend-config=backend.hcl
terraform -chdir=infra/terraform/envs/development workspace new development || true
terraform -chdir=infra/terraform/envs/development apply -var-file=terraform.tfvars
```
