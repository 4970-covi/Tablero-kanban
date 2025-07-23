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

  vistaActiva: 'todas' | 'creadas' | 'asignadas' | 'invitaciones' = 'todas';//Indica el conjunto de tareas que se está mostrando actualmente
  tareaInvitados: { [tareaId: number]: TareaInvitadoInterface[] } = {};// Objeto que mapea el ID de una tarea  a un arrego con invitados de esa tarea

  tareasTodas: TareaInterface[] = [];// Declaramos que existe una interface para los datos de Todas las tareas
  tareasCreadas: TareaInterface[] = [];//Declaramos que los datos obtenidos de tareas creadas se acoplan a la interface Tarea Interface
  tareasAsignadas: TareaInterface[] = [];//Declaramos que tareas asignadas utiliza la interfaz De tarea
  tareasInvitadas: TareaInterface[] = [];//Declaramos que tareaInvitadas utiliza la interfaz de tarea
  tareasFiltradas: TareaInterface[] = [];//Declaramos que tareasFiltradas utiliza la interfa de tarea
  estadosDisponibles: EstadoInterface[] = [];//Declaramos que existe una interfaz de EstadosDisponibles 
  prioridadesDisponibles: PrioridadInterface[] = [];//Declaramos que existe una interfaz en específico de prioridadesDisponibles
  tiposTareaDisponibles: TipoTareaInterface[] = [];//Declaramos que existe una interfaz en específico con tipoTareaDisponibles
  usuariosCoincidentes: UsuarioInterface[] = [];//Declaramos que utilizamos usuariosCoincidentes Utiliza UsuarioInterfaz

  filtroUsuario = '';//Declarado para que se ingrese texto y realizar la busqueda para usuarios
  usuarioSeleccionado: UsuarioInterface | null = null;//Se declara para el usuario escogido luego de la búsqueda para filtrar tareas.
  mostrarUsuariosFlotantes = false;//booleano que controla si se muestran los resultados de búsqueda de usuarios como un dropdown flotante.
  modoOscuroActivo = false;//Indica si el modo oscuro está activo
  mostrarIdiomas = false;//Controla si se muestra el selector de idiomas
  menuAbierto = false;//Controla si el menú latreal está abierto


  filtroReferencia = '';//Indica que esto puede contener texto para buscar una referencia en específico
  referenciaExactaSeleccionada: number | null = null;// Guarda la referencia numerica exacta seleccionada para filtrar
  resultadosReferencia: ReferenciaInterface[] = [];//Utilizada para la listra temporal con resultados de las referencias
  mostrarResultadosFlotantes = false;//Boolenao utilizado para controlar la ventana flotante con el resultado de referencias flotantes

  estadoSeleccionado = '';//filtro aplicado acutalmente con los estados obtenidos
  prioridadSeleccionada: number | null = null;//filtro aplicado con la prioridad seleccionada
  tipoSeleccionado: number | null = null;//Filtro aplicado con el tipo de tarea 
  


  totalRegistros = 0;//total de tareas obtenidas para la realizacion de la pacinacion
  tareasPorPagina = 30;//Cantidad escalable por pagina
  paginaActual = 1;//Pagina acutal visible
  paginasTotales = 0;//muestra la cantidad de paginas que existen
  paginasVisibles: number[] = [];//Lista de paginas visibles que se muestran en la barra de paginacion

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJhZG1pbiIsIm5iZiI6MTc1MDM0NjcyNCwiZXhwIjoxNzgxNDUwNzI0LCJpYXQiOjE3NTAzNDY3MjR9.NChZbZBfi3IZIVidfWujhmcwgtFYF4hDM1Xg7Z7z5J0';//Token utilizado para el consumo de las Apis utilizadas
  usuario = 'desa026';//Usuario que utiliza la pliacaion 
  localStorage: any;// referencia (sin definir explícitamente aquí) para manejar almacenamiento local.
  

  constructor(
    private tareaService: TareaService,//Obtiene las tareas del api Todas las tareas
    private estadoService: EstadoService,//Obtiene los estados de la api Estados
    private prioridadService: PrioridadService,//Obtiene las prioridades de la api Prioridades
    private tipoTareaService: TipoTareaService,//Obtiene el tipo de tareas de la api TipoTarea
    private tareasCreadasService: TareasCreadasService,//Obtiene tareas creadas por el usuario.
    private tareasAsignadasService: TareasAsignadasService,//Obtiene tareas asignadas al usuario.
    private tareasInvitacionesService: TareasInvitacionesService, //Obtiene tareas donde el usuario fue invitado.
    private referenciaService: ReferenciaService,//Filtra tareas por referencia.
    private tareaInvitadosService: TareaInvitadosService,//Carga información de invitados por tarea.
    private usuarioService: UsuarioService,//Busca usuarios por nombre o código.
    private translate: TranslateService//Traducción de la interfaz (i18n).
    
  ) { 

    this.translate.setDefaultLang('es');//declara que el idioma por defecto es español
  }

  ngOnInit(): void {//declaramos el metodo ngOnInit
    this.cargarFiltros();// Llama a una función que carga los filtros disponibles como estados, prioridades y tipos de tarea desde los servicios correspondientes.
    this.obtenerTareas();// Llama a una función que obtiene las tareas (todas, creadas, asignadas e invitadas) según el estado actual de la vista.
    const guardado = localStorage.getItem('modoOscuro');//// Obtiene el valor almacenado en el almacenamiento local con la clave 'modoOscuro'.
      if (guardado === 'true') {//condicional para el autoguardado
        document.body.classList.add('dark-mode');// Si el valor obtenido es 'true', aplica la clase CSS 'dark-mode' al body para activar el modo oscuro.
        this.modoOscuroActivo = true;// Establece la variable 'modoOscuroActivo' en true para reflejar el estado del modo oscuro en la interfaz.
      }
  }
  toggleDarkMode(): void {
    this.modoOscuroActivo = !this.modoOscuroActivo; // Cambia el valor de 'modoOscuroActivo' al contrario del actual (activa o desactiva el modo oscuro).
    document.body.classList.toggle('dark-mode', this.modoOscuroActivo); // Añade o quita la clase 'dark-mode' del body dependiendo del valor actual de 'modoOscuroActivo'.
    localStorage.setItem('modoOscuro', this.modoOscuroActivo.toString()); // Guarda en el almacenamiento local el estado actual del modo oscuro como cadena ('true' o 'false').
  }

  cargarFiltros(): void {
    forkJoin({ // Ejecuta múltiples peticiones HTTP en paralelo y espera a que todas finalicen antes de continuar.
      estados: this.estadoService.getEstados(this.token), // Llama al servicio de estados y lo incluye en el grupo de peticiones.
      prioridades: this.prioridadService.getPrioridades(this.token), // Llama al servicio de prioridades y lo incluye en el grupo de peticiones.
      tiposTarea: this.tipoTareaService.getTiposTarea(this.token) // Llama al servicio de tipos de tarea y lo incluye en el grupo de peticiones.
    }).subscribe(res => { // Se ejecuta cuando todas las peticiones han finalizado con éxito.
      this.estadosDisponibles = res.estados.data; // Asigna la lista de estados obtenidos a la propiedad 'estadosDisponibles'.
      this.prioridadesDisponibles = res.prioridades.data; // Asigna la lista de prioridades obtenidas a la propiedad 'prioridadesDisponibles'.
      this.tiposTareaDisponibles = res.tiposTarea.data; // Asigna la lista de tipos de tarea obtenidos a la propiedad 'tiposTareaDisponibles'.
    });
  }


  cambiarVista(vista: 'todas' | 'creadas' | 'asignadas' | 'invitaciones'): void {//Metodo utilizado para cambiar entre pestañas
    this.vistaActiva = vista; // Asigna la vista seleccionada ('todas', 'creadas', 'asignadas' o 'invitaciones') a la propiedad 'vistaActiva'.
    this.paginaActual = 1; // Reinicia el número de página a 1 al cambiar de vista.
    this.obtenerTareas(); // Llama al método que obtiene las tareas correspondientes a la vista activa.
  }

  get tareas(): TareaInterface[] { // Getter que retorna un arreglo de tareas basado en la vista activa actual.
    switch (this.vistaActiva) { // Evalúa el valor de 'vistaActiva' para determinar qué conjunto de tareas devolver.
      case 'todas': return this.tareasTodas; // Si la vista activa es 'todas', retorna todas las tareas.
      case 'creadas': return this.tareasCreadas; // Si la vista activa es 'creadas', retorna las tareas creadas por el usuario.
      case 'asignadas': return this.tareasAsignadas; // Si la vista activa es 'asignadas', retorna las tareas asignadas al usuario.
      case 'invitaciones': return this.tareasInvitadas; // Si la vista activa es 'invitaciones', retorna las tareas donde el usuario ha sido invitado.
      default: return []; // En caso de que ninguna opción coincida, retorna un arreglo vacío.
    }
  }


  obtenerTareas(): void { // Método que obtiene las tareas según la vista activa y la página actual.
  const ini = (this.paginaActual - 1) * this.tareasPorPagina; // Calcula el índice inicial basado en la página actual.
  const fin = this.paginaActual * this.tareasPorPagina; // Calcula el índice final para la paginación.

  const servicio =
    this.vistaActiva === 'todas'
      ? this.tareaService.getTodas(this.token, ini, fin) // Llama al servicio correspondiente para obtener todas las tareas.
      : this.vistaActiva === 'creadas'
      ? this.tareasCreadasService.getCreadas(this.token, ini, fin) // Llama al servicio para obtener tareas creadas.
      : this.vistaActiva === 'asignadas'
      ? this.tareasAsignadasService.getAsignadas(this.token, ini, fin) // Llama al servicio para obtener tareas asignadas.
      : this.vistaActiva === 'invitaciones'
      ? this.tareasInvitacionesService.getInvitaciones(this.token, ini, fin) // Llama al servicio para obtener tareas invitadas.
      : null; // Si ninguna vista coincide, se asigna null.

  if (!servicio) { // Verifica si no se encontró un servicio adecuado.
    console.error('No se encontró servicio para vista:', this.vistaActiva); // Muestra un error si la vista no es válida.
    return; // Detiene la ejecución del método.
  }

  servicio.subscribe((res: { data: TareaInterface[]; }) => { // Se suscribe al observable del servicio para obtener los datos.
    if (this.vistaActiva === 'todas') this.tareasTodas = res.data; // Asigna los datos a la propiedad correspondiente.
    if (this.vistaActiva === 'creadas') this.tareasCreadas = res.data;//asigna los datos a la vista de tareas creadas
    if (this.vistaActiva === 'asignadas') this.tareasAsignadas = res.data;//Asigna los datos a la vista tareas asignadas
    if (this.vistaActiva === 'invitaciones') this.tareasInvitadas = res.data;//Asigna los datos a la vita tareas Invitados

    this.actualizarPaginacion(res.data); // Actualiza la información de paginación con las tareas obtenidas.

    res.data.forEach(tarea => { // Itera sobre cada tarea obtenida.
      this.tareaInvitadosService.getInvitadoPorTarea(this.token, tarea.iD_Tarea!, this.usuario).subscribe({ // Consulta los invitados por tarea.
        next: resp => {
          if (resp.data.length > 0) {
            this.tareaInvitados[tarea.iD_Tarea!] = resp.data; // Almacena el array de invitados para la tarea correspondiente.
          }
        },
        error: err => {
          console.warn(`Error cargando invitado para tarea ${tarea.iD_Tarea}:`, err); // Muestra un warning si ocurre un error al obtener los invitados.
        }
      });
    });

  });
}

  buscarPorUsuario(): void {// Realiza una búsqueda de usuarios basada en el texto ingresado en el campo de filtro.
    const texto = this.filtroUsuario.trim();// Se elimina cualquier espacio adicional del texto ingresado
    if (!texto) {//Condicional Si el campo está vacío después de quitar espacios
      this.usuariosCoincidentes = [];//Liimpia  la lista de usuarios coincidentes
      this.usuarioSeleccionado = null;//Desselecciona si es que exista un usuario seleccionado anteriormente
      this.mostrarUsuariosFlotantes = false;//Oculta el menu flotante si es que estuviera activo
      this.aplicarFiltro();// Aplica el filtro sin tener en cuenta el usuario
      return;// Termina la ejecución de la función
    }

    
  this.usuarioService.buscarUsuarios(this.token, texto, this.usuario).subscribe({// Llama al servicio para buscar usuarios que coincidan con el texto ingresado
    next: res => { // En caso de éxito en la búsqueda
      this.usuariosCoincidentes = res.data; // Almacena la lista de usuarios devuelta por el servidor

      if (res.data.length === 1) { // Si solo se encontró un usuario
        this.usuarioSeleccionado = res.data[0]; // Se selecciona automáticamente ese usuario
        this.mostrarUsuariosFlotantes = false; // No es necesario mostrar sugerencias
        this.aplicarFiltro(); // Se aplica el filtro con el usuario seleccionado
      } else if (res.data.length > 1) { // Si se encontraron múltiples usuarios
        this.mostrarUsuariosFlotantes = true; // Se muestra el menú flotante para que el usuario elija uno
      } else { // Si no se encontró ningún usuario
        this.usuarioSeleccionado = null; // Se asegura que no haya usuario seleccionado
        this.mostrarUsuariosFlotantes = false; // Se ocultan las sugerencias flotantes
        this.aplicarFiltro(); // Se aplica el filtro sin usuario
      }
    },
    error: err => { // Si ocurre un error durante la solicitud HTTP
      console.error('Error al buscar usuarios:', err); // Muestra el error en la consola para depuración
      this.usuarioSeleccionado = null; // Se limpia cualquier usuario seleccionado
      this.mostrarUsuariosFlotantes = false; // Se ocultan las sugerencias
      this.usuariosCoincidentes = []; // Se limpia la lista de resultados
      this.aplicarFiltro(); // Se aplica el filtro sin tener en cuenta usuarios
    }
  });
}

  filtrarPorUsuarioSeleccionado(usuario: UsuarioInterface): void {
    this.filtroUsuario = usuario.name; // Asigna el nombre del usuario seleccionado al campo de texto del filtro
    this.usuarioSeleccionado = usuario; // Guarda el usuario seleccionado en la variable correspondiente
    this.mostrarUsuariosFlotantes = false; // Oculta el menú de sugerencias flotantes
    this.aplicarFiltro(); // Aplica los filtros tomando en cuenta el usuario seleccionado
  }

  confirmarUsuarioConEnter(): void {
    if (this.usuariosCoincidentes.length === 1) { // Si hay exactamente un usuario coincidente
      this.filtrarPorUsuarioSeleccionado(this.usuariosCoincidentes[0]); // Se selecciona automáticamente ese usuario
    } else {
      this.aplicarFiltro(); // Si hay varios o ninguno, se aplica el filtro tal como está
    }
  }



  actualizarPaginacion(arr: TareaInterface[]): void {
    this.totalRegistros = arr[0]?.registros || 0; // Obtiene el total de registros desde la primera tarea del arreglo, o 0 si no hay datos
    this.paginasTotales = Math.ceil(this.totalRegistros / this.tareasPorPagina); // Calcula la cantidad total de páginas según los registros y tareas por página
    this.generarPaginacion(); // Genera el arreglo de paginación para mostrar los botones o controles de navegación
    this.aplicarFiltro(); // Aplica los filtros activos a los datos paginados
  }


  aplicarFiltro(): void {
    this.tareasFiltradas = this.tareas.filter(t => {// Filtra la lista de tareas en función de los filtros seleccionados
      const coincideEstado = this.estadoSeleccionado ? t.tarea_Estado === this.estadoSeleccionado : true;// Verifica si el estado de la tarea coincide con el filtro seleccionado (o lo ignora si no hay filtro)
      const coincidePrioridad = this.prioridadSeleccionada != null ? t.nivel_Prioridad === this.prioridadSeleccionada : true; // Verifica si la prioridad de la tarea coincide con la seleccionada (o lo ignora si no hay filtro)
      const coincideTipo = this.tipoSeleccionado != null ? t.tipo_Tarea === this.tipoSeleccionado : true;// Verifica si el tipo de tarea coincide con el filtro seleccionado (o lo ignora si no hay filtro.
      const coincideReferencia = this.referenciaExactaSeleccionada // Verifica si la referencia coincide exactamente o parcialmente con el filtro ingresado (según corresponda)
        ? t.referencia === this.referenciaExactaSeleccionada // Si se seleccionó una referencia exacta, compara directamente
        : this.filtroReferencia.trim() // Si hay texto ingresado para buscar, compara con descripción o número
          ? (t.descripcion_Referencia?.toLowerCase().includes(this.filtroReferencia.toLowerCase().trim()) ||
            t.referencia?.toString().includes(this.filtroReferencia.trim()))
          : true; // Si no hay filtro de referencia, considera como coincidencia válida

      const coincideUsuario = this.usuarioSeleccionado?.userName       // Verifica si el usuario coincide con el creador, responsable o invitado de la tarea
        ? (
            t.usuario_Creador === this.usuarioSeleccionado.userName || // Coincide como creador
            t.usuario_Responsable === this.usuarioSeleccionado.userName || // Coincide como responsable
            this.tareaInvitados[t.iD_Tarea]?.some(inv => inv.userName === this.usuarioSeleccionado?.userName) // Coincide como invitado
          )
        : true; // Si no hay usuario seleccionado, acepta cualquier tarea

      return coincideEstado && coincidePrioridad && coincideTipo && coincideReferencia && coincideUsuario;      // Devuelve true solo si todos los filtros coinciden
    });
  }
  

  buscarPorReferencia(): void { // Función que busca referencias por texto y aplica el filtro
    const texto = this.filtroReferencia.trim(); // Se elimina el espacio en blanco al inicio y final del texto ingresado

    if (!texto) { // Si el campo de texto está vacío
      this.resultadosReferencia = []; // Se limpia la lista de resultados
      this.referenciaExactaSeleccionada = null; // Se borra la referencia seleccionada
      this.mostrarResultadosFlotantes = false; // Se oculta el menú de resultados flotantes
      this.aplicarFiltro(); // Se aplica el filtro sin referencia
      return; // Finaliza la ejecución de la función
    }

    this.referenciaService.buscarPorTexto(this.token, texto, this.usuario, '1').subscribe({ // Se realiza la búsqueda de referencias por texto
      next: res => { // Si la respuesta es exitosa
        this.resultadosReferencia = res.data; // Se asigna el resultado a la lista de resultados

        if (res.data.length === 1) { // Si se encuentra exactamente una coincidencia
          this.referenciaExactaSeleccionada = res.data[0].referencia; // Se asigna esa referencia como seleccionada
          this.mostrarResultadosFlotantes = false; // Se oculta el menú de resultados flotantes
          this.aplicarFiltro(); // Se aplica el filtro con la referencia seleccionada
        } else if (res.data.length > 1) { // Si se encuentran varias coincidencias
          this.mostrarResultadosFlotantes = true; // Se muestran los resultados flotantes
        } else { // Si no se encuentran coincidencias
          this.referenciaExactaSeleccionada = null; // Se borra cualquier referencia seleccionada
          this.mostrarResultadosFlotantes = false; // Se ocultan los resultados flotantes
          this.aplicarFiltro(); // Se aplica el filtro sin referencia
        }
      },
      error: err => { // Si ocurre un error en la petición
        console.error('Error al buscar referencias:', err); // Se muestra el error en consola
        this.referenciaExactaSeleccionada = null; // Se borra cualquier referencia seleccionada
        this.mostrarResultadosFlotantes = false; // Se ocultan los resultados flotantes
        this.resultadosReferencia = []; // Se limpia la lista de resultados
        this.aplicarFiltro(); // Se aplica el filtro sin referencia
      }
    });
  }


  filtrarPorReferenciaSeleccionada(r: ReferenciaInterface): void { // Función para filtrar tareas según una referencia seleccionada
  this.filtroReferencia = `${r.referencia} ${r.descripcion}`; // Se concatena referencia y descripción para mostrar en el filtro
  this.referenciaExactaSeleccionada = r.referencia; // Se asigna la referencia exacta seleccionada
  this.mostrarResultadosFlotantes = false; // Se oculta la ventana flotante de resultados
  this.aplicarFiltro(); // Se aplica el filtro con la referencia seleccionada
}

confirmarReferenciaConEnter(): void { // Función que confirma la referencia cuando se presiona Enter
  if (this.resultadosReferencia.length === 1) { // Si hay exactamente un resultado en la lista de referencias
    this.filtrarPorReferenciaSeleccionada(this.resultadosReferencia[0]); // Se filtra automáticamente por esa referencia
  } else { // Si hay más de un resultado o ninguno
    this.aplicarFiltro(); // Se aplica el filtro sin modificar la referencia
  }
}

limpiarFiltros(): void { // Función para limpiar todos los filtros aplicados
  this.estadoSeleccionado = ''; // Se limpia el filtro de estado
  this.tipoSeleccionado = null; // Se limpia el filtro de tipo
  this.prioridadSeleccionada = null; // Se limpia el filtro de prioridad
  this.filtroReferencia = ''; // Se limpia el filtro de referencia (texto)
  this.referenciaExactaSeleccionada = null; // Se limpia la referencia exacta seleccionada
  this.resultadosReferencia = []; // Se limpian los resultados de búsqueda de referencias
  this.filtroUsuario = ''; // Se limpia el filtro de usuario
  this.usuarioSeleccionado = null; // Se limpia el usuario seleccionado
  this.usuariosCoincidentes = []; // Se limpia la lista de usuarios coincidentes
  this.aplicarFiltro(); // Se aplica el filtro para reflejar que no hay filtros activos
}


  seleccionarEstado(_: any): void {
    this.aplicarFiltro();
  }

  seleccionarTipo(_: any): void {
    this.aplicarFiltro();
  }

  generarPaginacion(): void {
    const total = this.paginasTotales; // Total de páginas disponibles
    const actual = this.paginaActual;  // Página actual seleccionada
    const visibles: (number | -1)[] = []; // Array que contendrá las páginas visibles y los puntos suspensivos (-1)

    // Siempre incluir las primeras 3 páginas si existen
    if (total >= 1) visibles.push(1); 
    if (total >= 2) visibles.push(2);
    if (total >= 3) visibles.push(3);

    
    if (actual > 5) {// Si la página actual es mayor que 5, agregar puntos suspensivos ("...") después de la página 3
      visibles.push(-1); // Representa los puntos suspensivos en la paginación
    }


    for (let i = actual - 2; i <= actual + 1; i++) {    // Agregar páginas cercanas a la página actual, desde actual-2 hasta actual+1, siempre que sean mayores a 3 y menores o iguales al total
      if (i > 3 && i <= total) {
        visibles.push(i); // Añade página al array visible
      }
    }

    this.paginasVisibles = visibles; // Actualiza el array de páginas visibles para la paginación
  }


  irAPagina(n: number): void {
    if (n !== this.paginaActual) { // Solo cambiar página si no es la actual
      this.paginaActual = n;       // Actualiza la página actual a la seleccionada
      this.obtenerTareas();         // Recarga las tareas correspondientes a la nueva página
    }
  }

  siguiente(): void {
    if (this.paginaActual < this.paginasTotales) { // Solo avanzar si no estamos en la última página
      this.paginaActual++;       // Incrementa la página actual
      this.obtenerTareas();      // Recarga las tareas para la nueva página
    }
  }

  anterior(): void {
    if (this.paginaActual > 1) { // Solo retroceder si no estamos en la primera página
      this.paginaActual--;       // Decrementa la página actual
      this.obtenerTareas();      // Recarga las tareas para la nueva página
    }
  }

  getColorPrioridad(nivel: number): string {
    const p = this.prioridadesDisponibles.find(x => x.nivel_Prioridad === nivel); // Busca la prioridad que coincide con el nivel dado
    return p?.backColor || '#fff'; // Retorna el color de fondo asociado o blanco si no encuentra coincidencia
  }

  obtenerEstadosUnicos(): string[] {
    return Array.from(new Set(this.tareasFiltradas.map(t => t.tarea_Estado))); // Extrae estados únicos de las tareas filtradas y los convierte en array
  }

  getTareasPorEstado(estado: string): TareaInterface[] {
    return this.tareasFiltradas.filter(t => t.tarea_Estado === estado); // Devuelve tareas cuyo estado coincide con el estado pasado como parámetro
  }

  getPrimerInvitado(tareaId: number): string {
    const invitados = this.tareaInvitados[tareaId]; // Obtiene los invitados asociados a la tarea por ID
    return invitados?.length > 0 ? invitados[0].userName : 'Sin invitado'; // Retorna el nombre del primer invitado o 'Sin invitado' si no hay ninguno
  }

  getCantidadRestante(tareaId: number): number {
    const invitados = this.tareaInvitados[tareaId]; // Obtiene los invitados de la tarea
    return invitados?.length > 1 ? invitados.length - 1 : 0; // Retorna la cantidad de invitados adicionales (restantes) o 0 si no hay más de uno
  }

  getRestoInvitadosTooltip(tareaId: number): string {
    const invitados = this.tareaInvitados[tareaId]; // Obtiene la lista de invitados
    return invitados?.slice(1).map(i => i.userName).join(', ') || ''; // Retorna los nombres de invitados adicionales separados por coma o cadena vacía si no hay
  }

  toggleIdiomas() {
    this.mostrarIdiomas = !this.mostrarIdiomas; // Alterna la visibilidad del selector de idiomas
  }

  cambiarIdioma(idioma: string): void {
    this.translate.use(idioma); // Cambia el idioma actual usado en la app
    this.mostrarIdiomas = false; // Oculta la lista de idiomas después de seleccionar uno
  }

}
