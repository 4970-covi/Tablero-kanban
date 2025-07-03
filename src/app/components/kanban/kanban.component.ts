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


  refSelectTest:any = undefined;

  referenciasTes: any[] = [
    {

      referencia: 984,
      descripcion: "Ref1",
    },
    {

      referencia: 1,
      descripcion: "ref59",
    },
    {

      referencia: 944,
      descripcion: "Ref144",
    }
  ];



  tareasTest: any[] = [
    {
      nombre:"Traea1",
      referencia: 1,
      iD_Referencia: "ref59",
    },
    {
      nombre:"Traea1",

      referencia: 17,
      iD_Referencia: "ref59",
    },
    {
      nombre:"Traea1",

      referencia: 41,
      iD_Referencia: "ref59",
    }
    ,
    {
      nombre:"Traea17",

      referencia: 1,
      iD_Referencia: "ref59",
    }
    ,
    {
      nombre:"Traea14",

      referencia: 1272,
      iD_Referencia: "ref522",
    }
  ];


  testFiltroRef(){
    //la referencia que el usuario selecciona
      this.refSelectTest = this.referenciasTes[0];

      let taskSelect:any[] = [];


      //recorremos las tareas que se estan viendo 
      this.tareasTest.forEach(element => {


        //evaluar si hay alguna tarea con la referencia seleccionada
        if(element.referencia == this.refSelectTest!.referencia){
          //asigamos las tareas encontradas 
          taskSelect.push(element);
        }
      });
      

      console.log(taskSelect);
      
  }


  //tareas al cargar mi app
  obtenerTareas(): void {
    this.taskService.getTodasLasTareas(
      this.token,
      this.pagination.getRangoIni(),
      this.pagination.getRangoFin()
    ).subscribe({
      next: (res: { data: TaskInterface[]; }) => {
        this.tareas = res.data;
        this.aplicarFiltro();
      },
      error: (err: any) => {
        console.error('Error al obtener todas las tareas:', err);
      }
    });
  }


  // filtrado
  aplicarFiltro(): void {
    this.tareasFiltradas = this.tareas.filter(t => {
      const coincideEstado = this.estadoSeleccionado ? t.tarea_Estado === this.estadoSeleccionado : true;
      const coincidePrioridad = this.prioridadSeleccionada != null ? t.nivel_Prioridad === this.prioridadSeleccionada : true;
      const coincideTipo = this.tipoSeleccionado != null ? t.tipo_Tarea === this.tipoSeleccionado : true;

      // NUEVA LÓGICA DE FILTRO POR TEXTO DE REFERENCIA
      const coincideReferencia = this.filtroReferencia.trim()
        ? t.descripcion_Referencia.toLowerCase().includes(this.filtroReferencia.toLowerCase())
        : true;

      return coincideEstado && coincidePrioridad && coincideTipo && coincideReferencia;
    });
  }


  //funcion para cargar los filtros
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



  regresar(): void {
    this.pagination.retroceder();
    this.obtenerTareas();
  }


  mostrarMas(): void {
    this.pagination.avanzar();
    this.obtenerTareas();
  }

  //Agrupar tareas por estado
  obtenerEstadosUnicos(): string[] {
    return Array.from(new Set(this.tareasFiltradas.map(t => t.tarea_Estado)));
  }

  // tareas por estado (usado por *ngFor en HTML)
  getTareasPorEstado(estado: string): TaskInterface[] {
    return this.tareasFiltradas.filter(t => t.tarea_Estado === estado);
  }

  // filtrado por estado
  seleccionarEstado(estado: string): void {
    this.estadoSeleccionado = estado;
    this.aplicarFiltro();
  }
  // filtrado por nivel 
  seleccionarPrioridad(nivel: number | null): void {
    this.prioridadSeleccionada = nivel;
    this.aplicarFiltro();
  }
  //filtrado por tipo de tarea
  seleccionarTipo(tipo: number | null): void {
    this.tipoSeleccionado = tipo;
    this.aplicarFiltro();
  }

  seleccionarReferencia(ref: number | null): void {
    this.referenciaSeleccionada = ref;
    this.aplicarFiltro();
  }

  limpiarFiltros(): void {
    this.estadoSeleccionado = '';
    this.prioridadSeleccionada = null;
    this.tipoSeleccionado = null;
    this.referenciaSeleccionada = null;
    this.aplicarFiltro();
  }
}
