export interface IResponseCampaignRol {
  IdUsuario: number;
  IdCampaña: number;
  Cliente: string;
  IdRol: number;
  IdUnidadNegocio: number;
}

export interface IRolesState {
  rolesItems: Array<IResponseCampaignsRolesPA>
}
export interface IResponseCampaignsRolesPA {
  IdRol: number, 
  Rol: string
}
