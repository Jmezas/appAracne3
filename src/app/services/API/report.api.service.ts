import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SyncStatus } from 'src/app/shared/constants/strings.constan';
import { BUSINESS_LINE, TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { ProductoCampanaModel } from 'src/app/shared/models/database-model/productCampania.model';
import { IRequestAracne2, IRequestAracne2_PA } from 'src/app/shared/models/http.interface';
import { JornadaPVModelDB } from 'src/app/shared/models/jornada.interface';
import { ProductoCampaign } from 'src/app/shared/models/product.interface';
import { ReportModel } from 'src/app/shared/models/report.interface';
import { environment } from 'src/environments/environment';
import { JornadaDao } from '../DAO/Jornada.dao';
import { ProductosCampanaDao } from '../DAO/ProductCampania.dao';
import { ReporteDao } from '../DAO/Report.dao';
import { DatabaseAppService } from '../database/database-app.service';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class ReportServiceAPI {
  constructor(
    private httpService: HttpService,
    private reporteDao: ReporteDao,
    private productoCampaniaDao: ProductosCampanaDao,
    private jornadaDao: JornadaDao,
    private databaseApp: DatabaseAppService) {}

  public getTabsUseCaseParameters  = (campaingId: number, rolId: number, businessLineName?: string) => {
    const query = businessLineName == BUSINESS_LINE.BUSSINESS_LINE_PROMOTORIA_LG ? 
                `SELECT * FROM ${environment.DB.TABLES.VIEW_TABS_REPORT_ROL} WHERE IdCampaña = '${campaingId}' AND IdRol = ${rolId}`:
                `SELECT * FROM ${environment.DB.TABLES.VIEW_TABS_REPORT} WHERE IdCampaña = '${campaingId}'`;      
    const payload = {
      query,
      "sqlName": businessLineName
    }
    console.log("REQUEST : ", payload);
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);

    return this.httpService.post(payload).pipe();
  } 

  /** Submodulo Reporte de ventas:  */
  getCamposProductoApi(campaignId: string, businessLineName: string) {
    const payload: IRequestAracne2 = {
      "query": `SELECT IdProducto, CampoReporte, IdCampaña FROM ${environment.DB.TABLES.VIEW_CAMPOS_REPORTE_PRODUCTOS} WHERE IdCampaña = '${campaignId}' AND Activo = 1`,
      "sqlName": businessLineName
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    return this.httpService.post(payload).pipe();
  }

  getSubFamiliasApi(familyId: string, businessLineName: string) {
    const payload: IRequestAracne2 = {
      "query": `SELECT * FROM ${environment.DB.TABLES.TM_SubFamiliaProducto} WHERE Activo = 1 AND  IdFamiliaProducto = '${familyId}'`,
      "sqlName":businessLineName
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    return this.httpService.post(payload).pipe();
  }



  /** LOCAL DB - REPORTS  */
  async generateLocalReport(campaignId: string, jornadaId: string, userId: string, businessLineId: string, unidadNegocio: string) {
    let resultReports: Array<ReportModel> = [];
    const existReport: boolean = await this.reporteDao.checkIfReportExistByJornada(jornadaId, businessLineId, this.databaseApp.dbObject);
    if(!existReport) {
      const jornada: JornadaPVModelDB = await this.jornadaDao.findById(jornadaId,businessLineId, this.databaseApp.dbObject);
      const listaProductosLocal: Array<ProductoCampanaModel> = await this.productoCampaniaDao.findByCampaignReport(campaignId, businessLineId, this.databaseApp.dbObject);

      listaProductosLocal.forEach((productLocal, index) => {
        let report:ReportModel = this.mapDomainToModel(productLocal);
        report.IdReporte = `${jornada.IdJornada}${index}`;
        report.IdJornada = jornada.IdJornada;
        report.FechaJornada = jornada.FechaJornada;
        report.UsCreacion = userId;
        report.Status = SyncStatus.INSERTED;
        report.IdLineaNegocio = jornada.IdLineaNegocio;
        report.UnidadNegocio = unidadNegocio;
        report.Oculto = true;

        resultReports.push(report);
      })
    }
    const resultTransaction = await this.reporteDao.insetAll(resultReports, this.databaseApp.dbObject);
    return new Observable(subscriber => {
      subscriber.next(resultTransaction);
    })
    // Retornamos un observable de reportes registrados
    // of(resultTransaction);
  }

  private mapDomainToModel(input: ProductoCampanaModel): ReportModel {
    const outputReport: ReportModel = {
      IdProducto: input.IdProducto,
      IdSubFamiliaProducto: input.IdSubFamiliaProducto,
      SubFamiliaProducto: input.SubFamilia,
      FamiliaProducto: input.FamiliaProducto,
      Producto: input.Producto,
      IdCampana: input.IdCampana,
      UnidadNegocio: input.UnidadNegocio,
      Activo: input.Activo
    }

    return outputReport;
}
}
