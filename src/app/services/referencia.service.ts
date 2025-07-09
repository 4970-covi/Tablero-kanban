import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReferenciaInterface } from '../interfaces/referencia.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class ReferenciaService {
  private baseUrl = 'http://localhost:9085/api/';

  constructor(private http: HttpClient) {}

  buscarPorTexto(token: string, texto: string, user: string, empresa: string): Observable<ResponseInterface<ReferenciaInterface[]>> {
  const headers = new HttpHeaders({
    Authorization: 'bearer ' + token,
    user: user,
    filtro: texto,
    empresa: empresa
  });

  return this.http.get<ResponseInterface<ReferenciaInterface[]>>(
    'http://localhost:9085/api/Tareas/idReferencia',
    { headers }
  );
}
}