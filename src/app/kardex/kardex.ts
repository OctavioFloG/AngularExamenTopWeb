import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EstudianteService } from '../services/estudiante/estudiante';
import { Auth } from '../services/auth/auth';
import { NavBarComponent } from "../components/navBar/navBar";

@Component({
  selector: 'app-kardex',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent],
  templateUrl: './kardex.html',
  styleUrls: ['./kardex.css'],
})
export class KardexComponent implements OnInit {
  kardex: any[] = [];
  avance = 0;
  loading = true;
  errorMsg = '';
  kardexPorSemestre: Record<number, any[]> = {};

  constructor(
    private estudianteService: EstudianteService,
    private auth: Auth,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarKardex();
  }

  cargarKardex(): void {
    this.loading = true;
    this.cdRef.detectChanges();

    this.estudianteService.getKardex().subscribe({
      next: (response) => {
        console.log('Respuesta de Kardex:', response);

        if (response.code === 200 && response.data?.kardex?.length > 0) {
          this.kardex = response.data.kardex;
          this.avance = response.data.porcentaje_avance ?? 0;

          // Agrupamos por semestre
          this.kardexPorSemestre = this.kardex.reduce(
            (acc: Record<number, any[]>, materia) => {
              const sem = materia.semestre || 0;
              if (!acc[sem]) acc[sem] = [];
              acc[sem].push(materia);
              return acc;
            },
            {}
          );

          this.errorMsg = '';
        } else {
          this.errorMsg = 'No se encontraron registros en el Kardex.';
        }

        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener Kardex:', err);
        this.errorMsg = 'Error al cargar el Kardex.';
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
