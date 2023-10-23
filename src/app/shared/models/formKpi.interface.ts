import { IChartBasicConfig } from './charts.interface';

export interface FormKpi {
    idKpiFormulario: number;
    idFormulario: number;
    nombreFormulario: string;
    descriptor: string;
    activo: boolean;
    kpis: Kpi[];
    graphicKpi?: IChartBasicConfig
}

export interface Kpi {
    idKpi: number;
    idKpiFormulario: number;
    descriptorKpi: string;
    valorKpi: number;
    idCampo?: number;
    operador?: string;
    idValor?: number;
    activo: boolean;
}