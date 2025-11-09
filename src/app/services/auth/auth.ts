import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginResponse } from '../../../interfaces/login-response';

@Injectable({
  providedIn: 'root',
})
export class Auth extends ApiService {

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };

    return this.post<LoginResponse>('login', body)
      .pipe(
        catchError((error) => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  setToken(token: string) {
    localStorage.setItem('authToken', token); // Guarda el token en localStorage del navegador
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');  // Obtiene el token desde localStorage
  }

  logout(): void {
    localStorage.removeItem('authToken');  // Elimina el token al cerrar sesión
  }

  isAuthenticated(): boolean {
    return !!this.getToken();  // Si hay un token, el usuario está autenticado
  }

}
