import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EstudianteService } from '../services/estudiante/estudiante';
import { Auth } from '../services/auth/auth';
import { NavBarComponent } from '../components/navBar/navBar';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent],
  templateUrl: './calificaciones.html',
  styleUrls: ['./calificaciones.css'],
})
export class CalificacionesComponent implements OnInit {
  calificaciones: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(
    private estudianteService: EstudianteService,
    private auth: Auth,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCalificaciones();
  }

  cargarCalificaciones(): void {
    this.loading = true;
    this.cdRef.detectChanges();

    this.estudianteService.getCalificaciones().subscribe({
      next: (response) => {
        console.log('Respuesta de calificaciones:', response);
        if (response.code === 200 && response.data?.length > 0) {
          this.calificaciones = response.data;
          this.errorMsg = '';
        } else {
          this.errorMsg = 'No se encontraron calificaciones registradas.';
        }
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener calificaciones:', err);
        this.errorMsg = 'Error al cargar las calificaciones.';
        this.loading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
