import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TaskInterface } from '../../interfaces/task.interface';
import { EstadoInterface } from '../../interfaces/estado.interface';
import { PrioridadInterface } from '../../interfaces/prioridad.interface';
import { TipoTareaInterface } from '../../interfaces/tipo-tarea.interface';
import { ReferenciaInterface } from '../../interfaces/referencia.interface';

import { TaskService } from '../../services/task.service';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  providers: [TaskService]
})
export class Kanban implements OnInit {

  tareas: TaskInterface[] = [];
  tareasFiltradas: TaskInterface[] = [];

  estadosDisponibles: EstadoInterface[] = [];
  prioridadesDisponibles: PrioridadInterface[] = [];
  tiposTareaDisponibles: TipoTareaInterface[] = [];
  referenciasDisponibles: ReferenciaInterface[] = [];

  totalRegistros: number = 0;
  tareasPorPagina: number = 30;
  paginaActual: number = 1;
  paginasTotales: number = 0;
  paginasVisibles: number[] = [];

  filtroReferencia: string = '';
  estadoSeleccionado: string = '';
  prioridadSeleccionada: number | null = null;
  tipoSeleccionado: number | null = null;
  referenciaSeleccionada: number | null = null;

  token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc1MDM0NjcyNCwiZXhwIjoxNzgxNDUwNzI0LCJpYXQiOjE3NTAzNDY3MjR9.NChZbZBfi3IZIVidfWujhmcwgtFYF4hDM1Xg7Z7z5J0';
  usuario: string = 'desa026';

  constructor(
    private taskService: TaskService,
    private pagination: PaginationService
  ) { }

  ngOnInit(): void {
    this.cargarFiltros();
    this.obtenerTareas();
  }

  obtenerTareas(): void {
    const rangoIni = (this.paginaActual - 1) * this.tareasPorPagina;
    const rangoFin = this.paginaActual * this.tareasPorPagina;

    this.taskService.getTodasLasTareas(this.token, rangoIni, rangoFin).subscribe({
      next: (res: { data: TaskInterface[] }) => {
        this.tareas = res.data;
        this.totalRegistros = res.data[0]?.registros || 0;
        this.paginasTotales = Math.ceil(this.totalRegistros / this.tareasPorPagina);
        this.generarPaginacion();
        this.aplicarFiltro();
      },
      error: err => console.error('Error al obtener tareas:', err)
    });
  }

  generarPaginacion(): void {
    const total = this.paginasTotales;
    const actual = this.paginaActual;
    const visible: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) visible.push(i);
    } else {
      if (actual <= 4) {
        visible.push(1, 2, 3, 4, 5, -1, total);
      } else if (actual >= total - 3) {
        visible.push(1, -1, total - 4, total - 3, total - 2, total - 1, total);
      } else {
        visible.push(1, -1, actual - 1, actual, actual + 1, -1, total);
      }
    }

    this.paginasVisibles = visible;
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.paginasTotales) return;
    this.paginaActual = pagina;
    this.obtenerTareas();
  }

  aplicarFiltro(): void {
    this.tareasFiltradas = this.tareas.filter(t => {
      const coincideEstado = this.estadoSeleccionado ? t.tarea_Estado === this.estadoSeleccionado : true;
      const coincidePrioridad = this.prioridadSeleccionada != null ? t.nivel_Prioridad === this.prioridadSeleccionada : true;
      const coincideTipo = this.tipoSeleccionado != null ? t.tipo_Tarea === this.tipoSeleccionado : true;
      const coincideReferencia = this.filtroReferencia.trim()
        ? t.descripcion_Referencia.toLowerCase().includes(this.filtroReferencia.toLowerCase())
        : true;

      return coincideEstado && coincidePrioridad && coincideTipo && coincideReferencia;
    });
  }

  cargarFiltros(): void {
    this.taskService.getEstados(this.token).subscribe(res => this.estadosDisponibles = res.data);
    this.taskService.getPrioridades(this.token).subscribe(res => this.prioridadesDisponibles = res.data);
    this.taskService.getTiposTarea(this.token).subscribe(res => this.tiposTareaDisponibles = res.data);
  }

  buscarReferencias(): void {
    if (this.filtroReferencia.trim().length >= 2) {
      this.taskService.getReferencias(this.token, this.filtroReferencia.trim(), '1').subscribe({
        next: res => this.referenciasDisponibles = res.data,
        error: err => console.error('Error al buscar referencias', err)
      });
    } else {
      this.referenciasDisponibles = [];
    }
  }

  limpiarReferencia(): void {
    this.referenciaSeleccionada = null;
    this.filtroReferencia = '';
    this.aplicarFiltro();
  }

  obtenerEstadosUnicos(): string[] {
    return Array.from(new Set(this.tareasFiltradas.map(t => t.tarea_Estado)));
  }

  getTareasPorEstado(estado: string): TaskInterface[] {
    return this.tareasFiltradas.filter(t => t.tarea_Estado === estado);
  }

  seleccionarEstado(estado: string): void {
    this.estadoSeleccionado = estado;
    this.aplicarFiltro();
  }

  seleccionarPrioridad(nivel: number | null): void {
    this.prioridadSeleccionada = nivel;
    this.aplicarFiltro();
  }

  seleccionarTipo(tipo: number | null): void {
    this.tipoSeleccionado = tipo;
    this.aplicarFiltro();
  }

  seleccionarReferencia(ref: number | null): void {
    this.referenciaSeleccionada = ref;
    this.aplicarFiltro();
  }

  getColorPrioridad(nivel: number): string {
    const prioridad = this.prioridadesDisponibles.find(p => p.nivel_Prioridad === nivel);
    return prioridad?.backColor || '#ffffff';
  }

  limpiarFiltros(): void {
    this.estadoSeleccionado = '';
    this.prioridadSeleccionada = null;
    this.tipoSeleccionado = null;
    this.referenciaSeleccionada = null;
    this.filtroReferencia = '';
    this.aplicarFiltro();
  }
}
