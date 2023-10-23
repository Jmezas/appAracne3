import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ROLES, TYPE_REQUEST } from '../shared/constants/values.constants';
import { IItemUserResponse } from '../shared/models/user.interface';
import { reduceUserResponseToSelectData } from '../shared/utils/array.utils';
import { HttpService } from './http.service';
@Injectable({
  providedIn: 'root'
})
export class UserProfilesService {

  constructor(
    private httpService: HttpService,
  ) { }

  /**
   * Obtener la lista de usuarios
   * Se usa en los siguientes modulos ( reporte | )
   */
  public apiGetUsers(userId: string, userRol: number, campaingId: number ) {
    switch(`${userRol}`) {
      case ROLES.USER_ADMIN:
        return this.getAdminUsers( campaingId ).pipe(map((result: Array<IItemUserResponse>) => reduceUserResponseToSelectData(result)));
      case ROLES.USER_MERCHAND_LG:
        return this.getAdminUsers( campaingId ).pipe(map((result: Array<IItemUserResponse>) => reduceUserResponseToSelectData(result)));
      default:
        return this.getNormalUsers(userId, campaingId)
          .pipe(map((result: Array<IItemUserResponse>) => reduceUserResponseToSelectData(result)));
    }
  }

  private getAdminUsers(campaingId: number) {
    console.log('EJECUTANDO GET USER ADMIN');
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
                    .set('query', `SELECT * 
                                  FROM ${environment.DB.TABLES.VIEW_USERS_CAMPAIGNS} WITH(NOLOCK)  
                                  WHERE  IdCampaña = '${campaingId}' AND Activo = 1 ORDER BY Nombre_Completo ASC `)
                    .set('sqlName', environment.DB.SQL_NAME.SQLDATA_ARACNE2);

    return this.httpService.getWithParams(params).pipe(
    );
  }

  private getNormalUsers( userId: string, campaingId: number) {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
                    .set('query', `SELECT * 
                                  FROM ${environment.DB.TABLES.VIEW_USERS_CAMPAIGNS} WITH(NOLOCK)  
                                  WHERE IdCampaña = '${campaingId}' AND 
                                        Activo = 1 AND 
                                        ( IdUsuario = ${userId} OR 
                                        IdUsuario IN  
                                        ( SELECT IdUsuario  FROM ${environment.DB.TABLES.AUX_CAMPAIGN_USERS}  
                                          WHERE ID_Jefe_Equipo = '${userId}' AND IdCampaña = '${campaingId}' )) 
                                  ORDER BY Nombre_Completo ASC`)
                    .set('sqlName', 'SQLDATA_ARACNE2');

    return this.httpService.getWithParams(params).pipe(
    );
  }
}
