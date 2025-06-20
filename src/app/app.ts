import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  mostrarTabla: boolean = false;
  filtroInput: string = '';
  mostrarFiltro: boolean = false;


  // 🟦 Estados del tablero
  estadosDisponibles: string[] = [
    'Activo',
    'Atrasado',
    'Cerrado',
    'Entregado Cliente',
    'Pend Acept Client',
    'Pend Negociación',
    'Pend Facturación',
    'Revisión'
  ];
  estadosVisibles: string[] = [...this.estadosDisponibles];

  constructor(private http: HttpClient) {}

  // ✅ Cargar tareas según el filtro
  cargarTareasPorFiltro(): void {
    const url = 'http://192.168.0.3:9091/api/Tareas/idReferencia';

    const headers = new HttpHeaders({
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc1MDM0NjcyNCwiZXhwIjoxNzgxNDUwNzI0LCJpYXQiOjE3NTAzNDY3MjR9.NChZbZBfi3IZIVidfWujhmcwgtFYF4hDM1Xg7Z7z5J0',
      user: 'sa',
      filtro: this.filtroInput,
      empresa: '1'
    });

    this.http.get<any>(url, { headers }).subscribe(response => {
      this.tareas = response.data;
      this.mostrarTabla = true;
    }, error => {
      console.error('Error al cargar tareas con filtro:', error);
    });
  }

  // ✅ Mostrar/Ocultar columnas (estados)
  toggleEstado(estado: string): void {
    const index = this.estadosVisibles.indexOf(estado);
    if (index > -1) {
      this.estadosVisibles.splice(index, 1); // Oculta
    } else {
      this.estadosVisibles.push(estado); // Muestra
    }
  }
}
