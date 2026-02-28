# Keycloak User Migration

1. Export realm from source environment:
   `kc.sh export --realm hrms --dir /tmp/export`
2. Import into target:
   `kc.sh import --dir /tmp/export`
3. Rotate all temporary passwords and enforce MFA.
4. Validate OIDC config in frontend and API gateway.
