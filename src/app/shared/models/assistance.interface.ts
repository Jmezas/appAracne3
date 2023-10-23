export interface CalendarAssistance {
    assistanceType: number
    comments: string,
    photo: string,
    dateMarked: Date
}

export interface AssistanceType {
    idTipoAsistencia: number;
    tipoAsistencia: string;
    observaciones: boolean;
    foto: boolean;
    activo: boolean;
    idCampania?: number;
}

export interface AssistanceWorkRequest {
    idJornada: number;
    idPdv: number;
    idTipoAsistencia: number;
    fechaHora: string;
    latitud: string;
    longitud: string;
    direccionGoogle: string;
    observaciones: string;
    foto: string;
    nivelBateria: number;
    distanciaPdv: number;
    ubicacionFalsa: string;
    esAutomatico: boolean;
    usCreacion: number;
    idMotivoCheckout?:number
    idFileMotivoCheckout?:string
}

export interface AssistanceWorkResponse {
    idAsistenciaJornada: number;
    idJornada: number;
    idPdv: number;
    idTipoAsistencia: number;
    fechaHora: Date;
    latitud: string;
    longitud: string;
    direccionGoogle: string;
    observaciones: string;
    foto: string;
    nivelBateria: number;
    distanciaPdv?: number;
    ubicacionFalsa: null;
    usModificacion: null;
    feModificacion: null;
    usCreacion: number;
    idCampania?: number;
}

export interface AssistanceInsertResponse {
    statusCode: number,
    response: string
}

export interface AssistanceExpiredRequest {
    idJornada: number;
    idPdv: number;
}

export interface AssistanceType {
  idTipoAsistencia: number;
  tipoAsistencia: string;
  observaciones: boolean;
  foto: boolean;
  activo: boolean;
  idCampania?: number;
}

export interface AssistanceConfigResponse {
  configuracion: string
  idConfigCampaña: number
  idCampaña: number
  valor: boolean
  activo: boolean
}
