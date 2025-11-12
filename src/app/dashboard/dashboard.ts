import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EstudianteService } from '../services/estudiante/estudiante';
import { Auth } from '../services/auth/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavBarComponent } from '../components/navBar/navBar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  estudiante: any;
  loading = true;
  errorMsg = '';

  constructor(
    private estudianteService: EstudianteService,
    private auth: Auth,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    this.cdRef.detectChanges();

    this.estudianteService.getDatosEstudiante().subscribe({
      next: (data) => {
        if (data?.code === 200 && data?.data) {
          this.estudiante = data.data;
          this.errorMsg = '';
        } else {
          this.errorMsg = 'No se encontraron datos.';
        }
        this.loading = false;

        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al obtener datos:', err);
        this.errorMsg = 'Error al cargar los datos.';
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
