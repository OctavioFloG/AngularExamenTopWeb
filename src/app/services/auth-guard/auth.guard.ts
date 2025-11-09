import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../auth/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {
    // ✅ Intenta leer directamente del signal o del localStorage
    let token = this.auth.getToken();

    if (!token && typeof window !== 'undefined') {
      const stored = localStorage.getItem('authToken');
      if (stored) {
        this.auth.setToken(stored);
        token = stored;
        console.log('[AuthGuard] Token restaurado manualmente desde localStorage');
      }
    }

    if (token) {
      return true;
    }

    console.warn('[AuthGuard] No se encontró token, redirigiendo...');
    this.router.navigateByUrl('/login');
    return false;
  }
}
