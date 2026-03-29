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
   console.log('post method end...')
   if(result) {
        console.log('in if part')
    result.subscribe((token : any) => {
      console.log('got response',result)
      localStorage.setItem('token', token.token);
      this.router.navigate(['/todos'])
    },(error : any) => {
      console.log('error',error)
      this.router.navigate(['/login']);
    })
   }else{
    console.log('in else part')
    this.router.navigate(['/login']);
   }
  }
}
