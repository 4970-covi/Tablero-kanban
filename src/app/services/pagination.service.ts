import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private rangoIni: number = 0;
  private rangoFin: number = 30;
  private readonly paso: number = 30;

  avanzar(): void {
    this.rangoIni += this.paso;
    this.rangoFin += this.paso;
  }

  retroceder(): void {
    if (this.rangoIni >= this.paso) {
      this.rangoIni -= this.paso;
      this.rangoFin -= this.paso;
    }
  }

  getRangoIni(): number {
    return this.rangoIni;
  }

  getRangoFin(): number {
    return this.rangoFin;
  }

  reiniciar(): void {
    this.rangoIni = 0;
    this.rangoFin = this.paso;
  }
}
