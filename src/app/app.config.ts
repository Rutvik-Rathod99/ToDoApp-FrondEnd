import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {OAuthService, provideOAuthClient} from 'angular-oauth2-oidc';
import { googleAuthConfig } from './config/auth/google-auth.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideAnimationsAsync(),
    providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.my-app-dark' // optional
                }
            }
        }),
   // 1. Register OAuth client (for interceptor if needed)
    provideOAuthClient({
      resourceServer: {
        allowedUrls: ['http://localhost:5000', 'https://localhost:702/'], // add your backend APIs
        sendAccessToken: true,
      }
    }),

    // 2. Initialize configuration + load discovery document
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => () => {
        oauthService.configure(googleAuthConfig);        // ← This was missing!
        // oauthService.setupAutomaticSilentRefresh();   // Usually not needed for Google
        return oauthService.loadDiscoveryDocumentAndTryLogin();
      },
      deps: [OAuthService],
      multi: true,
    }
  ],
};
