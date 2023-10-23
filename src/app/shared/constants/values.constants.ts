import { colorAccent, colorAccent1, colorAccent2, colorAccent3 } from "./colors.constant";
import { TXT_MENU_TABS_REPORT } from "./strings.constan"

export const ROLES = {
    USER_ADMIN: '1',
    USER_PROMOTER: '2',
    USER_BOSS: "3",
    USER_MERCHAND: "5",
    USER_BOSS_2: "7",
    USER_MERCHAND_LG: "22",
}

export enum ICON_MENU_ITEM {
    ITEM_SEARCHBAR = 'SEARCHBAR'
}

export enum TYPE_REQUEST {
    REQUEST_GET = 'GET',
    REQUEST_POST = 'POST',
    REQUEST_EXECUTE = 'EXECUTE',
    REQUEST_SEND_FILE = 'SEND_FILE'
}

export enum TYPE_CHARTS {
    CHART_PIE = 'PIE',
    CHART_BAR = 'BAR',
}

export const BUSINESS_LINE = {
    BUSSINESS_LINE_PROMOTORIA: "1",
    BUSSINESS_LINE_GPV: "6",
    BUSSINESS_LINE_PROMOTORIA_LG: "10",
    BUSSINESS_LINE_PROMOTORIA_LG_PE: "13",
}

export const LOCAL_DB_NAMES = {
    UNIFICATION: 'UNIFICATION',
    DEFAULT: 'database-name'
}

export const SUB_MODULES_REPORT = (campaingId: string) => ({
    PV: {
        title: TXT_MENU_TABS_REPORT.txtPointSaleMenu,
        icon: 'assignment_ind',
        color: colorAccent,
        url: 'gestion-punto-venta'
    },
    REPORT: {
        title: TXT_MENU_TABS_REPORT.txtReportMenu,
        icon: 'assignment',
        color: colorAccent1,
        url: 'reporte-ventas'
    },
    INCIDENCES: {
        title: campaingId == "99" ? TXT_MENU_TABS_REPORT.txtIncidenceMenu_99 : TXT_MENU_TABS_REPORT.txtIncidenceMenu,
        icon: 'record_voice_over',
        color: colorAccent2,
        url: 'insidencias'
    },
    // INCIDENCIAS_XIAOMI : {
    //     title: TXT_MENU_TABS_REPORT.txtIncidenciasXiaomi,
    //     icon: '',
    //     color: ''
    // },
    VISIBILITY_EXHIBICION: {
        title: campaingId == "99" ? TXT_MENU_TABS_REPORT.txtVisibilityExhibitionMenu_99 : TXT_MENU_TABS_REPORT.txtVisibilityExhibitionMenu,
        icon: 'store',
        color: colorAccent3,
        url: 'exhibicion'
    },
    // COMPETENCIAS : {
    //     title: TXT_MENU_TABS_REPORT.txtCompetenceMenu,
    //     icon: '',
    //     color: ''
    // },
    // COMPETENCIA_PRODUCTO : {
    //     title: TXT_MENU_TABS_REPORT.txtCompetenceMenu,
    //     icon: '',
    //     color: ''
    // },
    // ESTATUS_COMPETENCIA : {
    //     title: TXT_MENU_TABS_REPORT.txtEstatusCompetencia,
    //     icon: '',
    //     color: ''
    // },
    // OTROS_XIAOMI : {
    //     title: TXT_MENU_TABS_REPORT.txtOtrosXiaomi,
    //     icon: '',
    //     color: ''
    // },
    // CADUCACIDADES : {
    //     title: TXT_MENU_TABS_REPORT.caducidades,
    //     icon: '',
    //     color: ''
    // },
    // DISTRIBUIDOR : {
    //     title: TXT_MENU_TABS_REPORT.distribuidor,
    //     icon: '',
    //     color: ''
    // },
    // GESTIONPRECIO : {
    //     title: TXT_MENU_TABS_REPORT.gestionprecio,
    //     icon: '',
    //     color: ''
    // },
    // MARKETSENSING : {
    //     title: TXT_MENU_TABS_REPORT.marketSensing,
    //     icon: '',
    //     color: ''
    // },
    // GESTIONACTIVIDADES : {
    //     title:  TXT_MENU_TABS_REPORT.gestionactividades,
    //     icon: '',
    //     color: ''
    // },
    // FICHA_VENTA : {
    //     title: TXT_MENU_TABS_REPORT.fichaventa,
    //     icon: '',
    //     color: ''
    // },
    // FICHA_STOCK : {
    //     title: TXT_MENU_TABS_REPORT.fichastock,
    //     icon: '',
    //     color: ''
    // },
    // FICHA_SHARE : {
    //     title: TXT_MENU_TABS_REPORT.fichavisibilidad,
    //     icon: '',
    //     color: ''
    // },
    // VENTA : {
    //     title: TXT_MENU_TABS_REPORT.VENTA,
    //     icon: '',
    //     color: ''
    // },
});

export const enum MODULES_OFFLINE {
    JORNADAS_OFF_LINE,
    ASISTENCIAS_OFF_LINE,
    REPORTES_OFF_LINE,
    INCIDENCIAS_OFF_LINE,
    EXHIBICIONES_OFF_LINE,
    CHECK_LIST_OFF_LINE,
    CADUCIDADES_OFF_LINE
}

export const BUSINESSLINE = {
    PROMOTORIA: 'Promotoría',
    PROMOTORIA_LG: 'Promotoría LG',
    PROMOTORIA_LG_PE: 'Promotoría LG PERU'
}

export const MOBILE_ORIGIN = 2;

export const ASISTENCIA = "";

export enum FORMS_ICON {
    'Supercategoria' = '',
    'Categorías' = '',
    'Marcas' = 'assets/svg/theme_mark.svg',
    'Líneas de Productos' = 'assets/svg/theme_product_line.svg',
    'Productos' = 'assets/svg/theme_product.svg',
    'Sin Tema' = 'assets/svg/theme_form.svg'
}

export enum PAGE_OFFLINE {
    PAGINA_PENDIENTES,      // 0
    PAGINA_ERRONEAS         // 1
}

export enum APP_CONFIG {
    'UserReporter' = 1
}

export enum ASSISTANCE_CONFIG_CAMPAING {
   CONTROL_GEOPERMANENCIA = 1,
   ALERTA_CHECKIN = 3,
   CHECKOUT_NO_BLIGATORIO = 2
}

export enum ActionPhoto {
    camera = 1,
    gallery = 2
}
export enum FileMimeType {
    'jpeg' = 'image/jpeg',
    'jpg' = 'image/jpeg',
    'png' = 'image/png'
}