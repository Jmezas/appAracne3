export interface SalespointChannel {
    idCanalPdv: string;
    canalPdv: string;
}

export interface SalespointType {
    idTipoPdv: string;
    tipoPdv: string;
}

export interface CommercialPoint {
    idCentroComercial: string;
    centroComercial: string;
}

export interface MasterdataRequest {
    tableName: string;
    identifier: string;
    descriptor: string;
    where: string;
    orderBy: string;
}