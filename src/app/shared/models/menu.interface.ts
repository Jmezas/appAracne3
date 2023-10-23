export interface IMenuState {
    menuItems: Array<IMenuItem>
}

export interface IMenuItem {
    Id: number,
    IdCampaña: number,
    IdRol: number,
    IdModulo: number,
    AsignarJornadasReporte: boolean,
    AccesoGaleria: boolean;
}

export interface MenuApp {
    id: number;
    idCampania: number;
    idRol: number;
    idModulo: number;
    asignarJornadasReporte: boolean;
    accesoGaleria: boolean;
    modulo: string;
    orden: number;
    icono: string;
    route?: string;
}