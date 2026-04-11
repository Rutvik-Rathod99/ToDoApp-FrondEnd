import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-callback',
  imports: [],
  templateUrl: './google-callback.component.html',
  styleUrl: './google-callback.component.css'
})
export class GoogleCallbackComponent {
  constructor(private auth : AuthService,private router : Router) { 
  }

  async ngOnInit(): Promise<void> {
   const result = await this.auth.processGoogleLogin();
   if(result) {
    result.subscribe((token : any) => {
      this.auth.login(token.token);
      this.router.navigate(['/todos'])
    },(error : any) => {
      this.router.navigate(['/login']);
    })
   }else{
    this.router.navigate(['/login']);
   }
  }
}
