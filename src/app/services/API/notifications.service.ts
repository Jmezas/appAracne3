import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRequestAracne2_PA } from 'src/app/shared/models/http.interface';
import { environment } from 'src/environments/environment';
import { TYPE_REQUEST } from '../../shared/constants/values.constants';
import { IItemWorkdayType, IItemWorkdayTurn, IItemResponseVerifyWorkday } from '../../shared/models/jornada.interface';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private httpService: HttpService
  ) { }


  getListNotifications(rolId: number, campaignId: number, userId: string) {
    const request = {
        formatValues: 'int,varchar,int',
        procedureName: environment.DB.PROCEDURES.LIST_NOTIFICATIONS,
        values: `${rolId},${campaignId},${userId}`,
        parameters: 'IdRol,IdCampaña,UserId',
        sqlName: environment.DB.SQL_NAME.SQLDATA_ARACNE2
    };

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);

    return this.httpService.post(request).pipe();
  }

  insertNotification(campaignId: number, notificationTitle: string, notificationMesage: string, ID_Fichero: number, notificationRoleId: number, userId: string) {
    const request: IRequestAracne2_PA = {
      formatValues: 'int,varchar,varchar,int,int,int',
      procedureName: environment.DB.PROCEDURES.INSERT_NOTIFICATION,
      values: `${campaignId},${notificationTitle},${notificationMesage},${ID_Fichero},${notificationRoleId},${userId}`,
      parameters: 'IdCampaña,Titulo,Mensaje,ID_Fichero,IdRolNotificacion,UsCreacion',
      sqlName: environment.DB.SQL_NAME.SQLDATA_ARACNE2
    };

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request).pipe();
  }
}
