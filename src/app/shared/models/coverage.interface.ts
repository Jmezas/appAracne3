export interface IItemResponseCoverage {
  'Asistencia Obligatoria': boolean;
  AsistenciaObligatoria: boolean;
  CodigoPV: string;
  CodigoPostal: string;
  Color_Marcador: string;
  Direccion: string;
  Direccion_Calendar: string;
  Distancia: number
  Estado: string;
  EstadoJornada: string;
  FechaJornada: string;
  Fecha_Hora_Fin: string;
  Fecha_Hora_Inicio: string;
  Gestor: string;
  IDPV: number
  ID_Jefe_Equipo: null
  IdAsistencia: null
  IdCampaña: number
  IdCampañaUsuario: number
  IdEstadoJornada: null
  IdJornada: number
  IdTipoJornada: number
  IdTurno: number
  IdUsuario: number
  Latitud: string;
  Longitud: string;
  Observaciones: null
  Provincia: string;
  Punto_Venta: string;
  Punto_Venta_Calendar: string;
  'Reporte Obligatorio': true
  Rol: string;
  'Tipo Jornada': string;
  TipoAsistencia: null
  Turno: string;
}

export interface ICoverageModel {
  countCoverage: number;
  countNoCoverage: number;
  total: number;
  percent: number;
}
