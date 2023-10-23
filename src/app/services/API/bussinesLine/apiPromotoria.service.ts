import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TYPE_REQUEST } from "src/app/shared/constants/values.constants";
import { AsistenciaModel } from "src/app/shared/models/asistencia.interface";
import { Exhibicion } from "src/app/shared/models/Exhibicion.interface";
import { IRequestAracne2_PA } from "src/app/shared/models/http.interface";
import { escaparComas } from "src/app/shared/utils/string.utils";
import { environment } from "src/environments/environment";
import { HttpService } from "../../http.service";
import { AsistenciaServiceAPI } from "../asistencia.api.service";

@Injectable({
  providedIn: 'root',
})
export class ApiPromotoriaService {

  private static MOBILE_ORIGIN: string = '2';

  constructor(
    private httpService: HttpService,
    private asistenciaService: AsistenciaServiceAPI,
  ) { };

  /** Implementar funciones que solo se usan en la linea de negocio:  PROMOTORIA */

  public grabarOportunidadImg(data) {
    // return this.uploadPhotos(data.Campania, "", !TextUtils.isEmpty(data.Foto) ? data.Foto : null)
    // .flatMapObservable((Function<List<Boolean>, ObservableSource<ResponseBody>>) booleans -> {
    //     if (data.Foto != null)
    //         data.Foto = getFileName(data.Foto);
    //     return grabarOportunidad(data);
    // });
  }

  public uploadPhotos(campaign: string, folder: string, photosArgs: Array<string>) {
    let photos: Array<string> = [];

    photosArgs.forEach(photoArg => {
      if (photoArg != null) {
        photos.push(photoArg);
      }
    })

  }

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

  /** Submodulo Reporte de ventas */
  getReportesApi(idJornada: string, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const payload = {
      "query": `SELECT * FROM ${environment.DB.TABLES.VIEW_REPORTE_PV} WITH(NOLOCK)  WHERE IdJornada = '${idJornada}' AND Activo = 1 ORDER BY IdProductoOrd, OrdenReporteFamilia, OrdenReporteSubFamilia, OrdenReporteProducto, IdProducto ASC`,
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
      "procedureName": environment.DB.PROCEDURES.GET_PRODUCT_FAMILY,
      "values": `${campaignId}`,
      "parameters": "IdCampaña",
      "sqlName": businessLineName
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(payload)
  }

  /** Insert Exhibition */
  insertExhibition(exhibicion: Exhibicion, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    const payload: IRequestAracne2_PA = {
      procedureName: environment.DB.PROCEDURES.REGISTER_EXHIBITION,
      formatValues: "varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar,varchar",
      parameters: "IdJornada,IdTipoCategoriaFoto,Foto,Foto2,Foto3,Observaciones,UsCreacion,IdCampaña,PrecioExhibi,PrecioSitema,CantidadSotck,ExhiDisponible",
      values: `${exhibicion.IdJornada},${exhibicion.IdTipoCategoriaFoto},${exhibicion.Foto},null,null,${escaparComas(exhibicion.Observaciones)},${exhibicion.UsCreacion},${exhibicion.IdCampana},${exhibicion.PrecioExhibi||''},${exhibicion.PrecioSitema||''},${exhibicion.CantidadSotck||''},${exhibicion.ExhiDisponible||''}`,
      sqlName: businessLineName
    }
    return this.httpService.post(payload);
  }
}