path "database/creds/hrms-admin" {
  capabilities = ["read"]
}

path "database/roles/hrms-admin" {
  capabilities = ["create", "update", "read"]
}
