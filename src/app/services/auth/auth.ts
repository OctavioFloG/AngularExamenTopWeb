// src/app/services/auth/auth.ts
import { Injectable, signal, computed } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoginResponse } from '../../../interfaces/login-response';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private _token = signal<string | null>(null);

  constructor(private api: ApiService) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('authToken');
      if (stored) {
        this._token.set(stored);
        console.log('[Auth] Token restaurado desde localStorage');
      }
    }
  }

  login(email: string, password: string) {
    const body = { email, password };
    return this.api.post<LoginResponse>('login', body).pipe(
      catchError((error) => {
        console.error('[Auth] Error al iniciar sesión:', error);
        return throwError(() => error);
      })
    );
  }

  setToken(token: string): void {
    this._token.set(token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    if (this._token()) return this._token();
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  logout(): void {
    this._token.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  readonly isAuthenticated = computed(() => !!this._token());
}
