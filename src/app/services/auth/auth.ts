import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { LoginResponse } from '../../../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  // 👇 variable en memoria (reactiva con signal)
  private _token = signal<string | null>(null);

  constructor(private http: HttpClient) {
    // 👇 solo ejecuta esto en el navegador, no en SSR
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('authToken');
      if (stored) this._token.set(stored);
    }
  }

  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post<LoginResponse>('/api/login', body).pipe(
      catchError((error) => {
        console.error('Login error:', error);
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
