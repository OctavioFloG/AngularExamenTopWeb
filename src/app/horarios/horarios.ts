import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api/api.service';
@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horarios.html',
  styleUrl: './horarios.css'
})
export class HorariosComponent implements OnInit {
  loading = true;
  errorMsg = '';
  horarios: any[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.api.get<any>('movil/horarios').subscribe({
      next: (res) => {
        console.log('[Horarios] Respuesta API:', res);
        if (res.code === 200 && res.data?.length > 0) {
          this.horarios = res.data;
        } else {
          this.errorMsg = 'No hay horarios disponibles.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Horarios] Error:', err);
        this.errorMsg = 'Error al cargar horarios.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
