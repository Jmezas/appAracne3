import { SyncStatus } from '../constants/strings.constan';

export interface Incidencia {
  IdLocal?: number;
  IdIncidencia: number;
  IdJornada: number;
  IdTipoIncidencia: number;
  IdSubTipoIncidencia: number;
  IdEstadoIncidencia: number;
  Observaciones: string;
  FotoIncidenciaA: string;
  FotoIncidenciaB: string;
  IdIncidenciaProducto: number;
  UsModificacion: string;
  FeModificacion: string;
  UsCreacion: string;
  FeCreacion?: string;
  TipoIncidencia: string;
  Otras: string;
  EstadoIncidencia: string;
  Gestion: string;
  IdCampania: number;
  idProducto?: number;
  IdUsuario: number;
  Fecha: string;
  IDPV: number;
  NombreCampania: string;
  IdLineaNegocio?: string;

  //Promotoria
  IdGrupoIncidencia?: string;
  GrupoIncidencia?: string;
  Responsable?: string;
  CorreoResponsable?: string;
  CorreoCopia?: string;

  // Huawei
  Oportunidades?: string;
}

export interface IncidenciaDBModel extends Incidencia {
  Status?: SyncStatus;
  ErrorMessage?: string;
  FechaError?: string;
}

// Selectes

export interface ConfigReglasApi {
  Activo: boolean;
  Clave: string;
  Descripcion: string;
  IdCampaña: number;
  IdConfigRegla: number;
  TextoLabel: string;
  Value: string;
}

export interface CorreoGrupo {
  Correo: '';
  IdJornada: 4003649;
  Responsable: '';
}

export interface ApiIncidencia {
  IdIncidencia: number;
  IdJornada: number;
  IdTipoIncidencia: number;
  IdSubTipoIncidencia: number;
  IdEstadoIncidencia: number;
  Observaciones: string;
  'Grupo Incidencia'?: string;
  Responsable: string;
  'Correo Responsable'?: string;
  'Correo Copia'?: string;
  FotoIncidenciaA: string;
  FotoIncidenciaB: string;
  IdIncidenciaProducto: number;
  UsModificacion: string;
  FeModificacion: string;
  UsCreacion: string;
  'Fecha Creacion'?: string;
  TipoIncidencia: string;
  Otras: string;
  EstadoIncidencia: string;
  Gestion: string;
  'IdCampaña'?: number;
  idProducto?: number;
  IdUsuario: number;
  Fecha: string;
  IDPV: number;
  Campaña: string;
  Oportunidades?: string;
}
