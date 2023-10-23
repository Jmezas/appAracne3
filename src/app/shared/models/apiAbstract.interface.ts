import { Observable } from 'rxjs';
import { ApiAsignacionPV } from './apiAsignation.model';
import { AsistenciaModel } from './asistencia.interface';
import { Exhibicion } from './Exhibicion.interface';
import { Incidencia } from './Incidencia.interface';
import { ApiPV } from './salePoint.interface';

export interface ApiAbstractInterface {
    getJornadasApi(userId: string, campaignId: string, businessLineId: string): Observable<any>;
    getJornadasDatesApi(userId: string, campaignId: string, dates: Array<string>, businessLineId: string): Observable<any>;
    getJornadasAsistenciasApiAdmin(campaignId: number, businessLineId: string): Observable<any>;
    // getJornadasAsistenciasApiAdmin(campaignId: string, businessLineId: string); //Single<ApiResponse<ApiJornadaPVAsistencia>>
    getJornadasAsistenciasApi(campaignId: number, userId: string, businessLineId: string); //Single<ApiResponse<ApiJornadaPVAsistencia>>
    getRecordAssistanceApi(idJornada: string, businessLineId: string); //Single<ApiResponse<ApiAsistencia>>
    // createAssistanceImg(asistencia: ApiAsistencia, businessLineId: string); //Maybe<StoreProcedureResponse[]>
    // getPVListApi(campaignId, businessLineId: string);  //Single<ApiResponse<ApiPV>>
    // getPVByUserListApi(userId: string, campaignId: string, businessLineId: string); //Single<ApiResponse<ApiPV>>
    getPVApi(idPV: string, businessLineId: string);  //Single<ApiResponse<ApiPV>>
    updatePV(pv: ApiPV, businessLineId: string); //Completable
    //getTiposJornadasApi( campaignId: string, businessLineId: string); //Single<ApiResponse<ApiTipoJornada>>
    //getTurnosJornadasApi( campaignId: string, businessLineId: string);    //Single<ApiResponse<ApiTurnoJornada>>
    getPaisesApi( businessLineId: string);    //Single<ApiResponse<ApiPais>>

    //// region Validación del reporte.
    // insertarReporteTemporal(reporte: ApiReporte);  //Completable

    // validarReporte(idCampaña: string, idJornada: string);    // Single<ApiResponse<ApiResultadoValidacion>>
    getProvinciasApi( idPais: string, businessLineId: string);  //Single<ApiResponse<ApiProvincia>>
    // getProvinciasApi( businessLineId: string); //Single<ApiResponse<ApiProvincia>>
    getPoblacionesApi( idProvincia: string, businessLineId: string); //Single<ApiResponse<ApiPoblacion>>
    // getPoblacionesApi( businessLineId: string); //Single<ApiResponse<ApiPoblacion>>
    getTabReporteApi( campaignId: number, IdRol: number, businessLineId: string); //Single<ApiResponse<ApiTabReporte>>
    getReportesApi( idJornada: string, businessLineId: string); //Single<ApiResponse<ApiReporte>>
    // getGestionPreciosApi( idJornada: string, businessLineId: string); //Single<ApiResponse<GestionPrecio>>

    // getReportsByDate( businessLineId: string,  userId: string, pvId: string, firstDateSelected: string, secondDateSelected: string);    //Single<ApiResponse<ApiReporte>>
    // getCompetenciaProductosApi(idJornada: string, IdRol: string, campaignId: string, IdPV: string, IdUsuario: string, businessLineId: string); //Single<ApiResponse<ApiCompetenciaProducto>>
    // getCamposReporteApi(campaignId: string, businessLineId: string);   //Single<ApiResponse<ApiCamposTipo>>
    // getCamposGestionPrecioApi(campaignId: string, businessLineId: string); //Single<ApiResponse<ApiCamposTipo>>
    // getCamposProductoApi(campaignId: string, businessLineId: string);  //Single<ApiResponse<ApiCamposProducto>>
    // getCamposCompetenciaProductoApi(campaignId: string, businessLineId: string);   //Single<ApiResponse<ApiCamposTipoCompetenciaProducto>>
    // createReporte(apiReporte: ApiReporte, businessLineId: string); //Maybe<StoreProcedureResponse[]>
    // // Completable updateReporte(reporte: ApiReporte, businessLineId: string);    //Observable<ResponseBody> updateRemoteReport(ApiReporte apiReporte, String businessLineId, Reporte reporte);
    // updateRemoteGestionPrecio(GestionPrecio: reporte, businessLineId: string); //Observable<ResponseBody>
    createAssistanceRemoteImg(businessLineId: string, asistencia: AsistenciaModel); //Observable<ResponseBody>
    // grabarPV(pv: PV, IdUsuario: string, businessLineId: string); //Observable<ResponseBody>
    // getVerificarJornada(IdUsuario: string, rangoFecha: string, Idpv: string, businessLineId: string);  //Observable<ResponseBody>
    // updateReporte( reporte: ApiReporte, businessLineId: string);  //Maybe<StoreProcedureResponse[]>
    // updateCompetenciaProducto( reporte: ApiCompetenciaProducto, businessLineId: string);    //Completable
    // generarReporte(idCampaña: string, idJornada: string, idUsuario: string, businessLineId: string, unidadNegocio: string);   //Completable
    // generarCompetenciaProducto(idCampaña: string, idJornada: string, idUsuario: string, businessLineId: string); //Completable
    // generarGestionPrecios(idCampaña: string, idJornada: string, idUsuario: string, businessLineId: string);  //Completable
    // insertVentaRetail( ventaRetail: ApiVentaRetail, businessLineId: string);    //Completable
    // getCuotas(idUsuario: string, idCampaña: string, idpv: string, businessLineId: string);   //Single<ApiResponse<ApiCuotas>>
    // getFamiliasApi(campaignId: string, businessLineId: string);    //Single<ApiResponse<ApiFamiliaProducto>>
    // getFamiliasCompetenciaApi(campaignId: string, businessLineId: string); //Single<ApiResponse<ApiFamiliaCompetenciaProducto>>
    getSubFamiliasApi(familyId: string, businessLineId: string);   //Single<ApiResponse<ApiSubFamiliaProducto>>
    // getSubFamiliasCompetenciaApi(familyId: string, businessLineId: string);    //Single<ApiResponse<ApiSubFamiliaCompetenciaProducto>>
    // getProductosApi(subfamilyId: string, businessLineId: string);  //Single<ApiResponse<ApiProducto>>
    getProductosCampaniaApi(campaignId: string, businessLineId: string);    //Single<ApiResponse<ApiProductoCampaña>>
    // getProductosVencimientoApi(campaignId: string, userId: string, idpv: string, businessLineId: string);    //Single<ApiResponse<ApiProductoVencimiento>>
    // getTiposIncidenciasApi(campaignId: string, businessLineId: string);    //Single<ApiResponse<ApiTipoIncidencia>>
    // getFamiliaIncidenciasApi(campaignId: string, businessLineId: string);  //Single<ApiResponse<ApiFamiliaIncidencia>>

    getSubTiposIncidenciasApi(campaignId: string, businessLineId: string);    //Single<ApiResponse<ApiSubTipoIncidencia>>
    getEstadosIncidenciasApi(campaignId: string, businessLineId: string); //Single<ApiResponse<ApiEstadoIncidencia>>
    getFamiliasExhibicionApi(campaignId: string, businessLineId: string); //Single<ApiResponse<ApiFamiliaExhibicion>>
    getSubFamiliasExhibicionApi(familyId: string, businessLineId: string);    //Single<ApiResponse<ApiSubFamiliaExhibicion>>
    getCategoriasExhibicionApi(subfamilyId: string, businessLineId: string);  //Single<ApiResponse<ApiCategoriaExhibicion>>
    getIncidenciasApi(idJornada: string, businessLineId: string); //Single<ApiResponse<ApiIncidencia>>
    getExhibitionsApi(idJornada: string, businessLineId: string); //Single<ApiResponse<ApiExhibicion>>
    // getCompetencesApi(idJornada: string, businessLineId: string); //Single<ApiResponse<ApiCompetencia>>
    // finishReport(jornadaPV: ApiJornadaPV, businessLineId: string);    //Completable
    // createJornada(jornadaPV: ApiJornadaPV, businessLineId: string);   //Maybe<StoreProcedureResponse[]>
    // createJornadaOfflineSync(jornadaPV: ApiJornadaPV, businessLineId: string);    //Observable<ResponseBody>
    createLocalIncidence(incidencia: Incidencia, businessLineId: string);   //Maybe<StoreProcedureResponse[]>
    deleteLocalIncidence(localId: number);
    createRemoteIncidence(incidencia: Incidencia, businessLineId: string); //Observable<ResponseBody>
    // createExhibition( exhibicion: ApiExhibicion, businessLineId: string);  //Maybe<StoreProcedureResponse[]>
    // createCompetence( competencia: ApiCompetencia, businessLineId: string);    //Completable
    // insertIncidence( incidencia: ApiIncidencia, businessLineId: string);   //Completable
    deleteIncidence( idIncidence: string, businessLineId: string);   //Completable

    insertExhibition( exhibicion: Exhibicion, businessLineId: string);  //Maybe<StoreProcedureResponse[]>
    // insertCompetence( competencia: ApiCompetencia, businessLineId: string);    //Completable
    // createJornadas( jornadas: List<ApiAsignacionPV>, businessLineId: string);  //Completable
    // crearMultiplesFechasJornadas( jornadas: List<ApiAsignacionPV>, businessLineId: string, IdRol: string);  //Completable
    // insertJornadaConTipo( asignacionPV: ApiAsignacionPV, businessLineId: string);  //Completable
    insertJornada( asignacionPV: ApiAsignacionPV, businessLineId: string); //Completable
    deleteExhibition( idExhibicion: string, businessLineId: string);  //Completable
    // deleteCompetence( competencia: ApiCompetencia, businessLineId: string);    //Completable
    // sendPhoto(filepath: string, campaignName: string, actionPhoto: string, businessLineId: string); //Single<Boolean>
    // uploadPhotos(campaign: string, folder: string, businessLineId: string, photosArgs);  //Single<List<Boolean>>
    // getUserPVs(userId: string, campaignId: string, businessLineId: string, IdRol: string);  //Single<List<ApiAsignacionPV>>
    getNotAsignedPVs(userId: string, campaignId: string, businessLineId: string);  //Single<List<ApiAsignacionPV>>
    // getNotAsignedPV(userId: string, campaignId: string, businessLineId: string);   //Single<ApiResponse<ApiPVNoAsigned>>
    // getNotAsignedPVs( asignacionPV: ApiAsignacionPV, businessLineId: string, IdRol: string);    //Single<List<ApiAsignacionPV>>
    getGruposIncidenciasApi(campaignId: string, businessLineId: string);  //Single<ApiResponse<ApiGrupoIncidencia>>
    getConfigReglasApi(campaignId: string, businessLineId: string);   //Single<ApiResponse<ApiConfigReglas>>
    getInformeAsistencia(userId: string, campaignId: string, businessLineId: string, fecha: string, idPv: string, idRolSelected: string); //Single<ApiResponse<ApiInformeAsistencia>>
    // insertErrorsLog(businessLineId: string, IdUsuario: string, Error: string, TipoRegistro: string, Fecha: string, IdCampaña: string, DetalleRegistro: string);    //Observable<ResponseBody>
    // createVencimiento( vencimiento: ApiVencimiento, businessLineId: string);   //Observable<ResponseBody>
    // updateVencimiento( vencimiento: ApiVencimiento, businessLineId: string);   //Observable<ResponseBody>
    // getVencimiento( vencimiento: ApiVencimiento, businessLineId: string);  //Single<ApiResponse<ApiVencimiento>>
    // getPossiblesPVs(userId: string, campaignId: string, businessLineId: string, latitud: string, Longitud: string);  //Single<ApiResponse<ApiPossiblesPV>>
    // getMarcasCompetenciaApi(idCampanna: string, businessLineId: string);  //Single<ApiResponse<ApiMarcaCompetencia>>
    // getTiposCompetenciaApi(idCampanna: string, businessLineId: string);   //Single<ApiResponse<ApiTipoCompetencia>>
    // getEstatusCompetenciaApi(idJornada: string, businessLineId: string);  //Single<ApiResponse<ApiEstatusCompetencia>>
    // createEstatusCompetencia( estatusCompetencia: ApiEstatusCompetencia, idCampanna: string, businessLineId: string);   //Completable
    // deleteEstatusCompetencia( estatusCompetencia: ApiEstatusCompetencia, businessLineId: string);  //Completable
}
