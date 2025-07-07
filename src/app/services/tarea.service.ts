import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskInterface } from '../interfaces/task.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class TareaService {
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

  getTodas(token: string, rangoIni: number, rangoFin: number): Observable<ResponseInterface<TaskInterface[]>> {
    return this.http.get<ResponseInterface<TaskInterface[]>>(`${this.baseUrl}Tareas/todas`, {
      headers: this.getHeaders(token, 'desa026', rangoIni, rangoFin)
    });
  }

  getCreadas(token: string, rangoIni: number, rangoFin: number): Observable<ResponseInterface<TaskInterface[]>> {
    return this.http.get<ResponseInterface<TaskInterface[]>>(`${this.baseUrl}Tareas/creadas`, {
      headers: this.getHeaders(token, 'desa026', rangoIni, rangoFin)
    });
  }

  getAsignadas(token: string, rangoIni: number, rangoFin: number): Observable<ResponseInterface<TaskInterface[]>> {
    return this.http.get<ResponseInterface<TaskInterface[]>>(`${this.baseUrl}Tareas/asignadas`, {
      headers: this.getHeaders(token, 'desa026', rangoIni, rangoFin)
    });
  }
}
