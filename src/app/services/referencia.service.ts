import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReferenciaInterface } from '../interfaces/referencia.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class ReferenciaService {
  private baseUrl = 'http://localhost:9085/api/';

  constructor(private http: HttpClient) {}

  getReferencias(token: string, filtro: string, empresa: string): Observable<ResponseInterface<ReferenciaInterface[]>> {
    const headers = new HttpHeaders({ Authorization: 'bearer ' + token });
    const params = new HttpParams()
      .set('filtro', filtro)
      .set('empresa', empresa)
      .set('user', 'desa026');

    return this.http.get<ResponseInterface<ReferenciaInterface[]>>(`${this.baseUrl}Tareas/idReferencia`, {
      headers,
      params
    });
  }
}
