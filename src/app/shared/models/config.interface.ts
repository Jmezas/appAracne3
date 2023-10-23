export interface IVersionResponse {
  id: number;
  version: string;
  fechaModificacion: string;
  store: string;
}

export interface IItemModuleOffline {
  id: number
  title: string,
  url: string,
  icon: string,
  color: string,
}

export interface EmitIncidenciaId {
  remoteId: number;
  localId: number;
}

export interface EmitExhibicionId {
  remoteId: number;
  localId: number;
}

export interface ISearchBarConfig {
  placeholder: string;
}


export interface IGenericUploadImage {
  campaignName: string,
  imagePath: string,
  fileName: string
}
