import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth/auth';

@Component({
  selector: 'app-login', // Componente de inicio de sesión.
  standalone: true, // Es standalone.
  imports: [CommonModule, FormsModule], // Usamos formularios y directivas comunes.
  templateUrl: './login.html', // Vista.
  styleUrls: ['./login.css'], // Estilos.
})
export class LoginComponent { // Clase del login.

  correo: string = ''; // Correo del usuario.
  contrasena: string = ''; // Contraseña del usuario.
  cargando: boolean = false; // Indica si se está enviando la petición.
  mensajeError: string = ''; // Mensaje de error a mostrar.

  constructor(
    private authService: Auth, // Servicio de autenticación.
    private router: Router, // Router para redireccionar.
  ) {}

  onLogin(): void { // Se ejecuta al enviar el formulario.
    this.mensajeError = ''; // Limpiamos mensaje previo.

    if (!this.correo || !this.contrasena) { // Validamos campos.
      this.mensajeError = 'Por favor ingresa tu correo institucional y contraseña.'; // Error si faltan.
      return;
    }

    this.cargando = true; // Activamos loading.

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: (respuesta) => { // Si la API respondió bien.
        const token = respuesta?.message?.login?.token; // Extraemos token.
        if (token) { // Si existe token.
          this.authService.setToken(token); // Guardamos token por si acaso.
          console.log('Inicio de sesión exitoso.'); // Log.
          this.cargando = false; // Quitamos loading.
          this.router.navigate(['/dashboard']); // Vamos al dashboard.
        } else {
          this.cargando = false;
          this.mensajeError = 'La respuesta del servidor no contiene un token válido.'; // Error si no vino token.
        }
      },
      error: (error) => { // Si hay error (credenciales mal, server caído, etc).
        console.error('Error en login:', error); // Log técnico.
        this.cargando = false; // Quitamos loading SIEMPRE (adiós “cargando infinito”).
        if (error.status === 400 || error.status === 401) {
          this.mensajeError = 'Credenciales incorrectas. Verifica tu correo y contraseña del SII.'; // Error de auth.
        } else {
          this.mensajeError = 'No fue posible conectar con el servidor. Intenta nuevamente más tarde.'; // Error genérico.
        }
      },
    });
  }

  printToken(): void { // Método opcional para ver token en consola.
    const token = this.authService.getToken(); // Obtenemos token guardado.
    console.log('Auth Token:', token); // Lo mostramos.
  }
}
