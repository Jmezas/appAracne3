import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { IResponseItemSalePoint, IResponseNearbySalesPointLocation } from 'src/app/shared/models/salePoint.interface';
import { reduceSalePointResponseToSelectData } from 'src/app/shared/utils/array.utils';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { IItemResponseSalesQuota } from '../../shared/models/sales-quota.interface';
import { BUSINESSLINE } from '../../shared/constants/values.constants';
import { IRequestAracne2_PA } from 'src/app/shared/models/http.interface';
import { TrackerPVModel } from 'src/app/shared/models/tracker.model';

@Injectable({
  providedIn: 'root'
})
export class SalePointsService {

  constructor(
    private httpService: HttpService
  ) { }


  getSalesPoints(campaingId: number): Observable<any> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
                      .set('query',`SELECT distinct IDPV,'' as IdUsuario,IdCampaña,'' as Nombre_Completo, NombreCentro, Direccion, '' as IdAux_PV_Usuario 
                                    FROM ${environment.DB.TABLES.VIEW_PVs_ASSIGNED_TO_USERS} 
                                    WHERE IdCampaña = '${campaingId}'`)
      .set('sqlName', environment.DB.SQL_NAME.PROMOTORIA_LG)

    return this.httpService.getWithParams(params).pipe(
      map((result: Array<IResponseItemSalePoint>) => reduceSalePointResponseToSelectData(result))
    );
  }

  getSalesPointsForReports(campaingId: number, userId: number): Observable<any> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
                      .set('query',`SELECT * 
                                    FROM ${environment.DB.TABLES.VIEW_PVs_JORNADAS} WITH(NOLOCK)  
                                    WHERE AsistenciaObligatoria = 1 AND 
                                          IdUsuario = ${userId} AND 
                                          IdCampaña = ${campaingId} AND 
                                          FechaJornada = convert(date,SWITCHOFFSET(SYSDATETIMEOFFSET(),(SELECT ZonaHoraria FROM ARACNE2.DBO.M_Campañas WHERE IdCampaña = ${campaingId}))) ORDER BY Punto_Venta ASC`)
      .set('sqlName', environment.DB.SQL_NAME.PROMOTORIA_LG)

    return this.httpService.getWithParams (params).pipe();
  }

  /** Obtener Lista de PV para el modulo Covertura */
  getSalePointForCoverage(campaingId: number,) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
      .set('query', `SELECT * FROM View_Cobertura WITH(NOLOCK)  WHERE FechaJornada = convert(date,SWITCHOFFSET(SYSDATETIMEOFFSET(),(SELECT ZonaHoraria FROM ARACNE2.DBO.M_Campañas WHERE IdCampaña = ${campaingId}))) AND (TipoAsistencia IS NULL OR TipoAsistencia = 'INICIO') AND  IdCampaña = ${campaingId} ORDER BY Punto_Venta ASC`)
      .set('sqlName', environment.DB.SQL_NAME.PROMOTORIA_LG)
    return this.httpService.getWithParams(params).pipe();
  }

  /** Obtener la lista de PV para el modulo INFORME DE ASISTENCIA */
  getSalePointsForAssistance(userId: number, campaingId: number) {
    let request = {
      "formatValues": "int,int",
      "procedureName": environment.DB.PROCEDURES.GET_PVS_BY_USERS,
      "values": `${userId},${campaingId}`,
      "parameters": "IdUsuario,IdCampaña",
      "sqlName": environment.DB.SQL_NAME.PROMOTORIA_LG
    }

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request).pipe()
  }

  getSalesQuotaTargetControl(userId: string, campaignId: string, salespointId: string): Observable<Array<IItemResponseSalesQuota>> {
    const request = {
      "formatValues": "int,int,int",
      "procedureName": environment.DB.PROCEDURES.GET_QUOTA_CONTROL,
      "values": `${userId},${campaignId},${salespointId}`,
      "parameters": "IdUsuario,IdCampaña,Idpv",
      "sqlName": (campaignId == '177' ? environment.DB.SQL_NAME.PROMOTORIA_LG : environment.DB.SQL_NAME.PROMOTORIA)
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request).pipe(map((response:
      Array<IItemResponseSalesQuota>) => response));
  }

  getNearbySalesPointForLocation(userId: number, campaignId: number, bussinessLineId: number, latitude: string, longitude: string): Observable<Array<IResponseNearbySalesPointLocation>> {
    //Validar la Linea de Negocio para setear el sqlName
    const request = {
      "formatValues": "varchar,varchar,varchar,varchar",
      "procedureName": environment.DB.PROCEDURES.GET_NEARBY_SALESPOINT_LOCATION,
      "values": `${userId},${campaignId},${latitude},${longitude}`,
      "parameters": "IdUsuario,IdCampaña,Latitud,Longitud",
      "sqlName": (bussinessLineId == 10 ? environment.DB.SQL_NAME.PROMOTORIA_LG : (bussinessLineId == 13 ? environment.DB.SQL_NAME.PROMOTORIA_LG_PE : environment.DB.SQL_NAME.PROMOTORIA))
    }

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request).pipe(map((response:
      Array<IResponseNearbySalesPointLocation>) => response));
  }

  getSalespointListByCampaignId(campaignId: number, businessLineName: string): Observable<Array<IResponseItemSalePoint>> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
      .set('query', `SELECT IDPV, IdCampaña, NombreCentro, Direccion FROM View_PVS WHERE IdCampaña = ${campaignId} ORDER BY [Punto de Venta] ASC`)
      .set('sqlName', (businessLineName == BUSINESSLINE.PROMOTORIA_LG ? environment.DB.SQL_NAME.PROMOTORIA_LG: (businessLineName == BUSINESSLINE.PROMOTORIA_LG_PE ? environment.DB.SQL_NAME.PROMOTORIA_LG_PE : environment.DB.SQL_NAME.PROMOTORIA)))

    return this.httpService.getWithParams(params).pipe(
      map((response: Array<IResponseItemSalePoint>) => response)
    );
  }

  /** Buscar PUNTOS DE VENTA -> tracker GPS */
  getPVTracker (userId: number, campaingId: number, latitude: string, longitude: string ) {
    const request = {
      "formatValues": "int,int,varchar,varchar",
      "procedureName": environment.DB.PROCEDURES.SEARCH_PV_TRACKER,
      "values": `${userId},${campaingId},${latitude},${longitude}`,
      "parameters": "idUsuario,idCampania,latitud,longitud",
      "sqlName": environment.DB.SQL_NAME.PROMOTORIA
    }
  }


  /** Register PV tracker */
  insertPVTracker(pv: TrackerPVModel) {
    const request:IRequestAracne2_PA = {
      "formatValues": "varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar",
      "procedureName": environment.DB.PROCEDURES.REGISTER_PV_TRACKER,
      "values": `${pv.Latitude},
                 ${pv.Longitude},
                 ${pv.RazonSocial},
                 ${pv.Nit},
                 ${pv.NProblacion},
                 ${pv.SectorEco},
                 ${pv.Direccion},
                 ${pv.Representante},
                 ${pv.Contacto},
                 ${pv.TelefContacto},
                 ${pv.CorreoContacto},
                 ${pv.CargoContacto},
                 ${pv.IdCampani},
                 ${pv.IdUsuario}`,
      "parameters": "Latitude,Longitude,RazonSocial,Nit,NProblacion,SectorEco,Direccion,Representante,Contacto,TelefContacto,CorreoContacto,CargoContacto,IdCampania,IdUsuario",
      "sqlName": environment.DB.SQL_NAME.PROMOTORIA
    }
  }
}
