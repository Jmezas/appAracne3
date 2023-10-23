import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { HttpService } from '../http.service';
import { TYPE_REQUEST } from '../../shared/constants/values.constants';

import { IItemUserResponse, UserCampaign, UserData } from '../../shared/models/user.interface'; 

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService) { }

  public getAdminUsersCollection(campaignId: number): Promise<Array<UserData>> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    let params = new HttpParams()
      .set('query', 'SELECT * FROM View_Campañas_Usuarios WITH(NOLOCK) ' +
        `WHERE  IdCampaña = ${campaignId} AND Activo = 1 ` +
        'ORDER BY Nombre_Completo ASC')
      .set('sqlName', environment.DB.SQL_NAME.SQLDATA_ARACNE2)

    return this.httpService.getWithParams(params)
      .pipe(map((response: Array<IItemUserResponse>) => {
        const result: Array<UserData> = response.map(x => ({
          IdUsuario: x.IdUsuario,
          NombreCompleto: x.Nombre_Completo,
          Usuario: x.UsuarioNombre,
          Nombre: '',
          Apellidos: '',
          IdRol: x.IdRol,
          Rol: x.Rol
        }));

        return result;
      })).toPromise();
  }

  public getNormalUsersCollection(userId: number, campaignId: number): Promise<Array<UserData>> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    let params = new HttpParams()
      .set('query', 'SELECT * FROM View_Campañas_Usuarios ' +
        `WHERE IdCampaña = ${campaignId} AND Activo = 1 AND ` +
        `(IdUsuario = ${userId} OR IdUsuario IN (` +
        `SELECT IdUsuario FROM Aux_Usuarios_Campañas WHERE ID_Jefe_Equipo = ${userId} AND IdCampaña = ${campaignId})) ` +
        'ORDER BY Nombre_Completo ASC')
      .set('sqlName', environment.DB.SQL_NAME.SQLDATA_ARACNE2);

    return this.httpService.getWithParams(params)
      .pipe(map((response: Array<IItemUserResponse>) => {
        const result: Array<UserData> = response.map(x => ({
          IdUsuario: x.IdUsuario,
          NombreCompleto: x.Nombre_Completo,
          Usuario: x.UsuarioNombre,
          Nombre: '',
          Apellidos: '',
          IdRol: x.IdRol,
          Rol: x.Rol
        }));

        return result;
      })).toPromise();
  }

  public getUserCampaignReporter(userId: number, campaignId: number, roleId: number) {
    this.httpService.setUriAracne3(`apiEmployee/employees/getUsuariosCampania/${campaignId}`);

    return this.httpService.getWithParams(null).pipe(
      map((response: Array<UserCampaign>) => {
        if (!response) {
          return [];
        }

        return response.filter(x => (roleId === 3 ? x.idJefeEquipo === userId : x.idUsuario !== userId));
      })
    )
  }
}
