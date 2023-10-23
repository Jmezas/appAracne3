// Formularios
export interface FormularioJornada {
  idFormularioJornada: number;
  idPdv: number;
  idJornada: number;
  nombreFormulario: string;
  temaFormulario: string;
  obligatorio: boolean;
  activo: boolean;
  publicado: boolean;
  completado: boolean;
  obligatorioIcon?: string;
  temaFormularioIcon?: string;
  isCompleted?: boolean;
  salespointName?: string;
  isSynchronized?: boolean;
  idUsuarioJornada?: number;
  fechaJornada?: Date;
  campaignId?: number;
}

// Formulario Server
export interface FormularioResponse {
  idFormularioJornada: number;
  nombreFormulario: string;
  idTemaFormulario: number;
  edicionAprobacion: boolean;
  idRolEdicionAprobacion: number;
  fechaFinEdicionAprobacion: Date;
  activo: boolean;
  obligatorio: boolean;
  publicado: boolean;
  usCreacion: number;
  campos: Array<CampoResponse>;
  camposDetalleTema: Array<CampoDetalleTemaResponse>;
}

export interface CampoResponse {
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
  idCampoDependenciaPadre: any;
  opciones: Array<OpcionResponse>;
}

export interface OpcionResponse {
  idValor: number;
  valor: string;
  idCampoDependenciaHijo: any;
}

export interface CampoDetalleTemaResponse {
  idSuperCategoria: number;
  idCategoria: number;
  idMarca: number;
  idLineaProducto: number;
  idProducto: number;
  idDetalleTema: number;
  detalleTema: string;
  imagenTema?: string;
  campos: Array<CampoResponse>;
}

// Formulario en SQLite
export interface Formulario {
  idFormularioJornada: number;
  nombreFormulario: string;
  idTemaFormulario: number;
  edicionAprobacion: boolean;
  idRolEdicionAprobacion: number;
  fechaFinEdicionAprobacion: Date;
  activo: boolean;
  obligatorio: boolean;
  publicado: boolean;
  usCreacion: number;
  detalleTema: Array<DetalleTema>;
  idJornada?: number;
  idPdv?: number;
  campaignId?: number;
}

export interface DetalleTema {
  idFormularioJornada?: number;
  idSuperCategoria?: number;
  idCategoria?: number;
  idMarca?: number;
  idLineaProducto?: number;
  idProducto?: number;
  idDetalleTema: number;
  detalleTema: string;
  imagenTema?: string;
  campos: Array<Campo>;
  isImageLoading?: boolean;
  isSaveLoading?: boolean;
  isCompleted?: boolean;
  isVisible?: boolean;
}

export interface Campo {
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
  opciones: Array<Opcion>;
  imageUploadUrl?: any;
  imageSendUrl?: any;
  idDetalleTema?: number;
  idFormularioJornada?: number;
  visible?: boolean;
}

export interface Opcion {
  idCampo?: number;
  idDetalleTema?: number;
  idFormularioJornada?: number;
  idValor: number;
  valor: string;
  idCampoDependenciaHijo?: number;
} 

// Respuestas
export interface FormularioRespuesta {
  idFormularioJornada: number;
  idUsuario: number;
  idPdv: number;
  idJornada: number;
  fechaReporte: string;
  idDetalleTema?: number;
  idControl: string;
  idCampo: number;
  valor: Array<string>;
  valueFileUploadUrl?: any;
  valueFileSendUrl?: any;
  usCreacion?: number;
}

export interface FormularioImageResponse {
  success: boolean;
  idFileBlob?: string;
  respuesta: FormularioRespuesta;
}

// Request enviar los Formularios.
export interface FormularioRequest {
  idFormularioJornada: number;
  idUsuario: number;
  idPdv: number;
  idJornada: number;
  fechaReporte: string;
  nivelBateria: number;
  esAutomatico: boolean;
  detallesTema: DetallesTemaRequest[];
  respuestas: RespuestaRequest[];
  usCreacion?: number;
}

export interface DetallesTemaRequest {
  idDetalleTema: number;
  respuestas: RespuestaRequest[];
}

export interface RespuestaRequest {
  idCampo: number;
  valor: string[];
}

export interface FormsInsertResponse {
  statusCode: number;
  response: string;
  responseReporteFormularioJornada: FormWordDayResponse;
}

export interface FormWordDayResponse {
  idReporteFormularioJornada: number;
  idFormularioJornada: number;
  idPdv: number;
  idJornada: number;
}

export interface DependencyThemeFormRequest {
  idTemaFormulario: number;
  idSuperCategoria: number;
  idCategoria: number;
  idMarca: number;
  idLineaProducto: number;
  idProducto: number;
}

export enum FormThemeType {
  'SUPERCATEGORIA' = 1,
  'CATEGORIA' = 2,
  'MARCA' = 3,
  'LINEAPRODUCTO' = 4,
  'PRODUCTO' = 5
}

export interface DependencyThemeForm {
  idTemaDependencia: number;
  nombreTemaDependencia: string;
  activoTemaDependencia: boolean;
  tipoTemaDependencia: string;
  parametro1: string;
  valor1: number;
  parametro2: string;
  valor2: number;
  campaignId?: number;
  formThemeId?: number;
}

export interface FilterDependencyThemeForm {
  identifier: string;
  title: string;
  subtitle: string;
  options: Array<FilterDependencyThemeFormOptions>;
  valueSelected?: number;
}

export interface FilterDependencyThemeFormOptions {
  valueId: number;
  valueName: string;
}

export interface CancelarJornadas {
  idJornada: number[];
  idPV: number[];
  idMotivoCancelacion: number;
  idUsuario: number;
  idFileMotivoCancelacion:string;
}
