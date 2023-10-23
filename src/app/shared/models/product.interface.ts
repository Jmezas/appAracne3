export interface ProductoCampaign {
    idProducto: number;
    idLineaProducto: number;
    producto: string;
    codigoBarras: string;
    codigoInternoFabricante: string;
    foto: string;
    pvp: number;
    activo: boolean;
    lineaProducto: string;
}

export interface ApiProductCampaign {
    IdProducto: string;
    SubFamilia: string;
    FamSubFamProducto: string;
    Producto: string;
    IdCampaña: string;
    Activo: string;
    FamiliaProducto: string;
    ReporteVisibilidad: string;
    IdSubFamiliaProducto: string;
}