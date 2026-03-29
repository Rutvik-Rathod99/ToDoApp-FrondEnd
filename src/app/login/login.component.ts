import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private authService: AuthService) {}
  email = '';
  password = '';
  isLoading = false;
  router = inject(Router);
  httpClient = inject(HttpClient);

  onLogin() {
    if (this.email && this.password) {
      this.isLoading = true;
      this.httpClient
        .post('http://localhost:5177/api/auth/login', {
          username: this.email,
          password: this.password,
        })
        .subscribe({
          next: (val: any) => {
            localStorage.setItem('token', val.token)
            this.authService.login(val.token);
            this.isLoading = false;
            this.router.navigate(['/todos']);
          },
          error: (error: any) => {
            this.isLoading = false;
            console.log("Error from server : " + error.message);
          },
        });
    }
  }

  googleLogin() {
    this.authService.googleLogin();
  }
  microsoftLogin() {
    this.authService.microsoftLogin();
  }
}


