import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { EstudianteService } from '../services/estudiante/estudiante';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  estudiante: any;
  loading: boolean = true;
  errorMsg: string = '';

  constructor(private estudianteService: EstudianteService) { }

  ngOnInit(): void {
    this.estudianteService.getDatosEstudiante().subscribe({
      next: (data) => {
        console.log('Respuesta API:', data);
        if (data.code === 200 && data.data) {
          this.estudiante = data.data;
        } else {
          this.errorMsg = 'No se encontraron datos del estudiante.';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener los datos del estudiante:', error);
        this.errorMsg = 'Error al cargar los datos del estudiante.';
        this.loading = false;
      }
    });
  }
}