import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { forkJoin } from 'rxjs';
import { TareaInterface } from '../../interfaces/tarea.interface';
import { EstadoInterface } from '../../interfaces/estado.interface';
import { PrioridadInterface } from '../../interfaces/prioridad.interface';
import { TipoTareaInterface } from '../../interfaces/tipo-tarea.interface';
import { ReferenciaInterface } from '../../interfaces/referencia.interface';

import { TareaService } from '../../services/tarea-todas.service';
import { EstadoService } from '../../services/estado.service';
import { PrioridadService } from '../../services/prioridad.service';
import { TipoTareaService } from '../../services/tipo-tarea.service';
import { TareasCreadasService } from '../../services/tareas-creadas.service';
import { TareasAsignadasService } from '../../services/tarea-asignadas.service';
import { TareasInvitacionesService } from '../../services/tareas-invitaciones.service';  
import { ReferenciaService } from '../../services/referencia.service';
import { TareaInvitadosService } from '../../services/tarea-invitados.service';
import { TareaInvitadoInterface } from '../../interfaces/tarea-invitado.interface';
import { UsuarioInterface } from '../../interfaces/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, TranslateModule],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {

  vistaActiva: 'todas' | 'creadas' | 'asignadas' | 'invitaciones' = 'todas';
  tareaInvitados: { [tareaId: number]: TareaInvitadoInterface[] } = {};



  tareasTodas: TareaInterface[] = [];
  tareasCreadas: TareaInterface[] = [];
  tareasAsignadas: TareaInterface[] = [];
  tareasInvitadas: TareaInterface[] = [];
  tareasFiltradas: TareaInterface[] = [];

  estadosDisponibles: EstadoInterface[] = [];
  prioridadesDisponibles: PrioridadInterface[] = [];
  tiposTareaDisponibles: TipoTareaInterface[] = [];

  usuariosCoincidentes: UsuarioInterface[] = [];
  filtroUsuario = '';
  usuarioSeleccionado: UsuarioInterface | null = null;
  mostrarUsuariosFlotantes = false;
  modoOscuroActivo = false;


  filtroReferencia = '';
  referenciaExactaSeleccionada: number | null = null;
  resultadosReferencia: ReferenciaInterface[] = [];
  mostrarResultadosFlotantes = false;

  estadoSeleccionado = '';
  prioridadSeleccionada: number | null = null;
  tipoSeleccionado: number | null = null;
  


  totalRegistros = 0;
  tareasPorPagina = 30;
  paginaActual = 1;
  paginasTotales = 0;
  paginasVisibles: number[] = [];

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc1MDM0NjcyNCwiZXhwIjoxNzgxNDUwNzI0LCJpYXQiOjE3NTAzNDY3MjR9.NChZbZBfi3IZIVidfWujhmcwgtFYF4hDM1Xg7Z7z5J0';
  usuario = 'desa026';
  localStorage: any;
  

  constructor(
    private tareaService: TareaService,
    private estadoService: EstadoService,
    private prioridadService: PrioridadService,
    private tipoTareaService: TipoTareaService,
    private tareasCreadasService: TareasCreadasService,
    private tareasAsignadasService: TareasAsignadasService,
    private tareasInvitacionesService: TareasInvitacionesService, 
    private referenciaService: ReferenciaService,
    private tareaInvitadosService: TareaInvitadosService,
    private usuarioService: UsuarioService,
    private translate: TranslateService
    
  ) { 

    this.translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    this.cargarFiltros();
    this.obtenerTareas();
    const guardado = localStorage.getItem('modoOscuro');
      if (guardado === 'true') {
        document.body.classList.add('dark-mode');
        this.modoOscuroActivo = true;
      }
  }
  toggleDarkMode(): void {
    this.modoOscuroActivo = !this.modoOscuroActivo;
    document.body.classList.toggle('dark-mode', this.modoOscuroActivo);
    localStorage.setItem('modoOscuro', this.modoOscuroActivo.toString());
  }
  cargarFiltros(): void {
    forkJoin({
      estados: this.estadoService.getEstados(this.token),
      prioridades: this.prioridadService.getPrioridades(this.token),
      tiposTarea: this.tipoTareaService.getTiposTarea(this.token)
    }).subscribe(res => {
      this.estadosDisponibles = res.estados.data;
      this.prioridadesDisponibles = res.prioridades.data;
      this.tiposTareaDisponibles = res.tiposTarea.data;
    });
  }

  cambiarVista(vista: 'todas' | 'creadas' | 'asignadas' | 'invitaciones'): void {
    this.vistaActiva = vista;
    this.paginaActual = 1;
    this.obtenerTareas();
  }

  get tareas(): TareaInterface[] {
    switch (this.vistaActiva) {
      case 'todas': return this.tareasTodas;
      case 'creadas': return this.tareasCreadas;
      case 'asignadas': return this.tareasAsignadas;
      case 'invitaciones': return this.tareasInvitadas;
      default: return [];
    }
  }

  obtenerTareas(): void {
    const ini = (this.paginaActual - 1) * this.tareasPorPagina;
    const fin = this.paginaActual * this.tareasPorPagina;

    const servicio =
  this.vistaActiva === 'todas'
    ? this.tareaService.getTodas(this.token, ini, fin)
    : this.vistaActiva === 'creadas'
    ? this.tareasCreadasService.getCreadas(this.token, ini, fin)
    : this.vistaActiva === 'asignadas'
    ? this.tareasAsignadasService.getAsignadas(this.token, ini, fin)
    : this.vistaActiva === 'invitaciones'
    ? this.tareasInvitacionesService.getInvitaciones(this.token, ini, fin)
    : null;  // En caso de que no coincida ninguna vista


    if (!servicio) {
  console.error('No se encontró servicio para vista:', this.vistaActiva);
  return;
}

  servicio.subscribe((res: { data: TareaInterface[]; }) => {
    if (this.vistaActiva === 'todas') this.tareasTodas = res.data;
    if (this.vistaActiva === 'creadas') this.tareasCreadas = res.data;
    if (this.vistaActiva === 'asignadas') this.tareasAsignadas = res.data;
    if (this.vistaActiva === 'invitaciones') this.tareasInvitadas = res.data;

    this.actualizarPaginacion(res.data);

    res.data.forEach(tarea => {
      this.tareaInvitadosService.getInvitadoPorTarea(this.token, tarea.iD_Tarea!, this.usuario).subscribe({
        next: resp => {
          if (resp.data.length > 0) {
            this.tareaInvitados[tarea.iD_Tarea!] = resp.data; // <--- guardamos el array completo
          }
        },
        error: err => {
          console.warn(`Error cargando invitado para tarea ${tarea.iD_Tarea}:`, err);
        }
      });
    });


  });
  }
  buscarPorUsuario(): void {
    const texto = this.filtroUsuario.trim();
    if (!texto) {
      this.usuariosCoincidentes = [];
      this.usuarioSeleccionado = null;
      this.mostrarUsuariosFlotantes = false;
      this.aplicarFiltro();
      return;
    }

    this.usuarioService.buscarUsuarios(this.token, texto, this.usuario).subscribe({
      next: res => {
        this.usuariosCoincidentes = res.data;

        if (res.data.length === 1) {
          this.usuarioSeleccionado = res.data[0];
          this.mostrarUsuariosFlotantes = false;
          this.aplicarFiltro();
        } else if (res.data.length > 1) {
          this.mostrarUsuariosFlotantes = true;
        } else {
          this.usuarioSeleccionado = null;
          this.mostrarUsuariosFlotantes = false;
          this.aplicarFiltro();
        }
      },
      error: err => {
        console.error('Error al buscar usuarios:', err);
        this.usuarioSeleccionado = null;
        this.mostrarUsuariosFlotantes = false;
        this.usuariosCoincidentes = [];
        this.aplicarFiltro();
      }
    });
  }

  filtrarPorUsuarioSeleccionado(usuario: UsuarioInterface): void {
    this.filtroUsuario = usuario.name;
    this.usuarioSeleccionado = usuario;
    this.mostrarUsuariosFlotantes = false;
    this.aplicarFiltro();
  }

  confirmarUsuarioConEnter(): void {
    if (this.usuariosCoincidentes.length === 1) {
      this.filtrarPorUsuarioSeleccionado(this.usuariosCoincidentes[0]);
    } else {
      this.aplicarFiltro();
    }
  }


  actualizarPaginacion(arr: TareaInterface[]): void {
    this.totalRegistros = arr[0]?.registros || 0;
    this.paginasTotales = Math.ceil(this.totalRegistros / this.tareasPorPagina);
    this.generarPaginacion();
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
  this.tareasFiltradas = this.tareas.filter(t => {
    const coincideEstado = this.estadoSeleccionado ? t.tarea_Estado === this.estadoSeleccionado : true;
    const coincidePrioridad = this.prioridadSeleccionada != null ? t.nivel_Prioridad === this.prioridadSeleccionada : true;
    const coincideTipo = this.tipoSeleccionado != null ? t.tipo_Tarea === this.tipoSeleccionado : true;

    const coincideReferencia = this.referenciaExactaSeleccionada
      ? t.referencia === this.referenciaExactaSeleccionada
      : this.filtroReferencia.trim()
        ? (t.descripcion_Referencia?.toLowerCase().includes(this.filtroReferencia.toLowerCase().trim()) ||
          t.referencia?.toString().includes(this.filtroReferencia.trim()))
        : true;

    const coincideUsuario = this.usuarioSeleccionado?.userName
      ? (
          t.usuario_Creador === this.usuarioSeleccionado.userName ||
          t.usuario_Responsable === this.usuarioSeleccionado.userName ||
          this.tareaInvitados[t.iD_Tarea]?.some(inv => inv.userName === this.usuarioSeleccionado?.userName)
        )
      : true;


    return coincideEstado && coincidePrioridad && coincideTipo && coincideReferencia && coincideUsuario;
  });
}

  

  buscarPorReferencia(): void {
    const texto = this.filtroReferencia.trim();
    if (!texto) {
      this.resultadosReferencia = [];
      this.referenciaExactaSeleccionada = null;
      this.mostrarResultadosFlotantes = false;
      this.aplicarFiltro();
      return;
    }

    this.referenciaService.buscarPorTexto(this.token, texto, this.usuario, '1').subscribe({
      next: res => {
        this.resultadosReferencia = res.data;

        if (res.data.length === 1) {
          this.referenciaExactaSeleccionada = res.data[0].referencia;
          this.mostrarResultadosFlotantes = false;
          this.aplicarFiltro();
        } else if (res.data.length > 1) {
          this.mostrarResultadosFlotantes = true;
        } else {
          this.referenciaExactaSeleccionada = null;
          this.mostrarResultadosFlotantes = false;
          this.aplicarFiltro();
        }
      },
      error: err => {
        console.error('Error al buscar referencias:', err);
        this.referenciaExactaSeleccionada = null;
        this.mostrarResultadosFlotantes = false;
        this.resultadosReferencia = [];
        this.aplicarFiltro();
      }
    });
  }

  filtrarPorReferenciaSeleccionada(r: ReferenciaInterface): void {
    this.filtroReferencia = `${r.referencia} ${r.descripcion}`;
    this.referenciaExactaSeleccionada = r.referencia;
    this.mostrarResultadosFlotantes = false;
    this.aplicarFiltro();
  }

  confirmarReferenciaConEnter(): void {
    if (this.resultadosReferencia.length === 1) {
      this.filtrarPorReferenciaSeleccionada(this.resultadosReferencia[0]);
    } else {
      this.aplicarFiltro();
    }
  }

  limpiarFiltros(): void {
    this.estadoSeleccionado = '';
    this.tipoSeleccionado = null;
    this.prioridadSeleccionada = null;
    this.filtroReferencia = '';
    this.referenciaExactaSeleccionada = null;
    this.resultadosReferencia = [];
    this.aplicarFiltro();
    this.filtroUsuario = '';
    this.usuarioSeleccionado = null;
    this.usuariosCoincidentes = [];

  }

  seleccionarEstado(_: any): void {
    this.aplicarFiltro();
  }

  seleccionarTipo(_: any): void {
    this.aplicarFiltro();
  }

  generarPaginacion(): void {
    const total = this.paginasTotales;
    const actual = this.paginaActual;
    const visibles: (number | -1)[] = [];

    // Siempre incluir las primeras 3 si existen
    if (total >= 1) visibles.push(1);
    if (total >= 2) visibles.push(2);
    if (total >= 3) visibles.push(3);

    // Si la página actual está después de la 5, agregar "..." después del 3
    if (actual > 5) {
      visibles.push(-1); // puntos suspensivos
    }

    // Agregar páginas desde actual - 2 hasta actual + 1 (siempre mayores a 3)
    for (let i = actual - 2; i <= actual + 1; i++) {
      if (i > 3 && i <= total) {
        visibles.push(i);
      }
    }

    this.paginasVisibles = visibles;
  }



  irAPagina(n: number): void {
    if (n !== this.paginaActual) {
      this.paginaActual = n;
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





  getColorPrioridad(nivel: number): string {
    const p = this.prioridadesDisponibles.find(x => x.nivel_Prioridad === nivel);
    return p?.backColor || '#fff';
  }

  obtenerEstadosUnicos(): string[] {
    return Array.from(new Set(this.tareasFiltradas.map(t => t.tarea_Estado)));
  }

  getTareasPorEstado(estado: string): TareaInterface[] {
    return this.tareasFiltradas.filter(t => t.tarea_Estado === estado);
  }

getPrimerInvitado(tareaId: number): string {
  const invitados = this.tareaInvitados[tareaId];
  return invitados?.length > 0 ? invitados[0].userName : 'Sin invitado';
}

getCantidadRestante(tareaId: number): number {
  const invitados = this.tareaInvitados[tareaId];
  return invitados?.length > 1 ? invitados.length - 1 : 0;
}

getRestoInvitadosTooltip(tareaId: number): string {
  const invitados = this.tareaInvitados[tareaId];
  return invitados?.slice(1).map(i => i.userName).join(', ') || '';
}

cambiarIdioma(idioma: string): void {
    this.translate.use(idioma);
  }
}

