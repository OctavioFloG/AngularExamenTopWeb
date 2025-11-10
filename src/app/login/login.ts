import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SafeStorage } from '../utils/storage';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: Auth, private router: Router) { }

  ngOnInit(): void {
    const token = this.authService.getToken() || SafeStorage.getItem('authToken');

    if (token) {
      console.log('[Login] Token detectado, redirigiendo al dashboard...');
      this.router.navigateByUrl('/dashboard');
    }
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        const token = response?.message?.login?.token;

        if (token) {
          console.log('[Login] Inicio de sesión exitoso. Token:', token);
          this.authService.setToken(token);
          setTimeout(() => this.router.navigateByUrl('/dashboard'), 0);

        } else {
          console.warn('[Login] No se recibió token válido en la respuesta:', response);
          this.errorMessage = 'Inicio de sesión fallido. Verifica tus credenciales.';
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('[Login] Error en autenticación:', error);
        this.errorMessage = 'Error de autenticación. Verifica tus credenciales.';
        this.loading = false;
      }
    });
  }
}
