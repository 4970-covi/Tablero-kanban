import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import { ResponseInterface } from '../interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private baseUrl = 'http://localhost:9085/api/';

  constructor(private http: HttpClient) {}

  buscarUsuarios(token: string, filtro: string, user: string): Observable<ResponseInterface<UsuarioInterface[]>> {
    const headers = new HttpHeaders({
      Authorization: 'bearer ' + token,
      user: user,
      filtro: filtro
    });

    return this.http.get<ResponseInterface<UsuarioInterface[]>>(`${this.baseUrl}usuarios`, { headers });
  }
}
