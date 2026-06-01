import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { googleAuthConfig } from '../config/auth/google-auth.config';
import { HttpClient } from '@angular/common/http';
import { microsoftAuthConfig } from '../config/auth/microsft-auth.config';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();
  
  private authLoading = new BehaviorSubject<boolean>(false);
  isAuthLoading$ = this.authLoading.asObservable();

  setLoading(loading: boolean) {
    this.authLoading.next(loading);
  }
  constructor(private oauthService: OAuthService, private http: HttpClient) { }

  private hasToken() {
    return !!sessionStorage.getItem('token');
  }
  login(token:string) {
    sessionStorage.setItem('token', token);
    this.loggedIn.next(true);
  }
  logout() {
    sessionStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  googleLogin() {
    this.oauthService.configure(googleAuthConfig);
    this.oauthService.loadDiscoveryDocument()
    this.oauthService.initLoginFlow();
  }
  async processGoogleLogin() {
    const result = await this.oauthService.loadDiscoveryDocumentAndTryLogin()
    if(!this.oauthService.hasValidAccessToken()) return null;
    const idToken = this.oauthService.getIdToken();
    return this.http.post('https://localhost:7027/api/auth/google-login', { idToken: idToken });
  }
  
   async microsoftLogin(){
    this.oauthService.configure(microsoftAuthConfig);
    await this.oauthService.loadDiscoveryDocument()
    this.oauthService.initCodeFlow();
   }

  async processMicrosoftLogin() {
    
    // 1. Ensure config is set before trying to process the returning URL
    this.oauthService.configure(microsoftAuthConfig);
    
    // 2. Process the ?code=... in the URL
    const result = await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    // 3. THE FIX: Check for the ID Token!
    const hasIdToken = this.oauthService.hasValidIdToken();

    if (!hasIdToken) {
        return null;
    }

    // 4. We have a valid user! Grab the token to send to .NET
    const idToken = this.oauthService.getIdToken();

    // 5. Send to your C# backend
    // Note: Since this returns an Observable, whoever calls processMicrosoftLogin() 
    // needs to .subscribe() to it, or it won't actually make the HTTP request!
    return this.http.post('https://localhost:7027/api/auth/microsoft-login', { idToken: idToken });
}
}
