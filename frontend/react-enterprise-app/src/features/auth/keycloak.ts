import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ?? 'https://keycloak.dev.hrms.internal',
  realm: import.meta.env.VITE_KEYCLOAK_REALM ?? 'hrms',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'hrms-web'
});
