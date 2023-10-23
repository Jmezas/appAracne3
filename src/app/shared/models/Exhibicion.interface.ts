import { SyncStatus } from '../constants/strings.constan';

export interface Exhibicion {
  IdFoto?: number;
  IdJornada: number;
  IdTipoCategoriaFoto?: string;
  Foto: string;
  Foto2: string;
  Foto3?: string;
  Observaciones: string;
  UsCreacion?: string;
  FeCreacion?: string;
  Fecha?: string;
  UsModificacion?: string;
  FeModificacion?: string;
  IdCampana?: string;
  Campana?: string;
  TipoFamiliaFoto?: string;
  TipoSubFamiliaFoto?: string;
  TipoCategoriaFoto: string;
  IdLineaNegocio?: string;
  Status?: SyncStatus;
  PrecioExhibi?: string;
  PrecioSitema?: string;
  CantidadSotck?: string;
  ExhiDisponible?: string;
}

export interface ExhibitionGet {
  IdFoto: number;
  IdJornada:  number;
  TipoFamiliaFoto: string;
  TipoSubFamiliaFoto: string;
  TipoCategoriaFoto: string;
  Foto: string;
  Foto2: string;
  Observaciones: string;
  'Fecha Creacion'?: string;
  Campaña?: string;
}

export interface ExhibicionDBModel extends Omit<Exhibicion, 'IdCampaña'|'Campaña'> {
  IdLocal?: number;
  Campana?: string;
  IdCampana?: string;
  MensajeDeError?: string;
  FechaDeError?: string;
}

export interface FamiliaExhibicion {
  IdTipoFamiliaFoto: string;
  IdCampaña: string;
  TipoFamiliaFoto: string;
  Activo: string;
  IdLineaNegocio: string;
}

export interface SubFamiliaExhibicion {
  IdTipoSubFamiliaFoto: string;
  IdTipoFamiliaFoto: string;
  TipoSubFamiliaFoto: string;
  Activo: string;
  IdLineaNegocio: string;
}

export interface CategoriaExhibicion {
  IdTipoCategoriaFoto: string;
  IdTipoSubFamiliaFoto: string;
  IdCampaña: string;
  TipoCategoriaFoto: string;
  Activo: string;
}
