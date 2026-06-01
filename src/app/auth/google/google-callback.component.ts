import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-google-callback',
  providers: [MessageService],
  templateUrl: './google-callback.component.html',
  styleUrl: './google-callback.component.css'
})
export class GoogleCallbackComponent {
  constructor(private auth: AuthService, private router: Router , private messageService : MessageService) {
  }

  async ngOnInit(): Promise<void> {
    const result = await this.auth.processGoogleLogin();
    if (result) {
      result.subscribe({
        next: (token: any) => {
          this.auth.login(token.token);
          this.router.navigate(['/todos']);
        },
        error: (error: any) => {

          this.router.navigate(['/login']);
          this.showToast('error','Error Occuured During Google Login',error)
        }
      })
    } else {
      this.router.navigate(['/login']);
    }
  }
  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
}
}