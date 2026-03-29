import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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

  onRegister() {
    if (this.username && this.email && this.password) {
      this.isLoading = true;
      this.httpClient
        .post('http://localhost:5177/api/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        })
        .subscribe({
          next: (val: any) => {
            localStorage.setItem('token', val.token);
            this.isLoading = false;
            this.router.navigate(['/todos']);
          },
          error: (error: any) => {
            this.isLoading = false;
            console.log("Error from server");
          },
        });
    }
  }
}
