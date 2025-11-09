import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService extends ApiService {

  getDatosEstudiante(): Observable<any> {
    return this.get<any>('movil/estudiante');
  }

  getKardex(): Observable<any> {
    return this.get<any>('movil/estudiante/kardex');
  }

  getHorarios(): Observable<any> {
    return this.get<any>('movil/estudiante/horarios');
  }

  getCalificaciones(): Observable<any> {
    return this.get<any>('movil/estudiante/calificaciones');
  }
}
