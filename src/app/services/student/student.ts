import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentResponse } from '../../../interfaces/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = '/api/movil/estudiante';

  constructor(private http: HttpClient) {}

  getStudentData(): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(this.apiUrl);
  }
}
