import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ApiAsignacionPV } from 'src/app/shared/models/apiAsignation.model';
import { IRequestAracne2 } from 'src/app/shared/models/http.interface';
import { getDateServer, getDatetimeServer } from 'src/app/shared/utils/dates.utils';
import { environment } from 'src/environments/environment';
import { TYPE_REQUEST } from '../../shared/constants/values.constants';
import { IItemWorkdayType, IItemWorkdayTurn, IItemResponseVerifyWorkday, Rutas, JornadaPVModelDB, PdvRutaLibre, PdvRutaInsertRequest, PdvRutaInsertResponse } from '../../shared/models/jornada.interface';
import { JornadaDao } from '../DAO/Jornada.dao';
import { DatabaseAppService } from '../database/database-app.service';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class JornadasService {

  constructor(
    private httpService: HttpService,
    private jornadaDao: JornadaDao,
    private databaseAppService: DatabaseAppService
  ) { }

  registerJornadaProcedure(userId, dateRange, salePointId): Observable<Array<IItemResponseVerifyWorkday>> {
    let request = {
      "formatValues": "varchar,varchar,varchar",
      "procedureName": environment.DB.PROCEDURES.VERIFY_WORKDAY,
      "values": `${userId},${dateRange},${salePointId}`,
      "parameters": "IdUsuario,rangoFecha,Idpv",
      "sqlName": environment.DB.SQL_NAME.PROMOTORIA_LG
    }
    console.log("REQUEST : ", request);
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);

    return this.httpService.post(request).pipe();
  }

  /**
   * @description: ENDPOINT to Register one WORKDAY FROM QUERY
   * @param campaingid 
   * @param dateString 
   * @param UsCreacion 
   * @param formData 
   * @param IDPV 
   * @annotation : 
   */
  registerJornadasQuery(campaingid: number, dateString: string, UsCreacion: string, formData, IDPV: string) {
    console.log("FormData : ", formData);
    const {
      usuario: IdUsuario,
      tipoJornada: IdTipoJornada,
      turno: IdTurno,
      horaFin,
      horaInicio
    } = formData;

    const Fecha_Hora_Inicio = `${dateString} ${horaInicio}`
    const Fecha_Hora_Fin = `${dateString} ${horaFin}`

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_POST);
    const body = {
      query: `INSERT INTO Trans_Jornadas 
              (IDPV, IdUsuario, IdEstadoReporte, UsCreacion,  FechaJornada, FeCreacion, IdTipoJornada, IdTurno, Fecha_Hora_Inicio, Fecha_Hora_Fin) 
              VALUES 
              ('${IDPV}', '${IdUsuario}', '2', '${UsCreacion}', '${dateString}', convert(datetime,SWITCHOFFSET(SYSDATETIMEOFFSET(),(SELECT ZonaHoraria FROM ARACNE2.DBO.M_Campañas WHERE IdCampaña = ${campaingid}))), '${IdTipoJornada}', '${IdTurno}', '${Fecha_Hora_Inicio}', '${Fecha_Hora_Fin}')`,
      sqlName: environment.DB.SQL_NAME.PROMOTORIA_LG
    };

    return this.httpService.post(body).pipe(
      // map((result: Array<IItemWorkdayType>) =>
      //   result.map((item: IItemWorkdayType) => ({
      //     id: item.IdTipoJornada,
      //     value: item.TipoJornada,
      //   }))
      // )
    )
  }

  getTipoJornada(idCampaña: number): Observable<any> {
    console.log("ID CAMPAÑA : ", idCampaña);

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
      .set('query', `SELECT * FROM M_TipoJornada WHERE Activo = 1 AND IdCampaña = '${idCampaña}'`)
      .set('sqlName', environment.DB.SQL_NAME.PROMOTORIA_LG)
    // return this.httpService.getWithParams(params)
    return this.httpService.getWithParams(params).pipe(
      map((result: Array<IItemWorkdayType>) =>
        result.map((item: IItemWorkdayType) => ({
          id: item.IdTipoJornada,
          value: item.TipoJornada,
        }))
      )
    )
  }

  getTurnoJornada(idCampaña: number): Observable<any> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
      .set('query', `SELECT * FROM M_Turno WHERE Activo = 1 AND IdCampaña = '${idCampaña}'`)
      .set('sqlName', environment.DB.SQL_NAME.PROMOTORIA_LG)
    // return this.httpService.getWithParams(params)
    return this.httpService.getWithParams(params).pipe(
      map((result: Array<IItemWorkdayTurn>) =>
        result.map((item: IItemWorkdayTurn) => ({
          id: item.IdTurno,
          value: item.Turno,
        }))
      ));
  }

  getJornadasByUser(userId: string, campaingId: number, startDate: string, endDate: string): Observable<any> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    let query2 = `SELECT * 
                  FROM ${environment.DB.TABLES.VIEW_PVs_JORNADAS} WITH(NOLOCK) 
                  WHERE IdUsuario = '${userId}' AND 
                        IdCampaña = '${campaingId}' AND 
                        FechaJornada BETWEEN '${startDate}' AND '${endDate}'  ORDER BY FechaJornada ASC`;

    const params = new HttpParams()
      .set('query', query2)
      .set('sqlName', environment.DB.SQL_NAME.PROMOTORIA_LG)

    return this.httpService.getWithParams(params)

  }

  /*************************************************************** */
  /** Funcion creado para listar los puntos de venta disponibles */
  public getJornadasApi(userId: string, campaignId: string, apiPromotoria: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const request: IRequestAracne2 = {
      query: `SELECT * 
      FROM ${environment.DB.TABLES.VIEW_PVs_JORNADAS} WITH(NOLOCK) 
      WHERE AsistenciaObligatoria = 1 
          AND IdUsuario = '${userId}' 
          AND IdCampaña = '${campaignId}' 
          AND FechaJornada = ${getDateServer(campaignId)}
      ORDER BY Punto_Venta ASC`,
      sqlName: apiPromotoria
    }
    return this.httpService.post(request);
  } 

  public getJornadasDatesApi(userId: string, campaignId: string, dates: string, apiPromotoria: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const query = `SELECT * 
                    FROM ${environment.DB.TABLES.VIEW_PVs_JORNADAS} WITH(NOLOCK) 
                    WHERE AsistenciaObligatoria = 1 
                        AND IdUsuario = '${userId}' 
                        AND IdCampaña = '${campaignId}' 
                        AND FechaJornada IN (${dates})
                    ORDER BY FechaJornada ASC`;

    const params = new HttpParams()
      .set('query', query)
      .set('sqlName', apiPromotoria);

    return this.httpService.getWithParams(params);
  }


  /** Funcion para obtener los PV no asignados al usuario despues de obtener los pv disponibles */
  public getNotAsignedPVs(activeUserId: string, activeCampaignId: string, apiPromotoria: string ) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
      .set('query', `SELECT * 
                      FROM ${environment.DB.TABLES.VIEW_PVs_ASSIGNED_TO_USERS} WITH(NOLOCK)  
                      WHERE IdUsuario = '${activeUserId}' AND 
                            IdCampaña = '${activeCampaignId}' AND 
                            IDPV NOT IN 
                              ( SELECT IDPV FROM ${environment.DB.TABLES.TRANS_JORNADAS} 
                                WHERE IdUsuario = '${activeUserId}' AND 
                                      FechaJornada = convert(date,SWITCHOFFSET(SYSDATETIMEOFFSET(),(SELECT ZonaHoraria FROM ARACNE2.DBO.M_Campañas WHERE IdCampaña = ${activeCampaignId})))) 
                      ORDER BY NombreCentro ASC`)
      .set('sqlName', apiPromotoria);

    return this.httpService.getWithParams(params).pipe();
  }

  /** Funcion para asignar pv seleccionados en el modal no asignados */
  public insertJornada(asignacionPV: ApiAsignacionPV, apiPromotoria: string) : Observable<any> {
    const paylaod: IRequestAracne2 = {
      query: `INSERT INTO ${environment.DB.TABLES.TRANS_JORNADAS} (IDPV, IdUsuario, IdEstadoReporte, UsCreacion,  FechaJornada, FeCreacion, IdTipoJornada, IdTurno) 
              VALUES ('${asignacionPV.IDPV}', 
                      '${asignacionPV.IdUsuario}', 
                      '${asignacionPV.IdEstadoReporte}', 
                      '${asignacionPV.UsCreacion}', 
                      ${getDateServer(asignacionPV.IdCampaña)},
                      ${getDatetimeServer(asignacionPV.IdCampaña)},
                      (SELECT IdTipoJornada FROM M_TipoJornada WHERE TipoJornada = 'Jornada Completa' AND IdCampaña = '${asignacionPV.IdCampaña}' ), 
                      (SELECT IdTurno FROM M_Turno WHERE Turno = 'No Procede' AND IdCampaña = ${asignacionPV.IdCampaña} ))`,
      sqlName: apiPromotoria
    }
    console.log("PAYLOAD INSERT : ", paylaod);
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_POST);
    return this.httpService.post(paylaod);
  }

  /** Importacion de jornada para el flujo OFFLINE */
  // public importData(userId: string, campaignId: string, businessLineId: string): Observable<any>  {
  //   return importJornadas(userId, campaignId, businessLineId)
  //           .flatMapIterable(list -> list);
  // }  

  // Aracne 3 
  getRutasByUsuario(idUsuario: number, fechaInicio: string, fechaFin: string): Observable<Array<Rutas>> {
    this.httpService.setUriAracne3(`apiPdv/rutas/getRutasByUsuarioDateRange/${idUsuario}/${fechaInicio}/${fechaFin}`);

    return this.httpService.getWithParams(null).pipe(
      map((response: Array<Rutas>) => response)
    );
  }
  
  /** Obtener Lista de PV para el modulo Covertura */
  getJornadasAsistenciasApi(campaingId: string, userId: string, apiPromotoria: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
      .set('query', `SELECT * 
                      FROM ${environment.DB.TABLES.VIEW_COVERAGE} WITH(NOLOCK)  
                      WHERE FechaJornada = ${getDateServer(campaingId)} AND 
                            (TipoAsistencia IS NULL OR TipoAsistencia = 'INICIO') AND  
                            IdCampaña = '${campaingId}' AND
                            (IdUsuario = '${userId}' OR IdUsuario IN (
                              SELECT IdUsuario FROM [ARACNE2].[dbo].[Aux_Usuarios_Campañas] WHERE ID_Jefe_Equipo = '${userId}'
                            ))
                      ORDER BY Punto_Venta ASC`)
      .set('sqlName', apiPromotoria)
    return this.httpService.getWithParams(params).pipe();
  }

  
  public getJornadasAsistenciasApiAdmin(campaingId: string, apiPromotoria: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
      .set('query', `SELECT * 
                      FROM ${environment.DB.TABLES.VIEW_COVERAGE} WITH(NOLOCK)  
                      WHERE FechaJornada = ${getDateServer(campaingId)} AND 
                            (TipoAsistencia IS NULL OR TipoAsistencia = 'INICIO') AND  
                            IdCampaña = '${campaingId}' 
                      ORDER BY Punto_Venta ASC`)
      .set('sqlName', apiPromotoria)
    return this.httpService.getWithParams(params).pipe();
  }

  getAvailableSalespointForRoute(idUsuario: number, idJornada: number): Observable<Array<PdvRutaLibre>> {
    this.httpService.setUriAracne3(`apiPdv/puntosDeVentaUsuarios/getPuntosDeVentaFueraRutaByUsuarioAndJornada/${idUsuario}/${idJornada}`);

    return this.httpService.getWithParams(null).pipe(
      map((response: Array<PdvRutaLibre>) => response)
    );
  }

  postSalespointOffRoute(request: PdvRutaInsertRequest): Observable<PdvRutaInsertResponse> {
    this.httpService.setUriAracne3(`apiPdv/jornadasPuntoDeVenta/insertPdvsFueraRutaJornada`);

    return this.httpService.post(request).pipe(
      map((response: PdvRutaInsertResponse) => response)
    );
  }

  /**enviar correo */
  getEnvioCorreoGeoPermanencia(idUsuario: number, idJornada: number): Observable<any> {
    this.httpService.setUriAracne3(`apiEmployee/Geopermanencia/getNotificationEmail/${idUsuario}/${idJornada}`);

    return this.httpService.getWithParams(null).pipe(
      map((response: Array<PdvRutaLibre>) => response)
    );
  }

  /** OFFLINE FLUJOS : BASE DE DATOS LOCAL */
  public updateJornada(jornadaPV: JornadaPVModelDB){
    this.jornadaDao.findById(jornadaPV.IdJornada, null, this.databaseAppService.dbObject).then(
      (jornada: JornadaPVModelDB) => {
        jornada.Status = jornadaPV.Status;
        jornada.UsModificacion = jornada.UsModificacion;
        jornada.Abordajes = jornadaPV.Abordajes == null ? jornada.Abordajes : jornadaPV.Abordajes;
        jornada.CheckIN = jornadaPV.CheckIN == null ? jornada.CheckIN : jornadaPV.CheckIN;
        jornada.CheckOUT = jornadaPV.CheckOUT == null ? jornada.CheckOUT : jornadaPV.CheckOUT;
        // jornadaDao.updateCheck(jornada).then(

        // );
      }
    ).catch(() => false)
  }
}
