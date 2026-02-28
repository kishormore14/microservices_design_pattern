# Configuration and Secret Governance

## Principles
- ConfigMaps for non-sensitive runtime configuration (feature defaults, URLs, timeout budgets).
- External Secrets Operator for secret material from Vault.
- Version every config change in Git; use environment overlays per namespace.
- Require rollout restart for immutable config changes, avoid ad-hoc kubectl edits.

## Dynamic Reload
- For critical flags use Unleash.
- For service static config use checksum annotations in Helm templates to trigger safe rollouts.

## Ownership
- Platform team owns base ConfigMap schema and admission policies.
- Domain teams own service-specific keys with CODEOWNERS review.
