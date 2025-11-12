import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EstudianteService } from '../services/estudiante/estudiante';
import { Auth } from '../services/auth/auth';
import { NavBarComponent } from '../components/navBar/navBar';

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
        console.log('[Kardex] Respuesta:', response);

        if (response.code === 200 && response.data?.kardex?.length > 0) {
          this.kardex = response.data.kardex;
          this.avance = response.data.porcentaje_avance ?? 0;

          const agrupado: Record<number, any[]> = this.kardex.reduce(
            (acc: Record<number, any[]>, materia) => {
              const sem = materia.semestre || 0;
              if (!acc[sem]) acc[sem] = [];
              acc[sem].push(materia);
              return acc;
            },
            {}
          );

          // Ordena materias alfabéticamente dentro de cada semestre
          Object.keys(agrupado).forEach((key) => {
            const sem = Number(key);
            agrupado[sem].sort((a, b) =>
              (a.nombre_materia || '').localeCompare(b.nombre_materia || '')
            );
          });

          this.kardexPorSemestre = agrupado;
          this.errorMsg = '';
        } else {
          this.errorMsg = 'No se encontraron registros en el Kardex.';
        }

        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('[Kardex] Error al obtener datos:', err);
        this.errorMsg = 'Error al cargar el Kardex.';
        this.loading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  // Para el keyvalue pipe: ordena por número de semestre ascendente
  ordenarSemestres(
    a: { key: string; value: any },
    b: { key: string; value: any }
  ): number {
    return Number(a.key) - Number(b.key);
  }

  getCalificacionClass(calificacion: any): string {
    const valor = Number(calificacion);

    if (isNaN(valor)) return 'grade-sin-dato';
    if (valor >= 90) return 'grade-excelente';
    if (valor >= 80) return 'grade-buena';
    if (valor >= 70) return 'grade-aprobatoria';
    if (valor > 0) return 'grade-reprobada';
    return 'grade-sin-dato';
  }

  getFilaClass(calificacion: any): string {
    const valor = Number(calificacion);
    if (isNaN(valor) || valor === 0) return '';
    if (valor < 70) return 'row-reprobada';
    return '';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
