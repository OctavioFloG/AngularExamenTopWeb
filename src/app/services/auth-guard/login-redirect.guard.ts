// src/app/services/auth-guard/login-redirect.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../auth/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {
    const token = this.auth.getToken() || (typeof window !== 'undefined' && localStorage.getItem('authToken'));
    if (token) {
      console.log('[LoginRedirectGuard] Usuario ya autenticado, redirigiendo al dashboard...');
      this.router.navigateByUrl('/dashboard');
      return false;
    }
    return true;
  }
}
