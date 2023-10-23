import { Injectable } from '@angular/core';
import { MOBILE_ORIGIN, TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { IRequestAracne2, IRequestAracne2_PA } from 'src/app/shared/models/http.interface';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';

import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AddressCollection } from '../../shared/models/location.interface';
import { InformationPDV, IResponseWorkDay } from '../../shared/models/jornada.interface';
import { AsistenciaDBModel, AsistenciaModel } from 'src/app/shared/models/asistencia.interface';
import { escaparComas } from 'src/app/shared/utils/string.utils';
import { SyncStatus } from 'src/app/shared/constants/strings.constan';
import { DatabaseAppService } from '../database/database-app.service';
import { AsistenciaDao } from '../DAO/Asistencia.dao';
import { AssistanceConfigResponse, AssistanceExpiredRequest, AssistanceInsertResponse, AssistanceType, AssistanceWorkRequest, AssistanceWorkResponse } from '../../shared/models/assistance.interface';
import { IGenericUploadImage } from 'src/app/shared/models/config.interface';
import { FileUploadService } from './file-upload.service';

import * as moment from 'moment';
moment.locale('es');

@Injectable({
  providedIn: 'root',
})
export class AsistenciaServiceAPI {
  constructor(
    private httpService: HttpService,
    private databaseAppService: DatabaseAppService,
    private asistenciaDao: AsistenciaDao,
    private fileUploadService: FileUploadService
  ) { }

  getRecordAssistanceApi(idJornada: string, businessLineName: string) {

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const request: IRequestAracne2 = {
      query: `SELECT * FROM ${environment.DB.TABLES.TRANS_ASISTENCIAS} WHERE IdJornada = ${idJornada}`,
      sqlName: businessLineName
    }

    return this.httpService.post(request).pipe();
  }

  async saveAssistanceImage(assistanceImage: IGenericUploadImage) {
    let fileUploadPromises = [];
    [assistanceImage].forEach(item => {
      fileUploadPromises.push(this.fileUploadService.sendImageToServer(item))
    })
    if (fileUploadPromises.length > 0) {
      console.log("FILE UPLOAD IMAGES : ", fileUploadPromises);
      const resultSaveImage = await this.fileUploadService.getResultSaveImages(fileUploadPromises);
      console.log("RESULT SAVE IMAGES :", resultSaveImage);
    }
  }

  /**createAssistanceRemote */
  registerAssistanceForReports(asistencia: AsistenciaModel, apiPromotoria: string, isPromotoriaPE: boolean) {
    const request: IRequestAracne2_PA = {
      formatValues: "varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar" + (isPromotoriaPE ? ",varchar" : ''),
      procedureName: environment.DB.PROCEDURES.REGISTER_ASSISTANCE,
      values: this.buildValuesRegisterAssistenceForReport(asistencia, isPromotoriaPE),
      // "1901267,2022-04-13,13/04/2022 05:54:08 AM,-12.1582268,-76.9772712,INICIO,91151,Probando,null,Zona Horaria: GMT-05:00 America/Lima GMT-05:00 Zona Automatica : true Hora Automatica: true Email: Error en acceso al permiso | IdSesion 39b73afe-e776-42ab-9622-f1a3dd367843,,2,",
      parameters: "IdJornada,FechaReg,FechaHoraIni,Latitud,Longitud,TipoAsistencia,UsCreacion,Observacion,FechaHoraSync,LogAsistencia,LogGeo,Origen,imagepath" + (isPromotoriaPE ? ",Imei" : ''),
      sqlName: apiPromotoria
    }
    console.log("REQUEST : ", request);
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);

    return this.httpService.post(request).pipe();
  }

  private buildValuesRegisterAssistenceForReport(asistencia: AsistenciaModel, isPromotoriaPE: boolean) {
    return `${asistencia.IdJornada},` +
      `${asistencia.FechaReg},` +
      `${asistencia.FechaHoraIni},` +
      `${asistencia.Latitud},` +
      `${asistencia.Longitud},` +
      `${asistencia.TipoAsistencia},` +
      `${asistencia.UsCreacion},` +
      `${escaparComas(asistencia.Observacion)},` +
      `${asistencia.FechaHoraSync},` +
      `${escaparComas(asistencia.LogAsistencia)},` +
      `${escaparComas(asistencia.LogGeo)},` +
      `${MOBILE_ORIGIN},` +
      `${escaparComas(asistencia.imagepath)}` +
      `${isPromotoriaPE ? (',' + escaparComas(asistencia.Imei)) : ''}`;
  }

  getInformeAsistencia(activeUserId: string, salePointId: string, activeCampaignId: string, date: string, userCampaignRole: string, apiPromotoria: string) {
    const request: IRequestAracne2_PA = {
      formatValues: "int,int,int,varchar,varchar",
      procedureName: environment.DB.PROCEDURES.GET_ASSITENCES_REPORT,
      values: `${activeUserId},${salePointId},${activeCampaignId},${date},${userCampaignRole}`, //"91151,17846,169,27/06/2022,ADMINISTRADOR",
      parameters: "IdUsuario,IdPV,IdCampaña,Fecha,Rol",
      sqlName: apiPromotoria
    }

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request).pipe();
  }

  registerlaborAssistance(address: AddressCollection, assistanceType: number, dateWork: string, userId: number, campaignId: number): Observable<IResponseWorkDay[]> {
    const request = {
      "formatValues": "int,int,int,varchar,varchar,varchar,varchar",
      "procedureName": environment.DB.PROCEDURES.POST_LABOR_ASSISTANCE,
      "values": `${userId},${campaignId},${assistanceType},${dateWork},${address.address.replace(/,/g, '|')},${address.latitude},${address.longitude}`,
      "parameters": "IdUsuario,IdCampaña,IdTipoAsistenciaLaboral,Fecha,Direccion,Latitud,Longitud",
      "sqlName": environment.DB.SQL_NAME.SQLDATA_ARACNE2
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request).pipe(map((response: IResponseWorkDay[]) => response));
  }

  registerlaborPVAssistance(assistanceType: number, dateWork: string, salesPointId: number, latitude: string, longitude: string, userId: number, campaignId: number): Observable<IResponseWorkDay[]> {
    const request = {
      "formatValues": "int,int,int,varchar,varchar,varchar,varchar,varchar,varchar",
      "procedureName": environment.DB.PROCEDURES.POST_LABOR_PV_ASSISTANCE,
      "values": `${userId},${campaignId},${assistanceType},${dateWork},${salesPointId},${latitude},${longitude},'',''`,
      "parameters": "IdUsuario,IdCampaña,IdTipoAsistenciaLaboral,FechaHora,Idpv,Latitud,Longitud,Comentario,Imei",
      "sqlName": environment.DB.SQL_NAME.SQLDATA_ARACNE2
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request).pipe(map((response: IResponseWorkDay[]) => response));
  }

  /** DB LOCAL */

  async crearAsistenciaDB(asistencia: AsistenciaModel) {
    let asistenciaDB: AsistenciaDBModel = asistencia;
    asistenciaDB.Status = SyncStatus.INSERTED;

    return await this.asistenciaDao.insert(asistenciaDB, this.databaseAppService.dbObject);
  }

  async getAsistenciasDB(idJornada: string, businessLineId: string) {
    return await this.asistenciaDao.findById(idJornada, businessLineId, this.databaseAppService.dbObject);
  }

  async getAsistenciasOffline(status: SyncStatus) {
    return this.asistenciaDao.getExhibicionsByStatus(status, this.databaseAppService.dbObject);
  }

  async getAllAsistenciasDB() {
    return await this.asistenciaDao.getAll(this.databaseAppService.dbObject);
  }

  deleteLocalAssistence(idJornada: number) {
    return this.asistenciaDao.deleteLocalAssistence(idJornada, this.databaseAppService.dbObject);
  }

  /** Aracne 3 */

  getAracne3AssistanceType(): Observable<Array<AssistanceType>> {
    this.httpService.setUriAracne3('apiPdv/tipoAsistencia/getTiposAsistencias');

    return this.httpService.getWithParams(null).pipe(
      map((response: Array<AssistanceType>) => response)
    );
  }

  /*configuracion de check out no obligatorio */
  getAracne3AssistanceTypeCheckConfig(): Observable<Array<AssistanceConfigResponse>> {
    this.httpService.setUriAracne3('apiPdv/tipoAsistencia/getConfigCampania');

    return this.httpService.getWithParams(null).pipe(
      map((response: Array<AssistanceConfigResponse>) => response)
    );
  }

  postAracne3AssistanceRegister(request: AssistanceWorkRequest): Observable<AssistanceInsertResponse> {
    this.httpService.setUriAracne3('apiForms/asistenciasJornada/createAsistenciaJornada');

    return this.httpService.post(request).pipe(
      map((response: AssistanceInsertResponse) => response)
    );
  }

  getAracne3AssistancesForWorkDay(workDayId: number, salespointId: number = null): Observable<Array<AssistanceWorkResponse>> {
    const urlRequest: string = (salespointId != null ?
      `apiForms/asistenciasJornada/getAsistenciaJornadaByIdJornada/${workDayId}/${salespointId}` :
      `apiForms/asistenciasJornada/getAsistenciaJornadaByIdJornada/${workDayId}`);

    this.httpService.setUriAracne3(urlRequest);

    return this.httpService.getWithParams(null).pipe(
      map((response: Array<AssistanceWorkResponse>) => response)
    );
  }

  createAssistanceExpired(dataWorkDay: Array<AssistanceExpiredRequest>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Validamos el status de las asistencias por idJornadas y sus idPdvs
      const batchAssistanceStatus = this.preparedBatchAssistanceStatus(dataWorkDay);

      forkJoin(batchAssistanceStatus).subscribe(
        response => {
          // Ordenamos las asistencias por fecha de registro
          const assistanceSorted = response.map(x => x.sort((x, y) => Number(new Date(x.fechaHora)) - Number(new Date(y.fechaHora))));
          // Obtenemos la ultima asistencia para determinar que tipo de asistencia queda pendiente
          const lastAssistances = assistanceSorted.map(x => ({ ...x[x.length - 1] }));
          // Preparamos el object request para insertar las asistencias
          const assistanceRequest = lastAssistances.reduce((prev, curr) => {
            prev.push({
              idJornada: curr.idJornada,
              idPdv: curr.idPdv,
              idTipoAsistencia: (curr.idTipoAsistencia == 2 ? 3 : 4),
              fechaHora: moment(curr.fechaHora).format("YYYY-MM-DD") + (curr.idTipoAsistencia == 2 ? 'T23:59:00' : 'T23:59:59'),
              latitud: curr.latitud.toString(),
              longitud: curr.longitud.toString(),
              direccionGoogle: curr.direccionGoogle,
              observaciones: '',
              foto: '',
              nivelBateria: curr.nivelBateria,
              distanciaPdv: curr.distanciaPdv,
              ubicacionFalsa: '',
              esAutomatico: true,
              usCreacion: curr.usCreacion
            });

            // Si la ultima asistencia registrada es Inicio Descando entonces necesita tambien un Checkout
            if (curr.idTipoAsistencia == 2) {
              prev.push({ ...prev[prev.length - 1] });
              prev[prev.length - 1].idTipoAsistencia = 4;
              prev[prev.length - 1].fechaHora = moment(curr.fechaHora).format("YYYY-MM-DD") + 'T23:59:59';
            }

            return prev;
          }, ([] as Array<AssistanceWorkRequest>));

          // Ejecutamos en bloque el registro de asistencias
          const batchAssistanceRegister = this.preparedBatchAssistanceRegister(assistanceRequest);

          forkJoin(batchAssistanceRegister).subscribe(
            response => {
              const result = ((response.length > 0 && response.some(x => x.statusCode == 200)) ? true : false);
              resolve(result);
            },
            error => { resolve(false); }
          );
        },
        error => { resolve(false); }
      );
    });
  }

  preparedBatchAssistanceStatus(statusRequest: Array<AssistanceExpiredRequest>): Array<Observable<Array<AssistanceWorkResponse>>> {
    return statusRequest.map(request => {
      return this.getAracne3AssistancesForWorkDay(request.idJornada, request.idPdv);
    });
  }

  preparedBatchAssistanceRegister(assistanceRequest: Array<AssistanceWorkRequest>): Array<Observable<AssistanceInsertResponse>> {
    return assistanceRequest.map(request => {
      return this.postAracne3AssistanceRegister(request);
    });
  }

  getAracne3AssistanceInfoPdv(idPdv:number): Observable<InformationPDV> {
    this.httpService.setUriAracne3('apiPdv/Puntodeventa/getInformacionPdvApp/'+ idPdv);

    return this.httpService.getWithParams(null).pipe(
      map((response: InformationPDV) => response)
    );
  }
}
