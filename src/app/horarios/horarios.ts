import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EstudianteService } from '../services/estudiante/estudiante';
import { Auth } from '../services/auth/auth';
import { NavBarComponent } from '../components/navBar/navBar';

interface CeldaHorario {
  materia: string;
  clave: string;
  grupo: string;
  salon: string;
}

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

  periodo_info: any = null;

  // Horas visuales 7:00–19:00 (bloques 7-8, 8-9, ..., 18-19)
  horas: number[] = [];

  // Días manejados por la API
  dias = [
    { clave: 'lunes', etiqueta: 'Lunes' },
    { clave: 'martes', etiqueta: 'Martes' },
    { clave: 'miercoles', etiqueta: 'Miércoles' },
    { clave: 'jueves', etiqueta: 'Jueves' },
    { clave: 'viernes', etiqueta: 'Viernes' },
  ];

  // Matriz [hora][dia] -> CeldaHorario | null
  matriz_horarios: { [hora: number]: { [dia: string]: CeldaHorario | null } } = {};

  // ---- Colores por materia ----
  private readonly COLOR_COUNT = 12;
  private color_index_cache: Record<string, number> = {};

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
        console.log('[Horarios] Respuesta:', response);

        if (response.code === 200 && Array.isArray(response.data) && response.data.length > 0) {
          const periodo = response.data[0];
          this.periodo_info = periodo.periodo ?? null;

          if (Array.isArray(periodo.horario) && periodo.horario.length > 0) {
            this.horarios = periodo.horario;
            this.errorMsg = '';
            this.construirMatriz();
          } else {
            this.horarios = [];
            this.errorMsg = 'No hay horarios registrados en este periodo.';
          }
        } else {
          this.horarios = [];
          this.errorMsg = 'Error: formato inesperado en la respuesta.';
        }

        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('[Horarios] Error al obtener horarios:', err);
        this.errorMsg = 'Error al cargar los horarios.';
        this.loading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  private construirMatriz(): void {
    // Horas 7..18 => bloques 7-8 ... 18-19
    this.horas = Array.from({ length: 12 }, (_, i) => 7 + i);

    // Inicializar matriz vacía
    this.matriz_horarios = {};
    for (const hora of this.horas) {
      this.matriz_horarios[hora] = {};
      for (const dia of this.dias) {
        this.matriz_horarios[hora][dia.clave] = null;
      }
    }

    if (!this.horarios || this.horarios.length === 0) return;

    const asignar_dia = (dia_campo: string, campo_salon: string, registro: any): void => {
      const rango: string | undefined = registro[dia_campo]; // "17:00-18:00"
      if (!rango) return;

      const partes = rango.split('-');
      if (partes.length < 2) return;

      const inicio_hora = parseInt(partes[0].trim().split(':')[0], 10);
      const fin_hora = parseInt(partes[1].trim().split(':')[0], 10);
      if (isNaN(inicio_hora) || isNaN(fin_hora)) return;

      for (let h = inicio_hora; h < fin_hora; h++) {
        if (h < 7 || h >= 19) continue;

        const existente = this.matriz_horarios[h][dia_campo];
        const nueva_celda: CeldaHorario = {
          materia: registro.nombre_materia,
          clave: registro.clave_materia,
          grupo: registro.letra_grupo,
          salon: registro[campo_salon] ?? '',
        };

        if (!existente) {
          this.matriz_horarios[h][dia_campo] = nueva_celda;
        } else {
          // Choque improbable, concatenamos por si acaso
          this.matriz_horarios[h][dia_campo] = {
            materia: `${existente.materia} / ${nueva_celda.materia}`,
            clave: `${existente.clave} / ${nueva_celda.clave}`,
            grupo: `${existente.grupo} / ${nueva_celda.grupo}`,
            salon: `${existente.salon} / ${nueva_celda.salon}`,
          };
        }
      }
    };

    for (const r of this.horarios) {
      asignar_dia('lunes', 'lunes_clave_salon', r);
      asignar_dia('martes', 'martes_clave_salon', r);
      asignar_dia('miercoles', 'miercoles_clave_salon', r);
      asignar_dia('jueves', 'jueves_clave_salon', r);
      asignar_dia('viernes', 'viernes_clave_salon', r);
    }
  }

  formatearHora(hora: number): string {
    const sufijo = hora < 12 ? 'am' : 'pm';
    const hora12 = ((hora + 11) % 12) + 1;
    return `${hora12}:00 ${sufijo}`;
  }

  obtenerCelda(hora: number, dia_clave: string): CeldaHorario | null {
    return this.matriz_horarios?.[hora]?.[dia_clave] ?? null;
  }

  /** Devuelve la clase de color 'color-X' para la materia de esa celda. */
  colorClassFor(hora: number, dia_clave: string): string {
    const celda = this.obtenerCelda(hora, dia_clave);
    if (!celda) return '';
    const idx = this.colorIndexForSubject(celda.materia);
    return `color-${idx}`;
  }

  /** Índice de color estable por materia (hash + cache). */
  private colorIndexForSubject(nombre: string): number {
    if (this.color_index_cache[nombre] !== undefined) {
      return this.color_index_cache[nombre];
    }
    let h = 0;
    for (let i = 0; i < nombre.length; i++) {
      h = (h * 31 + nombre.charCodeAt(i)) >>> 0;
    }
    const idx = h % this.COLOR_COUNT;
    this.color_index_cache[nombre] = idx;
    return idx;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
