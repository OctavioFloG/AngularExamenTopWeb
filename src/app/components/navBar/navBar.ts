import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navBar.html',
  styleUrls: ['./navBar.css'],
})
export class NavBarComponent {
  // Estado del menú móvil (hamburguesa).
  isMenuOpen = false;

  constructor(
    private auth_service: Auth, // Servicio de autenticación.
    private router: Router      // Router para navegación.
  ) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onLogout(): void {
    this.auth_service.logout();
    this.router.navigateByUrl('/login');
  }
}
