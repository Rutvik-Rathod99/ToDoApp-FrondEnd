import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, FormsModule, RouterLink, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private authService: AuthService, private messageService: MessageService) {}
  email = '';
  password = '';
  isLoading = false;
  router = inject(Router);
  httpClient = inject(HttpClient);

  onLogin() {
    if (this.email && this.password) {
      this.isLoading = true;
      this.authService.setLoading(true);
      this.httpClient
        .post('http://localhost:5177/api/auth/login', {
          email: this.email,
          password: this.password,
        })
        .subscribe({
          next: (val: any) => {
            sessionStorage.setItem('token', val.token)
            this.authService.login(val.token);
            this.showToast('success', 'Success', 'Login Successfully...');
            this.isLoading = false;
            this.authService.setLoading(false);
            this.router.navigate(['/todos']);
          },
          error: (error: any) => {
            this.isLoading = false;
            this.authService.setLoading(false);
            this.showToast('error', 'Login Failed', error.error || 'Invalid credentials');
          },
        });
    }else{
      this.showToast('error', 'Error in Login...', 'Please enter email and password');
    }
  }

  googleLogin() {
    this.authService.googleLogin();
  }
  microsoftLogin() {
    this.authService.microsoftLogin();
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }
}

