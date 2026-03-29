import { AuthConfig } from "angular-oauth2-oidc";

export const microsoftAuthConfig: AuthConfig = {
    issuer: "https://login.microsoftonline.com/7f762d29-5abf-4542-bed5-1a1030755b11/v2.0",
    clientId: "059b097e-12fa-48ec-8ca7-f60d75d8e2bf",
    scope: "openid profile email",
    redirectUri: window.location.origin + '/signin-microsoft',
    postLogoutRedirectUri: window.location.origin,    
    responseType: 'code', 
    requireHttps: false, 
    strictDiscoveryDocumentValidation: false, 
    showDebugInformation: true,
    customQueryParams: {
        prompt: 'select_account'
    }
}