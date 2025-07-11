import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TareaInvitadoInterface } from '../interfaces/tarea-invitado.interface';

@Injectable({
  providedIn: 'root'
})
export class TareaInvitadosService {
  private apiUrl = 'http://localhost:9085/api/Tareas/invitados';

  constructor(private http: HttpClient) {}

  getInvitadoPorTarea(token: string, tareaId: number, user: string): Observable<{ data: TareaInvitadoInterface[] }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'user': user,
      'tarea': tareaId.toString()
    });

    return this.http.get<{ data: TareaInvitadoInterface[] }>(this.apiUrl, { headers });
  }
}
