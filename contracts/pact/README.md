# Contract Testing

Provider: employee-profile-service
Consumer: react-enterprise-app

Run provider verification in CI using Pact Broker:

```bash
pact-broker can-i-deploy --pacticipant employee-profile-service --version $GIT_SHA --to-environment production
```
