import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TareaInterface } from '../interfaces/tarea.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class TareasInvitacionesService {
  getInvitadas(token: string, ini: number, fin: number) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = 'http://localhost:9085/api/';

  constructor(private http: HttpClient) {}

  private getHeaders(token: string, user = 'desa026', rangoIni = 0, rangoFin = 30): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'bearer ' + token,
      user,
      rangoIni: rangoIni.toString(),
      rangoFin: rangoFin.toString()
    });
  }

  getInvitaciones(token: string, rangoIni: number, rangoFin: number): Observable<ResponseInterface<TareaInterface[]>> {
    return this.http.get<ResponseInterface<TareaInterface[]>>(
      `${this.baseUrl}Tareas/invitaciones`,
      { headers: this.getHeaders(token, 'desa026', rangoIni, rangoFin) }
    );
  }
}
