import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-register',
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, FormsModule, RouterLink, ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  isLoading = false;
  router = inject(Router);
  httpClient = inject(HttpClient);
  authService = inject(AuthService);

  constructor(private messageService: MessageService) {}
  onRegister() {
    console.log("inside on register")
    if (this.email && this.password) {
      this.isLoading = true;
      this.authService.setLoading(true);
      this.httpClient
        .post('https://localhost:7027/api/auth/register', {
          username: this.username ?? "",
          email: this.email,
          password: this.password,
        })
        .subscribe({
          next: (val: any) => {
            this.authService.login(val.token);
            this.showToast('success', 'Success', 'Register Successfully...');
            this.isLoading = false;
            this.authService.setLoading(false);
            this.router.navigate(['/todos']);
          },
          error: (error: any) => {
            this.isLoading = false;
            this.authService.setLoading(false);
            this.showToast('error', 'Error in Register...',error.error);
          },
        });
    }
    else{
      this.showToast('error', 'Error in Register...', 'Please enter email and password');
    }
  }
    showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }

  googleLogin() {
    this.authService.googleLogin();
  }
  
  microsoftLogin() {
    this.authService.microsoftLogin();
  }
}
