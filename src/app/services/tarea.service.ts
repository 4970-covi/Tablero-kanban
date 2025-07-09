import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TareaInterface } from '../interfaces/tarea.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private urlBase = 'http://localhost:9085/api/Tareas';

  constructor(private http: HttpClient) {}

  getTareasCreadas(token: string, usuario: string, rangoIni: number, rangoFin: number): Observable<{ data: TareaInterface[] }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      user: usuario,
      rangoini: rangoIni.toString(),
      rangofin: rangoFin.toString()
    });

    return this.http.get<{ data: TareaInterface[] }>(`${this.urlBase}/creadas`, { headers });
  }

  // Ya deberías tener este para la pestaña "todas"
  getTodas(token: string, rangoIni: number, rangoFin: number): Observable<{ data: TareaInterface[] }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      user: 'desa026', // o variable según sesión
      rangoini: rangoIni.toString(),
      rangofin: rangoFin.toString()
    });

    return this.http.get<{ data: TareaInterface[] }>(`${this.urlBase}/todas`, { headers });
  }
}
