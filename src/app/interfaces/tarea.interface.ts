export interface TareaInterface {
   
    id:                         number;
    iD_Tarea:                   number;
    usuario_Creador:            string;
    email_Creador:              string;
    descripcion:                string;
    fecha_Inicial:              Date;
    fecha_Final:                Date;
    referencia:                 number;
    iD_Referencia:              string;
    referencia_Id:              string;
    descripcion_Referencia:     string;
    tarea_Observacion_1:        string;
    tarea_Fecha_Ini:            Date;
    tarea_Fecha_Fin:            Date;
    tipo_Tarea:                 number;
    descripcion_Tipo_Tarea:     string;
    estado_Objeto:              number;
    tarea_Estado:               string;
    usuario_Tarea:              string;
    backColor:                  string;
    nivel_Prioridad:            number;
    nom_Nivel_Prioridad:        string;
    registros:                  number;
    filtroTodasTareas:          boolean;
    filtroMisTareas:            boolean;
    filtroMisResponsabilidades: boolean;
    filtroMisInvitaciones:      boolean;
    usuario_Responsable?:       string;
    ultimo_Comentario?:         string;
    fecha_Ultimo_Comentario?:   Date;
    usuario_Ultimo_Comentario?: string;
}
