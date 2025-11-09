import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { LoginResponse } from '../../../interfaces/login-response';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  //Cargamos desde .env o environment.ts
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    const body = { email, password };

    return this.http.post<LoginResponse>(`/api/login`, body)
      .pipe(
        catchError((error) => {
          console.error('Login error:', error);
          throw error;
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
