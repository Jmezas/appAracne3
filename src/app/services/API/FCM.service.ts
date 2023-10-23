import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { IRequestAracne2_PA } from 'src/app/shared/models/http.interface';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token, } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root',
})
export class FCMService {
  constructor(private httpService: HttpService) {}

  insertTokenFCM(userId: string, token: string): Observable<any> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    // const tokenTemp = "dlNQh7-t8BU:APA91bE8R28aeWblHr02SB7SEAQl6Ystl6IYxT9-xRqqfA-32ygX4UDzmN2xiookPxpGTSvixitBn45Jku_3b8C0nxY_buqwoGdD0_96THxtghfyuEnT9ik8mA5p7cWwluqZu7rgh5FC";
    const body: IRequestAracne2_PA = {
        formatValues: "int,varchar",
        procedureName: environment.DB.PROCEDURES.REGISTER_TOKENFCM,
        values: `${userId},${token}`,
        parameters: "IdUsuario,Token",
        sqlName: environment.DB.SQL_NAME.SQLDATA_ARACNE2
    }
    return this.httpService.post(body).pipe();
  }


  initPush() {
    console.log("## INICIANDO APP ::::::::::: ");
    if (Capacitor.getPlatform() !== 'web') {
        this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
        this.addListeners();
      } else {
        console.log('** Not register push notification, not mobile')
      }
    });
  }

  private addListeners() {
    PushNotifications.addListener('registration', (token: Token) => {
      alert('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      },
    );
  }
}
