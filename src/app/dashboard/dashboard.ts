import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { EstudianteService } from '../services/estudiante/estudiante';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  estudiante: any = null;
  loading = true;
  errorMsg = '';

  constructor(
    private estudianteService: EstudianteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Dashboard inicializado...');
    this.estudianteService.getDatosEstudiante().subscribe({
      next: (data) => {
        console.log('Respuesta API:', data);

        if (data?.code === 200 && data?.data) {
          const estudiante = data.data;

          if (estudiante.foto) {
            estudiante.foto = estudiante.foto.replace(/\r?\n|\r/g, '').trim();
          }

          this.estudiante = estudiante;
          this.errorMsg = '';
        } else {
          this.errorMsg = 'No se encontraron datos del estudiante.';
        }

        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener los datos del estudiante:', error);
        this.errorMsg = 'Error al cargar los datos del estudiante.';
        this.loading = false;

        this.cdr.detectChanges();
      },
    });
  }
}
