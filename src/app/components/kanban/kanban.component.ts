import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TaskInterface } from '../../interfaces/task.interface';
import { TaskService } from '../../services/task.service';
import { ResponseInterface } from '../../interfaces/response.interface';
import { Prioridad } from '../../interfaces/enum.interface';
import { PaginationService } from '../../services/pagination.service';



@Component({
  selector: 'app-kanban',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  providers: [
    TaskService,
  ]
})
export class Kanban {


  token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc1MDM0NjcyNCwiZXhwIjoxNzgxNDUwNzI0LCJpYXQiOjE3NTAzNDY3MjR9.NChZbZBfi3IZIVidfWujhmcwgtFYF4hDM1Xg7Z7z5J0";

  tareas: TaskInterface[] = [];
  tareasFiltradas: TaskInterface[] = [];

  rangoIni: number = 0;
  rangoFin: number = 30;
  prioridadSeleccionada: number | null = null;
  Prioridad = Prioridad;


  constructor(
    private http: HttpClient,
    private _taskService: TaskService,
    private paginationService: PaginationService

  ) {
    this.obtenerTareas();
  }

  obtenerTareas(): void {


    this.tareas = [];
    this.tareasFiltradas = [];

    this._taskService.getTasks(this.rangoIni, this.rangoFin, this.token).subscribe(response => {

      let res: ResponseInterface = <ResponseInterface>response;

      this.tareas = res.data;
      this.aplicarFiltro(); 
    }, error => {
      console.error('Error al obtener tareas:', error);
    });
  }

  
  aplicarFiltro(): void {
    if (this.prioridadSeleccionada != null) {
      this.tareasFiltradas = this.tareas.filter(
        tarea => tarea.nivel_Prioridad === this.prioridadSeleccionada
      );
    } else {
      this.tareasFiltradas = this.tareas;
    }
  }



  obtenerEstadosUnicos(): string[] {
    const estados = this.tareasFiltradas.map(t => t.tarea_Estado);
    const unicos = Array.from(new Set(estados));
    console.log(' Estados únicos:', unicos);
    return unicos;
  }

  getTareasPorEstado(estado: string): TaskInterface[] {
    return this.tareasFiltradas.filter(t => t.tarea_Estado === estado);
  }

  filtrarPorPrioridad(nivel: number | null): void {
    this.prioridadSeleccionada = nivel;
    this.aplicarFiltro();
  }
  
  mostrarMas(): void {
    this.paginationService.avanzar();
    this.obtenerTareas();
  }

  regresar(): void {
    this.paginationService.retroceder();
    this.obtenerTareas();
  }




}
