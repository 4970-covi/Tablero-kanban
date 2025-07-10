// src/app/services/tareas-creadas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TareaInterface } from '../interfaces/tarea.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class TareasCreadasService {
  private baseUrl = 'http://localhost:9085/api/';

  constructor(private http: HttpClient) {}

  private getHeaders(token: string, user = 'desa026', rangoIni = 0, rangoFin = 30) {
    return new HttpHeaders({
      Authorization: 'bearer ' + token,
      user,
      rangoIni: rangoIni.toString(),
      rangoFin: rangoFin.toString()
    });
  }

  getCreadas(token: string, rangoIni: number, rangoFin: number): Observable<ResponseInterface<TareaInterface[]>> {
    return this.http.get<ResponseInterface<TareaInterface[]>>(`${this.baseUrl}Tareas/creadas`, {
      headers: this.getHeaders(token, 'desa026', rangoIni, rangoFin)
    });
  }
}
