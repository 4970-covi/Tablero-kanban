import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class TaskService {
    baseUrl = 'http://localhost:9085/api/';


    /**
     *
     */
    constructor(
        private _http: HttpClient,
    ) {
        
        
    }

    getTasks(rangoIni: number, rangoFin: number, token:string) {


        const headers = new HttpHeaders({
            Authorization: 'bearer '+ token,
            user: 'desa026',
            rangoIni: rangoIni.toString(),
            rangoFin: rangoFin.toString()
        });

        return this._http.get(`${this.baseUrl}Tareas/todas`, {headers : headers})

    }





}