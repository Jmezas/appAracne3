import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { AsistenciaModel } from 'src/app/shared/models/asistencia.interface';
import { ExhibicionDBModel } from 'src/app/shared/models/Exhibicion.interface';
import { IRequestAracne2_PA } from 'src/app/shared/models/http.interface';
import { escaparComas } from 'src/app/shared/utils/string.utils';
import { environment } from 'src/environments/environment';
import { HttpService } from '../../http.service';
import { AsistenciaServiceAPI } from '../asistencia.api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiLgService {

  constructor(
    private asistenciaService: AsistenciaServiceAPI,
    private httpService: HttpService) { }

  createAssistanceRemoteImg(asistencia: AsistenciaModel, apiPromotoria: string, isPromotoriaPE: boolean) {
    // let booleans = uploadPhotos();
    return this.asistenciaService.registerAssistanceForReports(asistencia, apiPromotoria, isPromotoriaPE);
    // return uploadPhotos(asistencia.NombreCampaña, ASISTENCIA, asistencia.imagepath)
    //         .flatMapObservable((Function<List<Boolean>, Observable<ResponseBody>>) booleans -> {
    //             if (asistencia.imagepath != null)
    //                 asistencia.imagepath = getFileName(asistencia.imagepath);
    //             return this.asistenciaService.registerAssistanceForReports()
    //         });
  }

  /** Implementar funciones que solo se usan en la linea de negocio:  PROMOTORIA LG*/


  /** Submodulo Reporte de ventas */
  getReportesApi(idJornada: string, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const payload = {
      "query": `SELECT * FROM ${environment.DB.TABLES.VIEW_REPORTE_PV} WITH(NOLOCK)  WHERE IdJornada = '${idJornada}' AND Activo = 1 ORDER BY OrdenReporteFamilia, OrdenReporteSubFamilia, OrdenReporteProducto, IdProducto ASC`,
      "sqlName": businessLineName
    }

    return this.httpService.post(payload)
  }

  generarReporte(idCampania: string, idJornada: string, idUsuario: string, businessLineName: string, unidadNegocio?: string) {
    const payload: IRequestAracne2_PA = {
      "formatValues": "int,int,int",
      "procedureName": environment.DB.PROCEDURES.INIT_REGISTER_REPORTS,
      "values": `${idCampania},${idJornada},${idUsuario}`,
      "parameters": "IdCampaña,IdJornada,IdUsuarioLogado",
      "sqlName": businessLineName
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(payload)
  }

  getFamiliasApi(campaignId: string, businessLineName: string) {
    const payload: IRequestAracne2_PA = {
      "formatValues": "int",
      "procedureName": environment.DB.PROCEDURES.GET_PRODUCT_FAMILY_2,
      "values": `${campaignId}`,
      "parameters": "IdCampaña",
      "sqlName": businessLineName
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(payload)
  }

  /** Insert Exhibition */
  insertExhibition(exhibicion:ExhibicionDBModel, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    console.log("EXHIBITION DATA : ", exhibicion);
    
    const payload: IRequestAracne2_PA = {
      procedureName: environment.DB.PROCEDURES.REGISTER_EXHIBITION,
      formatValues: "varchar,varchar,varchar,varchar,varchar,varchar,varchar",
      parameters: "IdJornada,IdTipoCategoriaFoto,Foto,Foto2,Observaciones,UsCreacion,IdCampaña",
      values: `${exhibicion.IdJornada},${exhibicion.IdTipoCategoriaFoto},${exhibicion.Foto},${exhibicion.Foto2},${escaparComas(exhibicion.Observaciones)},${exhibicion.UsCreacion},${exhibicion.IdCampana}`,
      sqlName: businessLineName
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(payload);
  }
}
