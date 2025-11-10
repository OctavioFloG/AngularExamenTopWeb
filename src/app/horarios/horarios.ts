import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EstudianteService } from '../services/estudiante/estudiante';
import { Auth } from '../services/auth/auth';
import { NavBarComponent } from '../components/navBar/navBar';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent],
  templateUrl: './horarios.html',
  styleUrls: ['./horarios.css'],
})
export class HorariosComponent implements OnInit {
  horarios: any[] = [];
  loading = true;
  errorMsg = '';

  constructor(
    private estudianteService: EstudianteService,
    private auth: Auth,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarHorarios();
  }

  cargarHorarios(): void {
    this.loading = true;
    this.cdRef.detectChanges();

    this.estudianteService.getHorarios().subscribe({
      next: (response) => {
        console.log('Respuesta de horarios:', response);

        // El backend envía data[0].horario, lo convertimos a un array plano
        if (response.code === 200 && Array.isArray(response.data)) {
          const periodo = response.data[0];
          if (periodo?.horario?.length > 0) {
            this.horarios = periodo.horario;
            this.errorMsg = '';
          } else {
            this.errorMsg = 'No hay horarios registrados en este periodo.';
          }
        } else {
          this.errorMsg = 'Error: formato inesperado en la respuesta.';
        }

        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener horarios:', err);
        this.errorMsg = 'Error al cargar los horarios.';
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
