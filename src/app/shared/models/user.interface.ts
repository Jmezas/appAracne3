export interface IItemUserResponse {
    Nombre_Completo: string,
    Campaña: string,
    IdUsuario: number,
    IdCampaña: number,
    IdCampañaPredeterminada: number,
    Activo: boolean,
    Logo: string,
    OrigenDatosGrafico1: string,
    OrigenDatosGrafico2: string,
    OrigenDatosGrafico3: string,
    IdLineaNegocio: number,
    LineaNegocio: string,
    Activo_Usuario: boolean,
    ID_Jefe_Equipo?: number,
    DesList: string,
    Nombre_Rol: string,
    IdRol: number,
    Rol: string,
    Cliente: string,
    UsuarioNombre: string,
    OnLine?: number,
    UsuarioDNI: string
}

export interface IUserToken {
    token: string,
    refreshTokenExpirationTime: Date
}

export interface IUserAuth {
    uid: string,
    nombre: string,
    role?: string,
    token: string,
}

export interface UserData {
    IdUsuario: number,
    NombreCompleto: string,
    Usuario: string,
    Nombre?: string,
    Apellidos?: String,
    IdRol: number,
    Rol: string
}

export interface UserCampaign {
    idUsuario: number;
    usuario: string,
    idJefeEquipo: number,
    idRol: number,
    rol: string,
    perfilAdminA3: boolean,
    perfilJefeEquipoA3: boolean,
    perfilPromotorA3: boolean
}