import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
import {ButtonModule} from 'primeng/button';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe,NgIf,ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-todo-app';
  constructor(public authService: AuthService, public router: Router){}

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}
