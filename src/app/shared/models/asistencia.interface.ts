import { SyncStatus } from "../constants/strings.constan";

export interface ApiInformeAsistencia {
    IdJornada: string,
    IdUsuario: string,
    Nombre_Completo: string,
    IDPV: string,
    NombreCentro: string,
    InicioAsistencia: string,
    InicioDescanso: string,
    FinDescanso: string,
    FinAsistencia: string,
    Fecha: string,
    IdCampaña: string,
    IdLineaNegocio: string,
}
export interface AsistenciaModel {
    IdAsistencia?: string;
    IdJornada: string;
    FechaReg: string;
    FechaHoraIni: string;
    Latitud?: string;
    Longitud?: string;
    TipoAsistencia: string;
    UsCreacion: string;
    IdCampaña: string;
    Observacion: string;
    FechaHoraSync?: string;
    LogAsistencia?: string;
    LogGeo?: string;
    IdLineaNegocio?: string;
    Status: SyncStatus;
    ErrorMessage?: string;
    imagepath: string;
    NombreCampaña: string;
    Imei?: string;
}

export interface AsistenciaDBModel extends AsistenciaModel {
    LocalId?: number;
    FechaError?: string;
}

