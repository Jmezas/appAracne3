import { SyncStatus } from "../constants/strings.constan";

export interface IItemWorkdayType {
  IdTipoJornada: string;
  IdCampaña: string;
  TipoJornada: string;
  Importe: string;
  ImporteFacturacion: number;
  Dieta: number;
  Jornadas: number;
  IdEstadoReporte?: number;
  Num_PVs_Asignar: number;
  VisibleJornada: boolean;
  Activo: boolean;
  UsModificacion?: string;
  FeModificacion?: string;
  UsCreacion: string;
  FeCreacion: string;
  Flag_Jornada: string
  AsistenciaObligatoria: boolean
}

export interface IItemWorkdayTurn {
  Activo: boolean;
  FeCreacion: string;
  Flag_Jornada: number;
  IdCampaña: number;
  IdTurno: number;
  Turno: string;
  UsCreacion: number;
}

export interface IItemResponseVerifyWorkday {
  Message: string
}

export interface IResponseWorkDay {
  IdAsistencia: number
}

export interface IRequestWorkDay {
  assistanceId: number,
  assistanceModuleId: number,
  assistanceType: number,
  assistanceDate: string,
  address?: string,
  salesPointId?: number,
  latitude: string,
  longitude: string,
  campaignId: number,
  userId: number
}

export interface Rutas {
  idRuta: number;
  idJornada: number;
  idTipoRuta: number;
  tipoRuta: string;
  idUsuario: number;
  nombreRuta: string;
  fechaJornada: string;
  horaEntrada: string;
  horaSalida: string;
  pdvsJornada: PdvsJornada[];
}

export interface PdvsJornada {
  idRuta: number;
  idPdv: number;
  idJornada: number;
  nombrePdv: string;
  direccion: string;
  codigoPdv: string;
  ordenVisita: string;
  latitud: string;
  longitud: string;
  distancia: number;
  activo: boolean;
  idMotivoCancelacion: number;
  asistenciaCompleta: number;
}

export interface JornadaPVModel {
  FechaJornada: string;
  TipoJornada: string;
  Turno: string;
  Fecha_Hora_Inicio: string;
  Fecha_Hora_Fin: string;
  IDPV: string;
  Latitud: string;
  Longitud: string;
  Punto_Venta: string;
  Direccion: string;
  CodigoPostal: string;
  CodigoPV: string;
  Provincia: string;
  Gestor: string;
  Observaciones: string;
  Estado: string;
  IdUsuario: string;
  IdCampaña: string;
  IdJornada: string;
  Punto_Venta_Calendar: string;
  Direccion_Calendar: string;
  Color_Marcador: string;
  IdTipoJornada: string;
  IdTurno: string;
  ID_Jefe_Equipo: string;
  Rol: string;
  IdCampañaUsuario: string;
  ReporteObligatorio: string;
  EstadoJornada: string;
  IdEstadoJornada: string;
  AsistenciaObligatoria: boolean;
  CheckIN: string;
  CheckOUT: string;
  Distancia: string;
  Abordajes: string;
  AsistenciaPromotoriaObligatorio: string;
  GeoPromotoriaObligatorio: string;
  AbordajesApMobObligatorio: string;
  ReporteSinAsistencia: string;
  IdEstadoReporte: string;
  Asistencia: string;
  UsModificacion: string;
  FeModificacion: string;
  IdLineaNegocio: string;
  HoraAsis: string;
}

export interface JornadaPVModelDB extends JornadaPVModel {
  Status: SyncStatus;
  ErrorMessage: string;
}

export interface PdvRutaLibre {
  idPdv: number;
  nombrePdv: string;
  razonSocial: string;
  direccion: string;
  latitud: string;
  longitud: string;
  codigoPostal: string;
  codigoPdv: string;
}

export interface PdvRutaInsertRequest {
  dataInsertJornadasPuntoDeVenta: Array<DataPdvRutaInsert>
}

export interface DataPdvRutaInsert {
  idJornada: number;
  idPdv: number;
  ordenVisita: number;
  usCreacion: number;
}

export interface PdvRutaInsertResponse {
  statusCode: number,
  response: string
}

export interface InformationPDV {
  idPDV:number
  nombreGerente?: string
  telefono?: string
  facturacion?: string
  nombreCanal?: string
  fechaUltimaVisita?: string
}