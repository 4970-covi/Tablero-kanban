import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadoInterface } from '../interfaces/estado.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class EstadoService {
  private baseUrl = 'http://localhost:9085/api/';

  constructor(private http: HttpClient) {}

  getEstados(token: string): Observable<ResponseInterface<EstadoInterface[]>> {
    return this.http.get<ResponseInterface<EstadoInterface[]>>(`${this.baseUrl}Tareas/estados`, {
        headers: new HttpHeaders({ Authorization: 'bearer ' + token })
    });
    }

}
