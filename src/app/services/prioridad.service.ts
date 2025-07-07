import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrioridadInterface } from '../interfaces/prioridad.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class PrioridadService {
  private baseUrl = 'http://localhost:9085/api/';

  constructor(private http: HttpClient) {}

  getPrioridades(token: string): Observable<ResponseInterface<PrioridadInterface[]>> {
    return this.http.get<ResponseInterface<PrioridadInterface[]>>(`${this.baseUrl}Tareas/tipo/prioridad/sa`, {
      headers: new HttpHeaders({ Authorization: 'bearer ' + token })
    });
  }
}
