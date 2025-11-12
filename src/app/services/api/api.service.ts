// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api/';

  constructor(protected http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = (typeof window !== 'undefined')
      ? localStorage.getItem('authToken') || ''
      : '';
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  get<T>(endpoint: string): Observable<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return this.http.get<T>(`${this.baseUrl}${cleanEndpoint}`, { headers: this.getHeaders() });
  }


  post<T>(endpoint: string, data: any): Observable<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return this.http.post<T>(`${this.baseUrl}${cleanEndpoint}`, data, { headers: this.getHeaders() });
  }

}
