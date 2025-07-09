import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { EstadoInterface } from '../../interfaces/estado.interface';
import { PrioridadInterface } from '../../interfaces/prioridad.interface';
import { TipoTareaInterface } from '../../interfaces/tipo-tarea.interface';

import { TareaService } from '../../services/tarea.service';
import { EstadoService } from '../../services/estado.service';
import { PrioridadService } from '../../services/prioridad.service';
import { TipoTareaService } from '../../services/tipo-tarea.service';
import { forkJoin, Observable } from 'rxjs';
import { ReferenciaInterface } from '../../interfaces/referencia.interface';
import { ReferenciaService } from '../../services/referencia.service';
import { TareaInterface } from '../../interfaces/tarea.interface';

// ...imports (igual)

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {
  tareas: TareaInterface[] = [];
  tareasFiltradas: TareaInterface[] = [];
  tareasTodas: TareaInterface[] = [];
  tareasCreadas: TareaInterface[] = [];


  estadosDisponibles: EstadoInterface[] = [];
  prioridadesDisponibles: PrioridadInterface[] = [];
  tiposTareaDisponibles: TipoTareaInterface[] = [];
  
  resultadosReferencia: ReferenciaInterface[] = [];
  vistaActiva: string = 'todas';






  totalRegistros = 0;
  tareasPorPagina = 30;
  paginaActual = 1;
  paginasTotales = 0;
  paginasVisibles: number[] = [];


  
  mostrarResultadosFlotantes = false;

  filtroReferencia = '';
  estadoSeleccionado = '';
  prioridadSeleccionada: number | null = null;
  tipoSeleccionado: number | null = null;
  

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc1MDM0NjcyNCwiZXhwIjoxNzgxNDUwNzI0LCJpYXQiOjE3NTAzNDY3MjR9.NChZbZBfi3IZIVidfWujhmcwgtFYF4hDM1Xg7Z7z5J0';
  usuario = 'desa026';

  constructor(
    private tareaService: TareaService,
    private estadoService: EstadoService,
    private prioridadService: PrioridadService,
    private tipoTareaService: TipoTareaService,
    private referenciaService: ReferenciaService
  ) {}

  ngOnInit(): void {
    this.cargarFiltros().subscribe(res => {
      this.estadosDisponibles = res.estados.data;
      this.prioridadesDisponibles = res.prioridades.data;
      this.tiposTareaDisponibles = res.tiposTarea.data;
    });
    this.obtenerTareas();
  }
  cambiarVista(vista: string): void {
    this.vistaActiva = vista;
  }



  obtenerTareas(): void {
    const rangoIni = (this.paginaActual - 1) * this.tareasPorPagina;
    const rangoFin = this.paginaActual * this.tareasPorPagina;

    this.tareaService.getTodas(this.token, rangoIni, rangoFin).subscribe({
      next: res => {
        this.tareas = res.data;
        this.totalRegistros = this.tareas[0]?.registros || 0;
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
    const visibles: number[] = [];

    // Siempre mostrar las primeras 3 si estás lejos
    if (actual > 4) {
      visibles.push(1, 2, 3);
      visibles.push(-1); // '...' marcador
    } else {
      for (let i = 1; i <= Math.min(3, total); i++) {
        visibles.push(i);
      }
    }

    // Mostrar páginas alrededor del actual
    for (let i = actual - 1; i <= actual + 1; i++) {
      if (i > 3 && i <= total) {
        visibles.push(i);
      }
    }

    // Agrega botón siguiente si hay más páginas
    if (actual + 1 < total) {
      visibles.push(actual + 2); // una más por delante
    }

    // Eliminar duplicados y ordenar
    this.paginasVisibles = [...new Set(visibles)].filter(n => n > 0 && n <= total).sort((a, b) => a - b);
  }



  irAPagina(num: number): void {
    if (num !== this.paginaActual) {
      this.paginaActual = num;
      this.obtenerTareas();
    }
  }

  siguiente(): void {
    if (this.paginaActual < this.paginasTotales) {
      this.paginaActual++;
      this.obtenerTareas();
    }
  }

  anterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.obtenerTareas();
    }
  }

  cambiarPagina(num: number): void {
    this.irAPagina(num);
  }

  cargarFiltros(): Observable<any> {
    return forkJoin({
      estados: this.estadoService.getEstados(this.token),
      prioridades: this.prioridadService.getPrioridades(this.token),
      tiposTarea: this.tipoTareaService.getTiposTarea(this.token)
    });
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
  buscarPorReferencia(): void {
    const texto = this.filtroReferencia.trim();

    if (!texto) {
      this.mostrarResultadosFlotantes = false;
      this.resultadosReferencia = [];
      this.aplicarFiltro(); // Vuelve a mostrar todas las tareas
      return;
    }

    this.referenciaService.buscarPorTexto(this.token, texto, this.usuario, '1').subscribe({
      next: res => {
        const resultados = res.data;
        this.resultadosReferencia = resultados;

        if (resultados.length === 1) {
          // Filtra temporalmente si hay una coincidencia
          this.tareasFiltradas = this.tareas.filter(
            t => t.referencia === resultados[0].referencia
          );
          this.mostrarResultadosFlotantes = false;
        } else if (resultados.length > 1) {
          this.mostrarResultadosFlotantes = true;
        } else {
          // No hay coincidencias: limpiar filtro
          this.resultadosReferencia = [];
          this.mostrarResultadosFlotantes = false;
          this.aplicarFiltro(); // <- vuelve al estado general
        }
      },
      error: err => {
        console.error('Error al buscar referencias:', err);
        this.resultadosReferencia = [];
        this.mostrarResultadosFlotantes = false;
        this.aplicarFiltro(); // También limpia si hubo un error
      }
    });
  }





  filtrarPorReferenciaSeleccionada(r: ReferenciaInterface): void {
    this.filtroReferencia = `${r.referencia} ${r.descripcion}`;
    this.mostrarResultadosFlotantes = false;

    // Aplicar filtro en el tablero Kanban con el campo 'referencia' (número)
    this.tareasFiltradas = this.tareas.filter(t => t.referencia === r.referencia);
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

  limpiarFiltros(): void {
    this.estadoSeleccionado = '';
    this.prioridadSeleccionada = null;
    this.tipoSeleccionado = null;
    this.filtroReferencia = '';
    this.aplicarFiltro();
  }

  getColorPrioridad(nivel: number): string {
    const p = this.prioridadesDisponibles.find(p => p.nivel_Prioridad === nivel);
    return p?.backColor || '#fff';
  }

  obtenerEstadosUnicos(): string[] {
    return Array.from(new Set(this.tareasFiltradas.map(t => t.tarea_Estado)));
  }

  getTareasPorEstado(estado: string): TareaInterface[] {
    return this.tareasFiltradas.filter(t => t.tarea_Estado === estado);
  }
  confirmarReferenciaConEnter(): void {
    if (this.resultadosReferencia.length === 1) {
      // Solo una coincidencia, fijar el filtro
      this.filtrarPorReferenciaSeleccionada(this.resultadosReferencia[0]);
    }
  }
}

