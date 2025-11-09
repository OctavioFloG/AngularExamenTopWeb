import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../auth/auth';
import { SafeStorage } from '../../utils/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {
    let token = this.auth.getToken();

    if (!token) {
      const stored = SafeStorage.getItem('authToken');
      if (stored) {
        this.auth.setToken(stored);
        token = stored;
        console.log('[AuthGuard] Token restaurado desde SafeStorage');
      }
    }

    if (token) return true;

    console.warn('[AuthGuard] No se encontró token, redirigiendo...');
    this.router.navigateByUrl('/login');
    return false;
  }
}
