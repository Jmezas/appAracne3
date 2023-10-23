import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { SyncStatus } from 'src/app/shared/constants/strings.constan';
import { TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { IGenericUploadImage } from 'src/app/shared/models/config.interface';
import { IRequestAracne2_PA } from 'src/app/shared/models/http.interface';
import {
  Incidencia,
  IncidenciaDBModel,
} from 'src/app/shared/models/Incidencia.interface';
import { escaparComas } from 'src/app/shared/utils/string.utils';
import { environment } from 'src/environments/environment';
import { IncidenciaDao } from '../DAO/Incidencia.dao';
import { DatabaseAppService } from '../database/database-app.service';
import { HttpService } from '../http.service';
import { FileUploadService } from './file-upload.service';

@Injectable({
  providedIn: 'root',
})
export class IncidenciaApiService {
  constructor(
    private httpService: HttpService,
    private databaseAppService: DatabaseAppService,
    private incidenciaDao: IncidenciaDao,
    private fileUploadService: FileUploadService
  ) {}

  async uploadIncidencePhotos(lsImages: Array<IGenericUploadImage>) {
		let fileUploadPromises = [];
		lsImages.forEach(item => {
			fileUploadPromises.push(this.fileUploadService.sendImageToServer(item))
		})
		
		if (fileUploadPromises.length > 0) {
			console.log("FILE UPLOAD IMAGES : ", fileUploadPromises);
			const resultSaveImage = await this.fileUploadService.getResultSaveImages(fileUploadPromises);
			console.log("RESULT SAVE IMAGES :", resultSaveImage);
		}
	}

  insertRemoteIncidence(
    incidencia: Incidencia,
    businessLineName: string,
    isBusinessLinePromotoria: boolean
  ) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);

    // CASO ESPECIA: En flujo Promotoria se piden mas valores para registro
    const formatValues: string = isBusinessLinePromotoria
      ? 'varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar'
      : 'varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar';
    const parameters: string = isBusinessLinePromotoria
      ? 'IdJornada,IdTipoIncidencia,IdEstadoIncidencia,Observaciones,FotoIncidenciaA,FotoIncidenciaB,IdIncidenciaProducto,UsCreacion,FeCreacion,IdCampaña,IdGrupoIncidencia,Responsable,CorreoResponsable,CorreoCopia,Oportunidades'
      : 'IdJornada,IdTipoIncidencia,IdEstadoIncidencia,Observaciones,FotoIncidenciaA,FotoIncidenciaB,IdIncidenciaProducto,UsCreacion,FeCreacion,IdCampaña';
    let values: string =
      `${incidencia.IdJornada},` +
      `${incidencia.IdTipoIncidencia},` +
      `${incidencia.IdEstadoIncidencia},` +
      `${escaparComas(incidencia.Observaciones)},` +
      `${incidencia.FotoIncidenciaA},` +
      `${incidencia.FotoIncidenciaB},` +
      `${incidencia.IdIncidenciaProducto},` +
      `${incidencia.UsCreacion},` +
      `${incidencia.FeCreacion},` +
      `${incidencia.IdCampania}`;
    if (isBusinessLinePromotoria) {
      values =
        values +
        `,${escaparComas(incidencia.GrupoIncidencia)}` +
        `,${escaparComas(incidencia.Responsable)}` +
        `,${escaparComas(incidencia.CorreoResponsable)}` +
        `,${escaparComas(incidencia.CorreoCopia)}` +
        `,${escaparComas(incidencia.Oportunidades)}`;
    }
    const payload: IRequestAracne2_PA = {
      procedureName: environment.DB.PROCEDURES.REGISTER_INCIDENCIA,
      parameters,
      formatValues,
      values,
      sqlName: businessLineName,
    };
    return this.httpService.post(payload);
  }

  getTiposIncidenciasApi(campaignId: string, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = {
      query: `SELECT IdTipoIncidencia, IdCampaña, TipoIncidencia, Activo, UsCreacion, FeCreacion, IdFamiliaIncidencia FROM ${environment.DB.TABLES.TM_TIPO_INCIDENCIA} WHERE Activo = 1 AND IdCampaña = '${campaignId}'`,
      sqlName: businessLineName,
    };
    return this.httpService.post(params);
  }

  getConfigReglasApi(
    campaignId: string,
    businessLineName: string,
    isBusinessLineLG: boolean
  ) {
    if (isBusinessLineLG) {
      return of([]);
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = {
      query: `SELECT * FROM ${environment.DB.TABLES.TM_CONFIG_REGLAS_CAMPAING} WHERE Activo = 1 AND IdCampaña = '${campaignId}'`,
      sqlName: businessLineName,
    };
    return this.httpService.post(params);
  }

  getEstadosIncidenciasApi(campaignId: string, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = {
      query: `SELECT IdEstadoIncidencia, IdCampaña, EstadoIncidencia, Estado_Inicial, Estado_Final, Activo FROM ${environment.DB.TABLES.TM_INCIDENCE_STATUS} WHERE Activo = 1 AND IdCampaña = '${campaignId}' AND Estado_Inicial = 1`,
      sqlName: businessLineName,
    };
    return this.httpService.post(params);
  }

  getGruposIncidenciasApi(
    campaignId: string,
    businessLineName: string,
    isBusinessLineLG: boolean
  ) {
    if (isBusinessLineLG) {
      return of([]);
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = {
      query: `SELECT * FROM ${environment.DB.TABLES.TM_INCIDENCE_GROUPS} WHERE Activo = 1 AND IdCampaña = '${campaignId}'`,
      sqlName: businessLineName,
    };
    return this.httpService.post(params);
  }

  getCorreoGrupo(jornadaId: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    const payload = {
      formatValues: 'varchar',
      procedureName: environment.DB.PROCEDURES.GET_EMAILS_BY_GROUPS,
      values: jornadaId,
      parameters: 'IdJornada',
      sqlName: 'SQLDATA_LN_PROMOTORIA',
    };
    return this.httpService.post(payload);
  }

  getSubTiposIncidenciasApi(campaignId: string, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    const payload = {
      formatValues: 'int',
      procedureName: environment.DB.PROCEDURES.GET_INCIDENCE_SUBTYPES,
      values: campaignId,
      parameters: 'IdCampaña',
      sqlName: businessLineName,
    };
    return this.httpService.post(payload);
  }

  getIncidenciasApi(idJornada: string, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const payload = {
      query: `SELECT * FROM ${environment.DB.TABLES.VIEW_INCIDENCES_PV} WHERE IdJornada = '${idJornada}'`,
      sqlName: businessLineName,
    };
    return this.httpService.post(payload);
  }

  deleteIncidence(idIncidencia: string, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_POST);
    const payload = {
      query: `DELETE FROM ${environment.DB.TABLES.TRANS_INCIDENCIAS} WHERE IdIncidencia = '${idIncidencia}'`,
      sqlName: businessLineName,
    };
    console.log('PAYLOAD DELETE INCIDENCE: ', payload);
    return this.httpService.post(payload);
  }

  /** PROCESO OFFLINE : DB */
  insertLocalIncidence(incidencia: Incidencia, businessLineId: string) {
    const incidenciaDB: IncidenciaDBModel = {
      ...incidencia,
      Status: SyncStatus.INSERTED,
      IdLineaNegocio: businessLineId,
    };
    return this.incidenciaDao.insert(
      incidenciaDB,
      this.databaseAppService.dbObject
    );
  }

  getLocalIncidencesByJornada(idJornada: string, businessLineId: string) {
    return this.incidenciaDao.getAllByJornada(
      idJornada,
      businessLineId,
      this.databaseAppService.dbObject
    );
  }

  getIncidenciasOffline(status: SyncStatus) {
    return this.incidenciaDao.getIncidenciasByStatus(status, this.databaseAppService.dbObject);
  }

  deleteLocalIncidencia(idLocal: number) {
    return this.incidenciaDao.deleteLocalIncidencia(idLocal,this.databaseAppService.dbObject)
  }
}
