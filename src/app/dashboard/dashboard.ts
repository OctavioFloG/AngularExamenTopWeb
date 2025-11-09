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
          console.log('Datos válidos');
          const estudiante = data.data;

          // Limpiar la cadena de la foto de perfil
          if (estudiante.foto) {
            estudiante.foto = estudiante.foto.replace(/\r?\n|\r/g, '').trim();
          }

          // Cargar los datos del estudiante
          this.estudiante = estudiante;
        } else {
          console.warn('Datos no válidos');
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