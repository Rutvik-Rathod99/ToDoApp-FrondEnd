import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-microsoft-callback',
  imports: [],
  templateUrl: './microsoft-callback.component.html',
  styleUrl: './microsoft-callback.component.css'
})
export class MicrosoftCallbackComponent {
  constructor(private auth: AuthService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    const result = await this.auth.processMicrosoftLogin()
    if (result) {
      result.subscribe((token: any) => {
        this.auth.login(token.token);
        this.router.navigate(['/todos'])
      }, (error: any) => {
        this.router.navigate(['/login']);
      })
    } else {
      this.router.navigate(['/login']);
    }
  }
}
