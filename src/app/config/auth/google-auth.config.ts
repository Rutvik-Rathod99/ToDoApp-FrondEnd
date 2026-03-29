import { AuthConfig } from 'angular-oauth2-oidc';

export const googleAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  clientId: '1070469307048-tcsga4k0m3t7h2mf89hic78rpobmi06j.apps.googleusercontent.com',
  redirectUri: window.location.origin + '/signin-google',
  postLogoutRedirectUri: window.location.origin,
  responseType: 'id_token token',   
  scope: 'openid profile email',
  requireHttps: false,
  strictDiscoveryDocumentValidation: false,
  showDebugInformation: true,
  customQueryParams: {
    prompt: 'select_account'
  },
};