// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  baseUriAracne3: 'https://aracnereleaseapi.salesland.net',
  baseUriAracne2: 'https://aracnewsr.salesland.net',
  baseUriChecklistImage: 'https://aracne.salesland.net/Checklist/Imagenes/',
  production: false,
  DB: {
    TABLES: {
      APP_VERSION: 'Sys_Mobile_Version',
      TM_ROL: 'M_Rol',
      TM_CAMPAIGNS: 'M_Campañas',
      TM_TIPO_INCIDENCIA: 'M_TipoIncidencia',
      AUX_CAMPAIGN_USERS: 'Aux_Usuarios_Campañas',
      AUX_MENU_MODULES: 'Aux_Menu_Lateral_AppMob',
      VIEW_TABS_REPORT_ROL: 'View_TabReporteCampañasRol',
      VIEW_TABS_REPORT: 'View_TabReporteCampañas',
      VIEW_CAMPAIGN_UNIDADES: 'View_Campañas_Unidades',
      VIEW_CAMPAIGN_ROLES: 'View_Campañas_Unidades_Usuarios',
      VIEW_PVs_JORNADAS: 'View_PVs_Jornada',
      VIEW_PVs: 'View_PVS',
      VIEW_USERS_CAMPAIGNS: 'View_Campañas_Usuarios',
      VIEW_PVs_ASSIGNED_TO_USERS: 'View_Aux_Asignaciones_PVs_Usuarios',
      VIEW_COVERAGE: 'View_Cobertura',
      VIEW_EXHIBITIONS: 'View_Fotos_Jornadas',
      VIEW_REPORTE_PV: 'View_Reporte_PV',
      VIEW_REPORTE_PV_UNIDADES: 'View_Reporte_PV_Unidades',
      VIEW_CAMPOS_REPORTE_PRODUCTOS: 'View_Campos_Reporte_Productos',
      VIEW_INCIDENCES_PV: 'View_IncidenciasPV',
      VIEW_Products_BY_CAMPAIGN: 'View_ProductosPorCampaña',
      TRANS_JORNADAS: 'Trans_Jornadas',
      TRANS_ASISTENCIAS: 'Trans_Asistencias',
      TRANS_SALESPOINTS: 'Trans_PVs',
      TRANS_EXHIBITIONS: 'Trans_Fotos',
      TRANS_INCIDENCIAS: 'Trans_Incidencias',
      LOG_AUDITORIA: 'Log_Auditoria_Accesos',
      LOG_AUDITORIA_CAMPAIGNS: 'Log_Auditoria_Accesos_Campaña',
      TM_POBLACIONES: 'M_Poblaciones',
      TM_PROVINCES: 'M_Provincias',
      TM_COUNTRIES: 'M_Paises',
      TM_TipoFamiliaFoto: 'M_TipoFamiliaFoto',
      TM_TipoSubFamiliaFotoo: 'M_TipoSubFamiliaFoto',
      TM_TipoCategoriaFoto: 'M_TipoCategoriaFoto',
      TM_SubFamiliaProducto: 'M_SubFamiliaProducto',
      TM_CONFIG_REGLAS_CAMPAING: 'M_Config_Reglas_Campaña',
      TM_INCIDENCE_STATUS: 'M_EstadoIncidencia',
      TM_INCIDENCE_GROUPS: 'M_Grupos_Incidencias',
    },
    SQL_NAME: {
      SQLDATA_ARACNE2: 'SQLDATA_ARACNE2',
      PROMOTORIA_LG: 'SQLDATA_LN_PROMOTORIA_LG',
      PROMOTORIA: 'SQLDATA_LN_PROMOTORIA',
      CHECKLIST_ARACNE2: 'SQLDATA_CHECKLIST_ARACNE2',
      PROMOTORIA_LG_PE: 'SQLDATSQLDATA_LN_PROMOTORIA_LG_PE'
    },
    PROCEDURES: {
      VERIFY_WORKDAY: 'PA_VerificarJornada_AppMob',
      GET_CAMPAIGNS: 'PA_GetCampanias_ApMob',
      GET_ASSITENCES_REPORT: 'PA_ObtenerInformeAsistencia',
      REGISTER_ASSISTANCE: 'PA_RegistrarAsistencia_AppMob',
      GET_ROLES: 'PA_GetRolesFiltradoInforme',
      GET_PVS_BY_USERS: 'PA_ObtenerPDVsPorUsuario',
      GET_QUOTA_CONTROL: 'PA_GetControlCuotas_Temp_Op',
      LIST_NOTIFICATIONS: 'PA_ListaNotificaciones',
      LIST_CAMPAIGN_ROLES: 'PA_Obtener_RolPorCampaña_ApMob',
      REGISTER_TOKENFCM: 'PA_Registar_TokenFCM_ApMob',
      INSERT_NOTIFICATION: 'PA_Insertar_Notificaciones_ApMob',
      POST_LABOR_ASSISTANCE: 'PA_Registrar_Asistencia_Laboral',
      GET_FIXED_CHECKLISTS: 'PA_ListarEncuestasFijas_ApMob',
      GET_QUESTION_FIXED_CHECKLISTS: 'PA_Preguntas_Legalizaciones',
      POST_SAVE_ANSWER_FIXED_CHECKLIST: 'PA_GrabarRespuestaPregunta',
      GET_NEARBY_SALESPOINT_LOCATION: 'PA_ObtenerPossiblesPV',
      POST_LABOR_PV_ASSISTANCE: 'PA_Registrar_Asistencia_Laboral_PV',
      GET_CHECKLIST_HISTORIAL: 'PA_Historial_Checklist',
      GET_QUESTION_ANSWER_CHECKLIST: 'PA_ObtenerEncuestasConRespuesta',
      GET_QUESTIONS_ANSWER_CHECKLIST_IDS: 'PA_ObtenerEncuestasConRespuestaXIds',
      SEARCH_PV_TRACKER: 'PA_BuscarPV_TrackerGPS_AppMob',
      REGISTER_PV_TRACKER: 'PA_RegistrarPV_TrackerGPS_AppMob',
      GET_PRODUCT_FAMILY: 'PA_GetFamiliaProducto',
      GET_PRODUCT_FAMILY_2: 'M_FamiliaProducto',
      REGISTER_EXHIBITION: 'PA_RegistrarExhibicion_AppMob',
      INIT_REGISTER_REPORTS: 'PA_IniciaRegistrosTransReporte',
      REGISTER_INCIDENCIA: 'PA_RegistrarIncidencia_AppMob',
      GET_EMAILS_BY_GROUPS: 'PA_ObtenerCorreosPorGrupo_AppMob',
      GET_INCIDENCE_SUBTYPES: 'PA_GetSubTipoIncidencia_ApMob'
    },
    MASTER_DATA_BODY: {
      SALESPOINT_CHANNEL: {
        'tableName': 'M_Canal_Pdv',
        'identifier': 'idCanalPdv',
        'descriptor': 'canalPdv',
        'where': 'activo = 1',
        'orderBy': 'idCanalPdv'
      },
      SALESPOINT_TYPE: {
        'tableName': 'M_Tipo_Pdv',
        'identifier': 'idTipoPdv',
        'descriptor': 'tipoPdv',
        'where': 'activo = 1',
        'orderBy': 'idTipoPdv'
      },
      COMMERCIALPOINT: {
        'tableName': 'M_Centro_Comercial',
        'identifier': 'idCentroComercial',
        'descriptor': 'centroComercial',
        'where': 'activo = 1',
        'orderBy': 'idCentroComercial'
      }
    }
  },
  APPVERSIONWEB: '1.2.3',
  APPVERSION_ANDROID:'2.0.1',
  APPVERSION_IOS:'2.0.1',
  APIKEY_MAPS: 'AIzaSyB1E0JGxyfDSs5Q8Za1ulawX4gLzrYR_b8'  //Llave personal de prueba
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
