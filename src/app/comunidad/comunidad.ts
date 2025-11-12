import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../components/navBar/navBar';

interface EventoComunidad {
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  tipo: 'Academico' | 'Cultural' | 'Deportivo';
  descripcion: string;
}

@Component({
  selector: 'app-comunidad',
  standalone: true,
  imports: [CommonModule, RouterModule, NavBarComponent],
  templateUrl: './comunidad.html',
  styleUrls: ['./comunidad.css'],
})
export class ComunidadComponent implements OnInit {
  // Lista simulada de próximos eventos visibles en la vista.
  lista_eventos: EventoComunidad[] = [];

  ngOnInit(): void {
    this.cargarEventosSimulados();
  }

  // Carga de eventos simulados (sin llamadas reales a API).
  private cargarEventosSimulados(): void {
    this.lista_eventos = [
      {
        titulo: 'Feria de proyectos de ingeniería',
        fecha: '15 Nov 2025',
        hora: '10:00 - 14:00',
        lugar: 'Edificio de Innovación, TecNM Celaya',
        tipo: 'Academico',
        descripcion:
          'Exposición de proyectos destacados de las carreras de sistemas, electrónica y mecánica. Espacio para networking con empresas invitadas.',
      },
      {
        titulo: 'Taller: Portafolio profesional en LinkedIn',
        fecha: '20 Nov 2025',
        hora: '12:00 - 13:30',
        lugar: 'Sala Audiovisual 2',
        tipo: 'Academico',
        descripcion:
          'Guía práctica para optimizar tu perfil, mostrar proyectos y prepararte para prácticas profesionales.',
      },
      {
        titulo: 'Night Coding Challenge',
        fecha: '28 Nov 2025',
        hora: '18:00 - 22:00',
        lugar: 'Laboratorio de Cómputo 5',
        tipo: 'Deportivo',
        descripcion:
          'Reto de programación en equipo con snacks, premios y reconocimiento para los mejores equipos.',
      },
      {
        titulo: 'Festival Cultural TecNM',
        fecha: '05 Dic 2025',
        hora: '16:00 - 20:00',
        lugar: 'Explanada principal',
        tipo: 'Cultural',
        descripcion:
          'Música en vivo, presentaciones artísticas, muestra gastronómica y actividades para toda la comunidad.',
      },
    ];
  }

  // Texto legible según el tipo del evento (para la etiqueta de color).
  obtenerEtiquetaTipo(evento: EventoComunidad): string {
    switch (evento.tipo) {
      case 'Academico':
        return 'Académico';
      case 'Cultural':
        return 'Cultural';
      case 'Deportivo':
        return 'Tecnológico / Retos';
      default:
        return 'Evento';
    }
  }
}
