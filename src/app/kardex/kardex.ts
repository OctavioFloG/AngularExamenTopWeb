import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api/api.service';
@Component({
  selector: 'app-kardex',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kardex.html',
  styleUrl: './kardex.css'
})
export class KardexComponent implements OnInit {
  loading = true;
  errorMsg = '';
  materias: any[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.api.get<any>('movil/kardex').subscribe({
      next: (res) => {
        console.log('[Kardex] Respuesta API:', res);
        if (res.code === 200 && res.data?.length > 0) {
          this.materias = res.data;
        } else {
          this.errorMsg = 'No se encontraron registros en el kardex.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Kardex] Error:', err);
        this.errorMsg = 'Error al cargar kardex.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
