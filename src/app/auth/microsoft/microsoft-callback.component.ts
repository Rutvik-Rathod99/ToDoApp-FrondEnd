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
      console.log('in if part')
      result.subscribe((token: any) => {
        console.log('got response', result)
        localStorage.setItem('token', token.token);
        this.router.navigate(['/todos'])
      }, (error: any) => {
        console.log('error', error)
        this.router.navigate(['/login']);
      })
    } else {
      console.log('in else part')
      this.router.navigate(['/login']);
    }
  }
}
