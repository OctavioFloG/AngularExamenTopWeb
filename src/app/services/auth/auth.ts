import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { SafeStorage } from '../../utils/storage';
import { LoginResponse } from '../../../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private _token = signal<string | null>(null);

  constructor(private http: HttpClient) {
    const stored = SafeStorage.getItem('authToken');
    if (stored) {
      this._token.set(stored);
      console.log('[Auth] Token restaurado desde SafeStorage');
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
    SafeStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return this._token() ?? SafeStorage.getItem('authToken');
  }

  logout(): void {
    this._token.set(null);
    SafeStorage.removeItem('authToken');
  }

  readonly isAuthenticated = computed(() => !!this._token());
}
