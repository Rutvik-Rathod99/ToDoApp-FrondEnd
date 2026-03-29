import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./todos/todos.component').then((m) => m.TodosComponent),
  },
  {
    path: 'signin-google',
    loadComponent: () =>
      import('./auth/google/google-callback.component').then((m) => m.GoogleCallbackComponent),
  },
  {
    path : 'signin-microsoft',
    loadComponent:async ()=>{
      const m = await import('./auth/microsoft/microsoft-callback.component');
      return m.MicrosoftCallbackComponent;  
    }
  }
];
