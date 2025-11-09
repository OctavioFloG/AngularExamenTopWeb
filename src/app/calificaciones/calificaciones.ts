import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.css'
})
export class CalificacionesComponent implements OnInit {
  loading = true;
  errorMsg = '';
  periodo: any = null;
  materias: any[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log('[Calificaciones] Cargando datos...');
    this.api.get<any>('movil/calificaciones').subscribe({
      next: (res) => {
        console.log('[Calificaciones] Respuesta API:', res);

        if (res.code === 200 && res.data?.length > 0) {
          const periodoActual = res.data[0];
          this.periodo = periodoActual.periodo;
          this.materias = periodoActual.materias;
        } else {
          this.errorMsg = 'No hay calificaciones registradas.';
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Calificaciones] Error al obtener datos:', err);
        this.errorMsg = 'Error al cargar calificaciones.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calcularPromedio(calificaciones: any[]): string {
    const valores = calificaciones
      .map(c => parseFloat(c.calificacion))
      .filter(n => !isNaN(n));
    if (valores.length === 0) return '-';
    const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
    return promedio.toFixed(1);
  }
}


