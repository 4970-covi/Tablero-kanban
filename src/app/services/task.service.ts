import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TaskInterface } from '../interfaces/task.interface';
import { EstadoInterface } from '../interfaces/estado.interface';
import { PrioridadInterface } from '../interfaces/prioridad.interface';
import { TipoTareaInterface } from '../interfaces/tipo-tarea.interface';
import { ReferenciaInterface } from '../interfaces/referencia.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {
  baseUrl = 'http://localhost:9085/api/';

  constructor(private _http: HttpClient) {}

  // 🔐 Encabezados comunes
  private getHeaders(token: string, user = 'desa026', rangoIni = 0, rangoFin = 30): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'bearer ' + token,
      user,
      rangoIni: rangoIni.toString(),
      rangoFin: rangoFin.toString()
    });
  }

  getTodasLasTareas(token: string, rangoIni: number, rangoFin: number): Observable<ResponseInterface<TaskInterface[]>> {
    const headers = new HttpHeaders({
      Authorization: 'bearer ' + token,
      user: 'desa026',
      rangoIni: rangoIni.toString(),
      rangoFin: rangoFin.toString()
    });

    return this._http.get<ResponseInterface<TaskInterface[]>>(`${this.baseUrl}Tareas/todas`, { headers });
  }


  // ✅ Solo tareas creadas
  getTareasCreadas(rangoIni: number, rangoFin: number, token: string): Observable<ResponseInterface<TaskInterface[]>> {
    return this._http.get<ResponseInterface<TaskInterface[]>>(`${this.baseUrl}Tareas/creadas`, {
      headers: this.getHeaders(token, 'desa026', rangoIni, rangoFin)
    });
  }

  // ✅ Solo tareas asignadas
  getTareasAsignadas(rangoIni: number, rangoFin: number, token: string): Observable<ResponseInterface<TaskInterface[]>> {
    return this._http.get<ResponseInterface<TaskInterface[]>>(`${this.baseUrl}Tareas/asignadas`, {
      headers: this.getHeaders(token, 'desa026', rangoIni, rangoFin)
    });
  }

  // ✅ Estados
  getEstados(token: string): Observable<ResponseInterface<EstadoInterface[]>> {
    return this._http.get<ResponseInterface<EstadoInterface[]>>(`${this.baseUrl}Tareas/estados`, {
      headers: new HttpHeaders({ Authorization: 'bearer ' + token })
    });
  }

  // ✅ Prioridades
  getPrioridades(token: string): Observable<ResponseInterface<PrioridadInterface[]>> {
    return this._http.get<ResponseInterface<PrioridadInterface[]>>(`${this.baseUrl}Tareas/tipo/prioridad/sa`, {
      headers: new HttpHeaders({ Authorization: 'bearer ' + token })
    });
  }

  // ✅ Tipos de tarea
  getTiposTarea(token: string): Observable<ResponseInterface<TipoTareaInterface[]>> {
    return this._http.get<ResponseInterface<TipoTareaInterface[]>>(`${this.baseUrl}Tareas/tipos/sa`, {
      headers: new HttpHeaders({ Authorization: 'bearer ' + token })
    });
  }

  // ✅ Referencias (usa filtro solo cuando el usuario lo defina)
  getReferencias(token: string, filtro: string, empresa: string): Observable<ResponseInterface<ReferenciaInterface[]>> {
    const params = new HttpParams()
      .set('filtro', filtro)
      .set('empresa', empresa)
      .set('user', 'desa026');

    const headers = new HttpHeaders({
      Authorization: 'bearer ' + token
    });

    return this._http.get<ResponseInterface<ReferenciaInterface[]>>(
      `${this.baseUrl}Tareas/idReferencia`,
      { headers, params }
    );
  }
}
