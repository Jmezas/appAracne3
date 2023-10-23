import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { IRequestAracne2, IRequestAracne2_PA } from 'src/app/shared/models/http.interface';
import { IResponseCampaignRol } from 'src/app/shared/models/roles.interface';
import { ISelectGeneric } from 'src/app/shared/models/UI.interface';
import { reduceArrayDataToSelectData } from 'src/app/shared/utils/array.utils';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private httpService: HttpService) { }

  //Obtener la lista de roles que existen en la aplicacion
  getInitRoles(activeUserId: string) {
    let request = {
      query: `SELECT IdRol, Rol FROM ${environment.DB.TABLES.TM_ROL} WITH(NOLOCK)  WHERE IdRol IN ( SELECT distinct Idrol FROM ${environment.DB.TABLES.AUX_CAMPAIGN_USERS} WITH(NOLOCK) WHERE IdCampaña in  (SELECT distinct IdCampaña FROM ${environment.DB.TABLES.AUX_CAMPAIGN_USERS} WITH(NOLOCK) where IdUsuario=${activeUserId}) ) AND Activo = 1`,
      sqlName: environment.DB.SQL_NAME.SQLDATA_ARACNE2
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    return this.httpService.post(request).pipe();
  }

  // Obtener relacion ROL - CAMPAÑA del usuario, y filtrar por campaña seleccionada
  getRolesForCampaign(activeUserId: string, activeCampaing: string) {
    console.log({activeCampaing, activeUserId});
    
    const request: IRequestAracne2 = {
      query: `SELECT IdUsuario, IdCampaña, Cliente, IdRol, IdUnidadNegocio 
                FROM ${environment.DB.TABLES.VIEW_CAMPAIGN_ROLES} WITH(NOLOCK) 
                WHERE IdUsuario = ${activeUserId} AND Activo = 1`,
      sqlName: environment.DB.SQL_NAME.SQLDATA_ARACNE2
    }

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    return this.httpService.post(request).pipe(
      tap(result => console.log("RESULT1111 :_ ", result)),
      map((result: Array<IResponseCampaignRol>) => result.find( item => `${item.IdCampaña}` == activeCampaing)),
      tap(result => console.log("RESULT :_ ", result))
    );
  }

  // Obtener la lista de roles asignados por campañas usando procedimientos almacenados
  getAllCampaignRolesByPA (lsCampaignsId: Array<string>): Observable<Array<any>> {
    const request:IRequestAracne2_PA = {
      formatValues: "varchar",
      procedureName: environment.DB.PROCEDURES.LIST_CAMPAIGN_ROLES,
      values: lsCampaignsId.join(','),
      parameters: "IdCampañas",
      sqlName: environment.DB.SQL_NAME.SQLDATA_ARACNE2
    }

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request).pipe();
  }

  getRolesFiltradoInforme(campaingId): Observable<Array<ISelectGeneric>> {
    let request = {
      "formatValues": "int",
      "procedureName": environment.DB.PROCEDURES.GET_ROLES,
      "values": `${campaingId}`,
      "parameters": "IdCampania",
      "sqlName": environment.DB.SQL_NAME.PROMOTORIA_LG
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);

    return this.httpService.post(request).pipe(
      map((result: Array<any>) => reduceArrayDataToSelectData(result, 'roles', 'roles'))
    )
  }
}
