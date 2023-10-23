export interface IResponseItemSalePoint {
  IDPV: string;
  IdUsuario?: string;
  IdCampaña: string;
  Nombre_Completo?: string;
  NombreCentro: string;
  Direccion: string;
  IdAux_PV_Usuario?: string;
}

export interface IResponseItemSalePointReport {
  FechaJornada: string;
  'Tipo Jornada': string;
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
  Observaciones?: any;
  Estado: string;
  IdUsuario: number;
  IdCampaña: number;
  IdJornada: number;
  Punto_Venta_Calendar: string;
  Direccion_Calendar: string;
  Color_Marcador: string;
  IdTipoJornada: number;
  IdTurno: number;
  ID_Jefe_Equipo?: string;
  Rol: string;
  IdCampañaUsuario: number;
  'Reporte Obligatorio': boolean;
  EstadoJornada: string;
  IdEstadoJornada?: string;
  AsistenciaObligatoria: boolean;
  'Asistencia Obligatoria': boolean;
  Distancia: number;
  Abordajes: number;
  IdEstadoReporte: number;
  CheckIN: boolean;
  CheckOUT: boolean;
  AsistenciaPromotoriaObligatorio: boolean;
  GeoPromotoriaObligatorio: boolean;
  ReporteSinAsistencia: boolean;
  Asistencia: string;
  HoraAsis: string;
  AbordajesApMobObligatorio: boolean;
}

export const JornadaPVMapper = (jornadaPv: IResponseItemSalePointReport) => {
  return {
    enable: true,
    ...jornadaPv,
  };
};

export const JornadaPVListMapper = (
  listJornadaPv: Array<IResponseItemSalePointReport>
) => {
  return listJornadaPv.map((itemJornadaPV: IResponseItemSalePointReport) =>
    JornadaPVMapper(itemJornadaPV)
  );
};

/** Response PV de 'Informe de asistencia' (PA_ObtenerPDVsPorUsuario) */
export interface IResponsePVsInformeAsistencia {
  IDPV: number;
  IdCampaña: number;
  Grupo: string;
  'Punto de Venta': string;
  Direccion: string;
  Provincia: string;
  Poblacion: string;
  CP: string;
  CodigoPV: string;
  Observaciones: string;
  Distancia: number;
  Zona: string;
  Telefono: string;
  Latitud: string;
  Longitud: string;
  Activo: boolean;
  IdPoblacion: number;
  IdProvincia: number;
  IdPais: number;
  Pais: string;
  IdGrupo: number;
  IdZona: number;
  Canal: string;
}

export interface IResponseItemAvailableReportPV {
  IDPV: number;
  IdUsuario: number;
  DocumentoIdentidad?: string;
  IdCampaña: number;
  Nombre_Completo: string;
  NombreCentro: string;
  Direccion: string;
  CP?: string;
  IdAux_PV_Usuario: number;
  SUPERVISOR?: number;
  ZONA?: string;
  RUT?: string;
  NroLocal?: string;
  IdRol?: number;
  Rol?: string;
}

export interface IResponseNearbySalesPointLocation {
  IDPV: number,
  IdCampaña: number,
  Grupo: string,
  PuntoVenta: string,
  Direccion: string,
  Provincia: string,
  Ciudad: string,
  CP: string,
  CodigoPV: string,
  Observaciones: string,
  Distancia?: number,
  Zona: string,
  Telefono: string,
  Latitud: string,
  Longitud: string, 
  Activo: number,
  IdPoblacion?: number,
  IdPais?: number,
  Pais: string,
  IdGrupo?: number,
  IdZona?: number,
  IdLineaNegocio?: number
}

export interface ApiPV {
  IDPV: string;
  IdCampaña: string;
  Grupo: string;
  // @SerializedName("Punto de Venta")
  NombreCentro: string;
  Direccion: string;
  Provincia: string;
  Poblacion: string;
  // @SerializedName("CP")
  CodigoPostal?: string;
  CP: string;
  CodigoPV: string;
  Observaciones: string;
  Distancia: string;
  Zona: string;
  Telefono: string;
  Latitud: string;
  Longitud: string;
  Activo: string;
  IdPoblacion: string;
  IdProvincia: string;
  IdPais: string;
  Pais: string;
  IdGrupo: string;
  IdZona: string;
  IdLineaNegocio: string;
}

export interface PV {
  IDPV: string;
  IdCampaña?: string;
  Grupo?: string;
  NombreCentro: string;
  Direccion: string;
  Provincia?: string;
  Poblacion?: string;
  CodigoPostal: string;
  CodigoPV?: string;
  Observaciones: string;
  Distancia?: string;
  Zona?: string;
  Telefono: string;
  Latitud?: string;
  Longitud?: string;
  Activo?: string;
  IdPoblacion: string;
  IdProvincia: string;
  IdPais?: string;
  Pais?: string;
  IdGrupo?: string;
  IdZona?: string;
  IdLineaNegocio?: string;
}