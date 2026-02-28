# Vault Dynamic DB Credentials (Postgres)

```bash
vault secrets enable database
vault write database/config/hrms-postgres \
  plugin_name=postgresql-database-plugin \
  allowed_roles="hrms-readonly,hrms-admin" \
  connection_url="postgresql://{{username}}:{{password}}@hrms-postgres:5432/hrms?sslmode=require" \
  username="vaultadmin" \
  password="$VAULT_DB_PASSWORD"

vault write database/roles/hrms-readonly \
  db_name=hrms-postgres \
  creation_statements="CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT ON ALL TABLES IN SCHEMA public TO \"{{name}}\";" \
  default_ttl="1h" max_ttl="24h"
```
