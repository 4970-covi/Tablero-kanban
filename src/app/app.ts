import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  tareas: any[] = [];
  rangoIni: number = 0;
  rangoFin: number = 30;

  constructor(private http: HttpClient) {
    this.obtenerTareas();
  }

  obtenerTareas(): void {
    const url = 'http://192.168.0.3:9091/api/Tareas/todas';
    const headers = new HttpHeaders({
      Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc1MDM0NjcyNCwiZXhwIjoxNzgxNDUwNzI0LCJpYXQiOjE3NTAzNDY3MjR9.NChZbZBfi3IZIVidfWujhmcwgtFYF4hDM1Xg7Z7z5J0',
      user: 'desa026',
      rangoIni: this.rangoIni.toString(),
      rangoFin: this.rangoFin.toString()
    });

    this.http.get<any>(url, { headers }).subscribe(response => {
      console.log('📬 Respuesta completa API:', response);

      if (response && Array.isArray(response.data)) {
        this.tareas = response.data;
        console.log('✅ Tareas cargadas:', this.tareas);
      } else {
        console.warn('⚠️ La respuesta no es un array válido:', response);
        this.tareas = [];
      }
    }, error => {
      console.error('❌ Error al obtener tareas:', error);
    });
  }

  mostrarMas(): void {
    this.rangoIni += 30;
    this.rangoFin += 30;
    this.obtenerTareas();
  }

  regresar(): void {
    if (this.rangoIni >= 30) {
      this.rangoIni -= 30;
      this.rangoFin -= 30;
      this.obtenerTareas();
    }
  }

  obtenerEstadosUnicos(): string[] {
    const estados = this.tareas.map(t => t.tarea_Estado);
    const unicos = Array.from(new Set(estados));
    console.log('🗂️ Estados únicos:', unicos);
    return unicos;
  }

  getTareasPorEstado(estado: string): any[] {
    const filtradas = this.tareas.filter(t => t.tarea_Estado === estado);
    console.log(`• Tareas para estado "${estado}":`, filtradas);
    return filtradas;
  }
}
