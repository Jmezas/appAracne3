export interface IChartBasicConfig {
    labels: Array<string>;
    values: Array<number>;
    colors?: Array<string>; // Colores hexadecimales
    lablesSerieBARS?: Array<string>; // Solo grafico de barras 
    position?: string; // y: horizontal, x: default y vertical
    titleChart?: string;
}