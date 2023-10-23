import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { IRequestAracne2 } from 'src/app/shared/models/http.interface';
import { ApiPV } from 'src/app/shared/models/salePoint.interface';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class ManagePointSaleService{

  constructor(
    private httpService: HttpService
  ) { }

  getCountries(businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
                      .set('query',`SELECT IdPais, Pais FROM ${environment.DB.TABLES.TM_COUNTRIES} WHERE Activo = 1`)
                      .set('sqlName', businessLineName)

    return this.httpService.getWithParams (params).pipe(
    //   map((result: Array<IResponseItemSalePoint>) => reduceSalePointResponseToSelectData(result))
    );
  }

  getProvinces(idPais: string, businessLineName: string ) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
                      .set('query',`SELECT IdProvincia, Provincia, IdPais FROM ${environment.DB.TABLES.TM_PROVINCES} WHERE Activo = 1 AND IdPais = ${idPais}`)
                      .set('sqlName', businessLineName)

    return this.httpService.getWithParams (params).pipe(
    //   map((result: Array<IResponseItemSalePoint>) => reduceSalePointResponseToSelectData(result))
    );
  }

  getPopulation(idProvincia: string, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
                      .set('query',`SELECT IdPoblacion, Poblacion, IdProvincia FROM ${environment.DB.TABLES.TM_POBLACIONES} WHERE Activo = 1 AND IdProvincia = ${idProvincia}`)
                      .set('sqlName', businessLineName)

    return this.httpService.getWithParams (params).pipe(
    //   map((result: Array<IResponseItemSalePoint>) => reduceSalePointResponseToSelectData(result))
    );
  }

  getPVApi(idPV: string, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
                      .set('query',`SELECT * FROM ${environment.DB.TABLES.VIEW_PVs} WHERE IDPV = ${idPV}`)
                      .set('sqlName', businessLineName)

    return this.httpService.getWithParams (params).pipe(
    //   map((result: Array<IResponseItemSalePoint>) => reduceSalePointResponseToSelectData(result))
    );
  }

  updatePV(pv: ApiPV, businessLineName: string) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_POST);
    const params: IRequestAracne2 = {
      query : `UPDATE ${environment.DB.TABLES.TRANS_SALESPOINTS} SET `+
                `NombreCentro = '${pv.NombreCentro}', `+
                `Direccion = '${pv.Direccion}', `+
                `CodigoPostal = '${pv.CodigoPostal}', `+
                `IdProvincia = '${pv.IdProvincia}', `+
                `IdPoblacion = '${pv.IdPoblacion}', `+
                `Telefono = '${pv.Telefono}', `+
                `Observaciones ='${pv.Observaciones}' `+
                `WHERE IDPV =  ${pv.IDPV}`,
      sqlName: businessLineName
    };

    return this.httpService.post(params);
    // return remote.update(table, values, condition, SQLDATSQLDATA_LN_PROMOTORIA_LG);
  }
}
