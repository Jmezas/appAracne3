import { Injectable } from '@angular/core';
// import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';



@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {
  constructor(
    // private localNotifications: LocalNotifications
  ) { }

  simpleNotif() {
    // this.localNotifications.schedule({
    //   id: 1,
    //   text: 'Single ILocalNotification',
    //   data: { secret: 'prueba' }
    // });
  }
}
