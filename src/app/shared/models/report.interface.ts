import { SyncStatus } from '../constants/strings.constan';

export interface ReportModel {
  IdReporte?: string;
  //Common
  IdProducto?: string;
  IdSubFamiliaProducto?: string;
  SubFamiliaProducto?: string;
  IdFamiliaProducto?: string;
  FamiliaProducto?: string;
  IdJornada?: string;
  Ventas?: string;
  Stock?: string;
  StockModificado?: string;
  Precio?: string;
  Importe?: string;
  Observaciones?: string;
  UsModificacion?: string;
  FeModificacion?: string;
  UsCreacion?: string;
  FeCreacion?: string;
  PrecioRegular?: string;
  Flooring?: string;
  Producto?: string;
  FechaJornada?: string;
  Oculto?: boolean;

  //LG
  PrecioDescuento?: string;
  PVP_Normal?: string;
  PVP_Promo?: string;
  PVP_TC?: string;
  PREPAGO?: string;
  POSTPAGO?: string;
  PrecioTarjeta?: string;
  IdLineaNegocio?: string;
  UnidadNegocio?: string;

  //Promotoria
  GrupoVal?: string;
  VentasCompetencia?: string;
  Nº?: string;
  Stock_S?: string;
  Stock_R?: string;
  Apto?: string;
  No_Apto?: string;
  Demos?: string;
  ImporteTicket?: string;
  Facing?: string;
  Edad_0_20?: string;
  Edad_21_30?: string;
  Edad_31_40?: string;
  Edad_41_50?: string;
  Edad_Mas_50?: string;
  FechaVencimiento?: string;
  PrecioDcto?: string;
  RETIQ?: string;
  Stock2?: string;
  FechaVencimiento2?: string;
  Stock3?: string;
  FechaVencimiento3?: string;
  TotalKilos?: string;
  Ventas_0_5?: string;
  Ventas_6_10?: string;
  Ventas_mayor_10?: string;
  Lineal?: string;
  Cabecera?: string;
  PrecioSem?: string;
  PrecioFinDe?: string;
  Prescripciones?: string;
  Nombre?: string;
  Rut?: string;
  EstadoVenta?: string;
  Referencia?: string;
  Unidades?: string;
  SituacionStock?: string;
  IdCampana?: string;
  Activo?: string;
  NumeroFrentesAntes?: string;
  NumeroFrentesDepois?: string;
  SugestaoEncomenda?: string;
  Updated?: boolean;
  Status?: SyncStatus;
  ErrorMessage?: string;
  NumeroFrentesConcorrencia?: string;
  NumeroFrentesPernod?: string;
  PreVentaMi10T?: string;
  PreVentaMi10TScooter?: string;

  // Huawei
  StockSugerido?: string;
  Ingreso?: string;

  // Modulo Modificacion Reporte
  CantidadDiasModificar?: string;

  // region Xiaomi
  VentasTienda?: string;
  // endregion

  Reposicion?: string;
  QuiebreStock?: string;

  PedidoSugerido?: string;
  Transferencia?: string;

  StockInicial?: string;
  StockFinal?: string;
  Ingresos?: string;
}

export interface FilterFamily {
  Activo: boolean;
  FamiliaProducto: string;
  FeCreacion: any;
  FeModificacion: any;
  IdCampaña: number;
  IdFamiliaProducto: number;
  OrdenReporte: any;
  UsCreacion: number;
  UsModificacion: any;
}

export interface FilterSubfamily {
  IdSubFamiliaProducto: number;
  SubFamiliaProducto: string;
  IdFamiliaProducto: number;
  OrdenReporte: string;
  UsCreacion: number;
  Activo: boolean;
  FeCreacion: string;
  UsModificacion: number;
  FeModificacion: string;
}
