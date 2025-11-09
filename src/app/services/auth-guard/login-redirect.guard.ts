import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../auth/auth';
import { SafeStorage } from '../../utils/storage';

@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {
    const token = this.auth.getToken() || SafeStorage.getItem('authToken');

    if (token) {
      console.log('[LoginRedirectGuard] Usuario ya autenticado → redirigiendo a Dashboard');
      this.router.navigateByUrl('/dashboard');
      return false; // Impide el acceso al login
    }

    return true;
  }
}
