import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: Auth, private router: Router) { }

  onLogin(): void {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe(
        {
          next: (response) => {
            this.authService.setToken(response.message.login.token);
            if (response.message.login.token) {
              console.log('Inicio de sesión exitoso. Token almacenado.');
              console.log('Token:', response.message.login.token);
            this.router.navigateByUrl('/dashboard');
            } else {
              this.errorMessage = 'Inicio de sesión fallido. Por favor verifica tus credenciales.';
            }
          },
          error: (error) => {
            this.errorMessage = 'Error de autenticación. Por favor verifica tus credenciales.';
          }
        }
      );
    } else {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
    }
  }

  //imprimir token
  printToken(): void {
    const token = this.authService.getToken();
    console.log('Auth Token:', token);
  }

}
