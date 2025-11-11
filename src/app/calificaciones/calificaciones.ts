import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EstudianteService } from '../services/estudiante/estudiante';
import { Auth } from '../services/auth/auth';
import { NavBarComponent } from '../components/navBar/navBar';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavBarComponent],
  templateUrl: './calificaciones.html',
  styleUrls: ['./calificaciones.css'],
})
export class CalificacionesComponent implements OnInit {
  loading: boolean = true;
  errorMsg: string = '';
  calificaciones: any[] = [];

  // Texto para filtrar por nombre de materia o datos del periodo.
  filtro_texto: string = '';

  constructor(
    private estudiante_service: EstudianteService,
    private auth_service: Auth,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCalificaciones();
  }

  cargarCalificaciones(): void {
    this.loading = true;
    this.cdRef.detectChanges();

    this.estudiante_service.getCalificaciones().subscribe({
      next: (response) => {
        console.log('[Calificaciones] Respuesta:', response);

        if (response.code === 200 && Array.isArray(response.data)) {
          // Estructura esperada: [{ periodo, materias: [...] }, ...]
          this.calificaciones = response.data;
          this.errorMsg = '';
        } else {
          this.calificaciones = [];
          this.errorMsg = 'No se encontraron calificaciones registradas.';
        }

        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('[Calificaciones] Error al obtener datos:', err);
        this.errorMsg = 'Error al cargar las calificaciones.';
        this.loading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  /**
   * Siempre construye 4 parciales por materia.
   * Si faltan, se rellenan como pendientes (null).
   */
  buildParciales(materia: any): { etiqueta: string; calificacion: number | null }[] {
    const lista = materia?.calificaiones || [];
    const resultado: { etiqueta: string; calificacion: number | null }[] = [];

    for (let i = 0; i < 4; i++) {
      const nota = lista[i];
      resultado.push({
        etiqueta: nota?.descripcion || `Parcial ${i + 1}`,
        calificacion:
          nota?.calificacion === undefined || nota?.calificacion === null
            ? null
            : Number(nota.calificacion),
      });
    }

    return resultado;
  }

  /**
   * Devuelve los periodos filtrados por:
   * - nombre de materia
   * - descripción / clave / año del periodo
   */
  obtenerPeriodosFiltrados(): any[] {
    const termino = this.filtro_texto.trim().toLowerCase();

    if (!termino) {
      return this.calificaciones;
    }

    return this.calificaciones
      .map((item) => {
        const periodo = item.periodo || {};
        const materias = item.materias || [];

        const coincidePeriodo =
          (periodo.descripcion_periodo || '').toLowerCase().includes(termino) ||
          String(periodo.clave_periodo || '').toLowerCase().includes(termino) ||
          String(periodo.anio || '').toLowerCase().includes(termino);

        if (coincidePeriodo) {
          // Si coincide el periodo, regresamos todas sus materias.
          return { ...item, materias };
        }

        // Si no coincide el periodo, filtramos materias por nombre.
        const materiasFiltradas = materias.filter((m: any) =>
          (m.materia?.nombre_materia || '').toLowerCase().includes(termino)
        );

        if (materiasFiltradas.length > 0) {
          return { ...item, materias: materiasFiltradas };
        }

        return null;
      })
      .filter(
        (it: any) => it && Array.isArray(it.materias) && it.materias.length > 0
      );
  }

  /**
   * Clase según calificación para colorear el recuadro del parcial.
   */
  getParcialClass(valor: number | null): string {
    if (valor === null) return 'parcial-pendiente';
    if (valor >= 70) return 'parcial-ok';
    return 'parcial-bad';
  }

  logout(): void {
    this.auth_service.logout();
    this.router.navigateByUrl('/login');
  }
}
