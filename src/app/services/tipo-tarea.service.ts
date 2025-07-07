import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoTareaInterface } from '../interfaces/tipo-tarea.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class TipoTareaService {
  getTipos(token: string) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = 'http://localhost:9085/api/';

  constructor(private http: HttpClient) {}

  getTiposTarea(token: string): Observable<ResponseInterface<TipoTareaInterface[]>> {
    return this.http.get<ResponseInterface<TipoTareaInterface[]>>(`${this.baseUrl}Tareas/tipos/sa`, {
      headers: new HttpHeaders({ Authorization: 'bearer ' + token })
    });
  }
}
