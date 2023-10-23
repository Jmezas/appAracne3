export interface IResponseCampaignsAracne {
  campaniasList: Array<IItemCampaign>;
  tipoAracne: string;
  logo?: string;
}

export interface IItemCampaign {
  idLineaNegocio: number;
  lineaNegocio: string;
  idCampania: number;
  campania: string;
  bbddCampania: string;
  idRol: number;
  rol: string;
  urlSiteCampania: string;
  tokenUserConfig: string;
  codBI: string;
  paisCampania: string;
  pais: string;
  online?: boolean;
  decodeTokenUserConfig?: DecodeTokenItemCampaign;
  topicCampaign: string;
  topicRol: string;
}

export interface DecodeTokenItemCampaign {
  IdRol?: string;
  IdCampania?: string;
  CATLGCampania?: string;
  CodBI?: string;
  Campania?: string;
  Pais?: string;
  CountryPath?: string;
  CampaignPath?: string;
  TimeZoneID?: string;
  LogoCampania?: string;
  Kpis?: boolean;
  isReporter?: boolean;
  nbf?: number;
  exp?: number;
  iat?: number;
}
