import { IItemModuleOffline } from "../models/config.interface";
import { colorAccent, colorAccent1, colorAccent2, colorAccent3, colorBreak, colorStatusOnline } from "./colors.constant"
import { SyncStatus } from "./strings.constan";

export const LIST_MENU_LATERAL = [
    { id: 1, title: 'Reporte', url: '/main/reportes' },
    { id: 2, title: 'Cobertura', url: '/main/cobertura' },
    { id: 3, title: 'Control de Cuotas', url: '/main/control-cuotas' },
    { id: 4, title: 'Notificaciones', url: '/main/notificaciones' },
    { id: 5, title: 'Checklist', url: '/main/checklist' },
    { id: 6, title: 'Gestión de jornadas', url: '/main/gestion-jornadas' },
    { id: 7, title: 'Seguimiento de Rutas', url: '/main/seguimiento-rutas' },
    { id: 8, title: 'Control Cuotas Producto', url: '/main/control-cuotas-producto' },
    { id: 9, title: 'Gestión de notificaciones', url: '/main/gestion-notificaciones' },
    { id: 10, title: 'Modificación de reporte', url: '/main/modificacion-reporte' },
    { id: 11, title: 'Cuotas SubFamilia', url: '/main/cuotas-subfamilia' },
    { id: 12, title: 'Checklist', url: '/main/checklist' },
    { id: 13, title: 'Informe de asistencia', url: '/main/informe-asistencia' },
    { id: 14, title: 'Registros Offline', url: '/main/registros-offline' },
    { id: 15, title: 'Control de Vencimientos', url: '/main/control-vencimientos' },
    { id: 16, title: 'Asistencia laboral', url: '/main/asistencia-laboral' },
    { id: 17, title: 'Asistencia laboral + chk', url: '/main/asistencia-laboral-chk' },
    { id: 18, title: 'Asistencia laboral PV', url: '/main/asistencia-laboral-pv' },
    { id: 19, title: 'Gestión Cartera', url: '/main/gestion-cartera' },
    { id: 20, title: 'TrackerGPS', url: '/main/tracker-gps' },
    { id: 21, title: 'Venta Online', url: '/main/Venta-Online' },
    { id: 22, title: 'Hoja de vida', url: '/main/hoja-vida' },
    { id: 23, title: 'Informe terreno', url: '/main/informe-terreno' },
    { id: 24, title: 'Informe PV', url: '/main/informe-pv' },
    { id: 25, title: 'Asistencia laboral PV + chk', url: '/main/asistencia-laboral-pv-chk' },
    { id: 26, title: 'Gastos CRM', url: '/main/gastos-CRM' },
    { id: 27, title: 'Batalla comercial', url: '/main/batalla-comercial' },
    { id: 28, title: 'Registro PV', url: '/main/registro-PV' },
    { id: 29, title: 'Control de inventario', url: '/main/control-inventario' },
    { id: 30, title: 'Ruta laboral + chk', url: '/main/ruta-laboral-chk' },
    { id: 31, title: 'Campaña Sala', url: '/main/campania-sala' },
    { id: 32, title: 'Mot Ejecución', url: '/main/mot-ejecución' },
    { id: 33, title: 'Cobertura laboral', url: '/main/cobertura-laboral' },

    { id: 38, module: 'Formularios', url: '/main/formulario' }
];

export const LIST_MENU_MAIN = [
    { id: 1, title: 'Inicio', url: '/main/inicio' },
    { id: 2, title: 'Rutas', url: '/main/rutas' },
    { id: 3, title: 'Calendario', url: '/main/calendario' },
    { id: 4, title: 'Asistencia', url: '/main/asistencia' },
    { id: 5, title: 'Tarea List', url: '/main/asistencia' },
    { id: 5, title: 'Tarea Formulario', url: '/main/asistencia' },
];

export enum idModuleOffline {
    jornadas,
    reportes,
    asistencia,
    incidencia,
    exhibicion,
    checklist,
    caducidades
}

export const listMenuRegistroOffline: Array<IItemModuleOffline> = [
    { id: idModuleOffline.jornadas, title: 'Jornadas', url: 'jornadas-offline/tabs-jornadas', icon: 'work', color: colorAccent2 },
    { id: idModuleOffline.reportes, title: 'Reportes', url: 'reportes-offline/tabs-reportes', icon: 'assignment', color: colorAccent1 },
    { id: idModuleOffline.asistencia, title: 'Asistencias', url: 'asistencias-offline/tabs-asistencias', icon: 'assignment_ind', color: colorAccent },
    { id: idModuleOffline.incidencia, title: 'Incidencias', url: 'incidencias-offline/tabs-incidencias', icon: 'record_voice_over', color: colorStatusOnline },
    { id: idModuleOffline.exhibicion, title: 'Visibilidad / Exhibición', url: 'exhibicion-offline/tabs-exhibicions', icon: 'store', color: colorAccent3 },
    { id: idModuleOffline.checklist, title: 'CheckList', url: 'checklist-offline/tabs-checklist', icon: 'playlist_add_check', color: colorBreak },
    // {id: '6', title: 'Caducidades', url: '', icon: 'date_range', color: colorStatusOnline},
]
