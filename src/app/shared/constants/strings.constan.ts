export const APP_NAME = 'Aracne 3';

export const TXT_INFORME_ASISTENCIA = {
    label_rol: 'Rol',
    label_punto_venta: 'Punto de Venta',
    lbl_fecha_jornada: 'Fecha Jornada'
};

export const TXT_BTN = {
    btn_aceptar: 'Aceptar'
};

export const TXT_GESTION_JORNARAS = {
    tab_consultar: 'CONSULTAR',
    tab_asignar: 'ASIGNAR',
    lable_fecha: 'Fecha',
    lbl_usuario: 'Usuario',
    lbl_tipo_jornada: 'Tipo de Jornada',
    lbl_turno: 'Turno',
    lbl_hora_inicio: 'Hora Inicio',
    lbl_hora_fin: 'Hora Fin',
    lbl_puntos_venta: 'Puntoys de Venta',
    btn_crear_jornada: 'CREAR JORNADA'
};

export const TXT_MENU_TABS_REPORT = {
    txtPointSaleMenu: 'Punto de Venta',
    txtReportMenu: 'Reporte',
    txtIncidenceMenu:  'Incidencias',
    txtIncidenceMenu_99:  'Mobiliario',
    txtIncidenciasXiaomi:  'Incidencias',
    txtVisibilityExhibitionMenu:  'Visibilidad / Exhibición',
    txtVisibilityExhibitionMenu_99:  'Exhibición',
    txtCompetenceMenu:  'Competencias',
    txtEstatusCompetencia:  'Estatus competencia',
    txtOtrosXiaomi:  'Otros',
    caducidades:  'Caducidades',
    distribuidor:  'Distribuidor',
    gestionprecio:  'Gestión precios',
    marketSensing:  'Market Sensing',
    gestionactividades:  'Gestión actividades',
    fichaventa:  'Ficha venta',
    fichastock:  'Ficha stock',
    fichavisibilidad:  'Ficha visibilidad',
    VENTA: 'Ventas Pay Joy',
};

export const TXT_ALERT_MESSAGES = {
    required_permissions: 'Se requiere aceptar todos los permisos solicitados en: Ajustes→Aplicaciones→'+APP_NAME+'→Permisos'
};

export enum SyncStatus {
    UPDATED = 'UPDATED', DELETED = 'DELETED', INSERTED = 'INSERTED', SYNC = 'SYNC', ERROR = 'ERROR'
}

export const menuErrores = 'Errores';
export const menuPendientes = 'Pendientes';

export enum REFERENCES_TABS_REPORTS  {
    PV = 'Punto de Venta',
    REPORT = 'Reporte',
    INCIDENCES = 'Incidencias',
    VISIBILITY_EXHIBICION = 'Visibilidad/Exhibición',
    // VISIBILIDAD_COMPETENCIA = "Visibilidad/Competencia",
    // COMPETENCIAS = "Competencia",
    // COMPETENCIA_PRODUCTO = "Reporte Competencia",
    // ESTATUS_COMPETENCIA = "Estatus Competencia",
    // INCIDENCIAS_XIAOMI = "Incidencias Xiaomi",
    // OTROS_XIAOMI = "Otros",
    // CADUCACIDADES = "Caducaciones",
    // DISTRIBUIDOR = "Distribuidor",
    // GESTIONPRECIO = "Gestión precios",
    // MARKETSENSING = "Market Sensing",
    // GESTIONACTIVIDADES = "Gestión actividad",
    // VENTA = "Ventas Pay Joy",
    // FICHA_VENTA = "Ficha Venta",
    // FICHA_STOCK = "Ficha Stock",
    // FICHA_SHARE = "Ficha visibilidad",
}

export const successCreateExhibition = 'Exhibición guardada';
export const errorCreateExhibition = 'Error al crear la exhibición. Por favor intentelo de nuevo más tarde';

export const IncidenciaText = {
    CREATE_REMOTE: 'La incidencia se ha grabado correctamente.',
    CREATE_LOCAL: 'Incidencia ha sido almacenada en su dispositivo',
    ALERT_DELETE: '¿Está seguro de querer eliminar esta incidencia?',
    ERROR_CREATE: 'Error al crear la incidencia. Por favor intentelo de nuevo más tarde',
    DELETE: 'La incidencia ha sido eliminada',
    UPDATE: 'La incidencia ha sido actualizada',
    ERROR_DELETE: 'No se ha podido borrar la incidencia'
}

export const ExhibitionText = {
    DELETE : 'La exhibición ha sido eliminada',
    ERROR_DELETE : 'Error eliminando la exhibición',
}
