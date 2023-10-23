import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SyncStatus } from 'src/app/shared/constants/strings.constan';
import { BUSINESS_LINE } from 'src/app/shared/constants/values.constants';
import { ApiAbstractInterface } from 'src/app/shared/models/apiAbstract.interface';
import { ApiAsignacionPV } from 'src/app/shared/models/apiAsignation.model';
import { AsistenciaModel } from 'src/app/shared/models/asistencia.interface';
import { Exhibicion, ExhibitionGet } from 'src/app/shared/models/Exhibicion.interface';
import { ApiIncidencia, Incidencia } from 'src/app/shared/models/Incidencia.interface';
import { ApiPV } from 'src/app/shared/models/salePoint.interface';
import { environment } from 'src/environments/environment';
import { AsistenciaServiceAPI } from '../asistencia.api.service';
import { ExhibitionApiService } from '../exhibition.api.service';
import { ManagePointSaleService } from '../gestionPuntoVenta.service';
import { IncidenciaApiService } from '../incidencia.api.service';
import { JornadasService } from '../jornadas.service';
import { ProductApiService } from '../product.api.service';
import { ReportServiceAPI } from '../report.api.service';
import { SalePointsService } from '../salePoints.service';
import { ApiLgService } from './apiLg.service';
import { ApiPromotoriaService } from './apiPromotoria.service';
import { ApiPromotoriaPEService } from './apiPromotoriaPE.service';

@Injectable({
  providedIn: 'root',
})
export default class ApiService implements ApiAbstractInterface{
  BUSINESS_LINE_NAME: string;

  constructor(
    private apiLG: ApiLgService,
    private apiPromotoria: ApiPromotoriaService,
    private apiPromotoriaPE: ApiPromotoriaPEService,
    private jornadaService: JornadasService,
    private assistanceService: AsistenciaServiceAPI,
    private reportServiceAPI: ReportServiceAPI,
    private managePointSaleService: ManagePointSaleService,
    private exhibitionService: ExhibitionApiService,
    private incidenciaService: IncidenciaApiService,
    private productApiService: ProductApiService
  ) {}

  getApiInterface(businessLineId: string) {
        switch (businessLineId) {
            case BUSINESS_LINE.BUSSINESS_LINE_PROMOTORIA:
                return this.apiPromotoria;
            case BUSINESS_LINE.BUSSINESS_LINE_PROMOTORIA_LG:
                return this.apiLG;
            case BUSINESS_LINE.BUSSINESS_LINE_PROMOTORIA_LG_PE:
                return this.apiPromotoriaPE;
            default: throw 'El parametro linea de negocio es incorrecto: ' + businessLineId;
        }
  }

  getBusinessLine( businessLineId: string) {
    console.log('BUSSINESS ID : ', businessLineId);

    switch( businessLineId ){
      case BUSINESS_LINE.BUSSINESS_LINE_PROMOTORIA: return environment.DB.SQL_NAME.PROMOTORIA;
      case BUSINESS_LINE.BUSSINESS_LINE_PROMOTORIA_LG: return  environment.DB.SQL_NAME.PROMOTORIA_LG;
      case BUSINESS_LINE.BUSSINESS_LINE_PROMOTORIA_LG_PE: return  environment.DB.SQL_NAME.PROMOTORIA_LG_PE;
    }
  }

  isBusinessPromotoria = (businessLineId: string) => businessLineId == BUSINESS_LINE.BUSSINESS_LINE_PROMOTORIA;
  isBusinessPromotoriaLG = (businessLineId: string) => businessLineId == BUSINESS_LINE.BUSSINESS_LINE_PROMOTORIA_LG;
  isBusinessPromotoriaPE = (businessLineId: string) => businessLineId == BUSINESS_LINE.BUSSINESS_LINE_PROMOTORIA_LG_PE;

  /**Implementacion de todas las funciones reutilizables de PROMOTORIAS */

  getInformeAsistencia(userId: string, campaignId: string, businessLineId: string, fecha: string, idPv: string, idRolSelected: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.assistanceService.getInformeAsistencia(userId, idPv, campaignId, fecha, idRolSelected, businessLineName);
  }

  getJornadasApi(userId: string, campaignId: string, businessLineId: string): Observable<any> {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.jornadaService.getJornadasApi(userId, campaignId , businessLineName);
  }

  getJornadasDatesApi(userId: string, campaignId: string, dates: string[], businessLineId: string): Observable<any> {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.jornadaService.getJornadasDatesApi(userId, campaignId, dates.join(','), businessLineName);
  }


  getJornadasAsistenciasApi(campaignId: number, userId: string, businessLineId: string): Observable<any> {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.jornadaService.getJornadasAsistenciasApi(`${campaignId}`, userId, businessLineName);
  }

  getJornadasAsistenciasApiAdmin(campaignId: number, businessLineId: string): Observable<any> {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.jornadaService.getJornadasAsistenciasApiAdmin(`${campaignId}`, businessLineName);
  }

  getNotAsignedPVs(userId: string, campaignId: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.jornadaService.getNotAsignedPVs(userId, campaignId , businessLineName);
  }

  //(REPORTE) En la vista modal pv no asignados
  insertJornada(asignacionPV: ApiAsignacionPV, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.jornadaService.insertJornada(asignacionPV, businessLineName);
  }

  // GET ASISTENCIAS EN EL MODULO REPORTE
  getRecordAssistanceApi(idJornada: string, businessLineId: string): Observable<any> {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.assistanceService.getRecordAssistanceApi(idJornada, businessLineName);
  }

  // REGISTRAR ASISTENCIAS
  createAssistanceRemoteImg(businessLineId: string, asistencia: AsistenciaModel) {
    const businessLineName = this.getBusinessLine(businessLineId);
    const apiSelect: ApiLgService|ApiPromotoriaPEService|ApiPromotoriaService = this.getApiInterface(businessLineId);
    return apiSelect.createAssistanceRemoteImg(asistencia, businessLineName, this.isBusinessPromotoriaPE(businessLineId));
  }

  // LISTA DE MODULOS INTERNOS DE REPORTE
  getTabReporteApi(campaignId: number, idRol: number, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.reportServiceAPI.getTabsUseCaseParameters(campaignId, idRol, businessLineName);
  }

  //OBTENER INFORMACION DEL PV EN REPORTES/PUNTO DE VENTA
  getPVApi(idPV: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.managePointSaleService.getPVApi(idPV, businessLineName);
  }

  getPaisesApi(businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.managePointSaleService.getCountries(businessLineName);
  }
  getProvinciasApi(idPais: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.managePointSaleService.getProvinces(idPais, businessLineName);
  }
  getPoblacionesApi(idProvincia: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.managePointSaleService.getPopulation(idProvincia, businessLineName);
  }

  updatePV( pv: ApiPV, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.managePointSaleService.updatePV( pv, businessLineName)
  }

  /** Modulo de exhibiciones */
  getFamiliasExhibicionApi(campaignId: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.exhibitionService.getFamiliasExhibicionApi(campaignId, businessLineName);
  }
  getSubFamiliasExhibicionApi(familyId: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.exhibitionService.getSubFamiliasExhibicionApi(familyId, businessLineName);
  }
  getCategoriasExhibicionApi(subfamilyId: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.exhibitionService.getCategoriasExhibicionApi(subfamilyId, businessLineName);
  }

  getExhibitionsApi(idJornada: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.exhibitionService.getExhibitionsApi(idJornada, businessLineName).pipe(
      map((response: Array<ExhibitionGet>) => response.map((item) : Exhibicion => ({
        ...item,
        FeCreacion: item['Fecha Creacion'],
        Campana: item.Campaña,
        Status: SyncStatus.SYNC
      })))
    );
  }

  insertExhibition(exhibicion: Exhibicion, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    const apiSelect: ApiLgService|ApiPromotoriaPEService|ApiPromotoriaService = this.getApiInterface(businessLineId);
    return apiSelect.insertExhibition(exhibicion, businessLineName);
  }

  deleteExhibition(exhibicionId: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.exhibitionService.deleteExhibition(exhibicionId, businessLineName);
  }

  deleteLocalExhibition(exhibicionLocalId: number) {
    return this.exhibitionService.deleteLocalExhibition(exhibicionLocalId);
  }

  /** Modulo REPORTES de ventas */
  getReportesApi(idJornada: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    const apiSelect: ApiLgService|ApiPromotoriaPEService|ApiPromotoriaService = this.getApiInterface(businessLineId);
    return apiSelect.getReportesApi(idJornada, businessLineName);
  }

  generarReporte(idCampania: string, idJornada: string, idUsuario: string, businessLineId: string, unidadNegocio: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    const apiSelect: ApiLgService|ApiPromotoriaPEService|ApiPromotoriaService = this.getApiInterface(businessLineId);
    return apiSelect.generarReporte(idCampania, idJornada, idUsuario, businessLineName, unidadNegocio);
  }

  getFamiliasApi(idCampania: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    const apiSelect: ApiLgService|ApiPromotoriaPEService|ApiPromotoriaService = this.getApiInterface(businessLineId);
    return apiSelect.getFamiliasApi(idCampania, businessLineName);
  }

  getCamposProductoApi(campaignId: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.reportServiceAPI.getCamposProductoApi(campaignId, businessLineName);
  }

  getSubFamiliasApi(familyId: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.reportServiceAPI.getSubFamiliasApi(familyId, businessLineName);
  }


  /** Modulo INCIDENCIAS */
  getTiposIncidenciasApi(campaingId: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.incidenciaService.getTiposIncidenciasApi(campaingId, businessLineName);
  }

  getConfigReglasApi(campaingId: string, businessLineId: string){
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.incidenciaService.getConfigReglasApi(campaingId, businessLineName, this.isBusinessPromotoriaLG(businessLineId));
  }

  getCorreoGrupo(jornadaId: string) {
    return this.incidenciaService.getCorreoGrupo(jornadaId);
  }

  getEstadosIncidenciasApi(campaingId: string, businessLineId: string){
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.incidenciaService.getEstadosIncidenciasApi(campaingId, businessLineName);
  }

  getGruposIncidenciasApi(campaingId: string, businessLineId: string){
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.incidenciaService.getGruposIncidenciasApi(campaingId, businessLineName, this.isBusinessPromotoriaLG(businessLineId));
  }

  getSubTiposIncidenciasApi(campaingId: string, businessLineId: string){
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.incidenciaService.getSubTiposIncidenciasApi(campaingId, businessLineName);
  }

  getIncidenciasApi(idJornada: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.incidenciaService.getIncidenciasApi(idJornada, businessLineName).pipe(
      map((response: Array<ApiIncidencia>) => {
        return response.map((item: ApiIncidencia): Incidencia => ({
          CorreoCopia: item['Correo Copia'], 
          CorreoResponsable: item['Correo Responsable'],
          FeCreacion: item['Fecha Creacion'],
          GrupoIncidencia: item['Grupo Incidencia'],
          IdCampania: item.IdCampaña,
          NombreCampania: item.Campaña,
          ...item
        }))
      })
    );
  }
  
  deleteIncidence(idIncidence: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.incidenciaService.deleteIncidence(idIncidence, businessLineName);
  }

  getProductosCampaniaApi(campaignId: string, businessLineId: string) {
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.productApiService.getProductosCampaniaApi(campaignId, businessLineName);
  }

  
  createRemoteIncidence(incidencia: Incidencia, businessLineId: string) {
    // Guardar imagenes 
    // Proceder a registrar la incidencia
    const businessLineName = this.getBusinessLine(businessLineId);
    return this.incidenciaService.insertRemoteIncidence(incidencia, businessLineName, this.isBusinessPromotoria(businessLineId));
  }

  createLocalIncidence(incidencia: Incidencia, businessLineId: string) {
    return this.incidenciaService.insertLocalIncidence(incidencia, businessLineId);
  }
  
  deleteLocalIncidence(idLocal: number) {
    return this.incidenciaService.deleteLocalIncidencia(idLocal);
  }

  /*********************************************************** */
}
