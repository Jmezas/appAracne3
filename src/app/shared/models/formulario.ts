export interface FormularioNormal {
  idFormulario: number;
  nombreFormulario: string;
  numeroCampos: number;
  asistenciaObligatoria: boolean;
  obligatorio: boolean;
  activo: boolean;
  publicado: boolean;
  edicionAprobacion: boolean;
  idRolEdicionAprobacion: number;
  fechaFinEdicionAprobacion?: Date;
  fechaCreacion: Date;
  fechaPublicado?: Date;
  obligatorioIcon?: string;
  isCompleted?: boolean;
  asociadoPdv?: boolean;
  salespointId?: number;
  salespointName?: string;
  campaignId?: number;
}

export interface FormularioLibre {
  idFormulario: number;
  nombreFormulario: string;
  asistenciaObligatoria: boolean;
  edicionAprobacion: boolean;
  idRolEdicionAprobacion?: number;
  fechaFinEdicionAprobacion?: Date;
  activo: boolean;
  obligatorio: boolean;
  publicado: boolean;
  usCreacion: number;
  campos: CampoLibre[];
}

export interface CampoLibre {
  idCampo: number;
  tipoCampo: string;
  nombreCampo: string;
  idControl: string;
  idTipoCampo: number;
  tipoControl: string;
  prefijo: string;
  obligatorio: boolean;
  activo: boolean;
  orden: number;
  reutilizable: boolean;
  referenteTema: boolean;
  idCampoDependenciaPadre?: number;
  opciones: OpcionLibre[];
  imageUploadUrl?: any;
  imageSendUrl?: any;
  visible?: boolean;
}

export interface OpcionLibre {
  idValor: number;
  valor: string;
  idCampoDependenciaHijo?: number;
}

// Request
export interface FormularioLibreRequest {
  dataInsertReporteFormulario: DataInsertReporteFormulario;
  dataInsertAsistenciasList: DataInsertAsistenciasList[];
}

export interface DataInsertAsistenciasList {
  idReporteFormulario: number;
  idTipoAsistencia: number;
  fechaHoraCheckIn: string;
  latitud: string;
  longitud: string;
  direccionGoogle: string;
  observaciones: string;
  foto: string;
  nivelBateria: number;
  ubicacionFalsa: string;
  esAutomatico: boolean;
  usCreacion: number;
}

export interface DataInsertReporteFormulario {
  idReporteFormulario: number;
  idFormulario: number;
  idUsuario: number;
  idPdv?: number;
  fechaReporte: string;
  nivelBateria: number;
  esAutomatico: boolean;
  respuestas: Respuesta[];
  usCreacion?: number;
  salespointName?: string;
}

export interface Respuesta {
  idCampo: number;
  valor: string[];
  valorFileSendUrl?: any;
}

export interface RespuestaImageResponse {
  success: boolean;
  idFileBlob?: string;
  respuesta: Respuesta;
}

export interface FormularioLibreResponse {
  statusCode: number;
  response: string;
}
