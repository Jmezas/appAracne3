import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { FCM } from "@capacitor-community/fcm";
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token} from "@capacitor/push-notifications";
import { LocalNotifications } from '@capacitor/local-notifications';
import { environment } from 'src/environments/environment';
import { HttpService } from '../services/http.service';
import { TYPE_REQUEST } from '../shared/constants/values.constants';
import { IRequestAracne2_PA } from 'src/app/shared/models/http.interface';
import { catchError } from 'rxjs/operators';
import { DialogNotificationService } from '../services/UI/dialog-notification.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private httpService: HttpService,
    private alertService: DialogNotificationService) {}

    async ngOnInit(userId: string, topicCampaign: string, topicRol: string) {
    console.log('Initializing Notification');

    if (Capacitor.getPlatform() !== 'web') {
      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      await PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
            // Register with Google Services (FCM) to receive push notifications on Android
            PushNotifications.register().then(() => {
              console.log('Push registration successful');
            }).catch(error => {
              console.error('Error during push registration:', error);
            });
        } else {
          // Show some error
          console.error('Permission for push notifications not granted');
        }
      });

      await PushNotifications.addListener('registration', (token: Token) => {
        //alert('Push registration success, token: ' + token.value);
        this.subscribeTopic(topicCampaign, topicRol);
        
        // Determina si el dispositivo es Android o iOS y establece la fuente en consecuencia
        const sourceToken = Capacitor.getPlatform() === 'ios' ? 'IOS' : 'GOOGLE';
  
        this.guardarToken(token.value,userId,sourceToken);
      });

      await PushNotifications.addListener('registrationError', (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      });
      
      // Show us the notification payload if the app is open on our device
      await PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          //alert('Push received: ' + JSON.stringify(notification));
          console.log('Push received:' ,notification);
          const { title, message  } = notification.data;
          LocalNotifications.schedule({
            notifications:[{                   
              smallIcon: 'notification_icon',
              largeIcon: 'notification_icon',
              title:title,
              body:message,
              id: 1,
              extra: { 
                data: notification.data
              }
            }]
          });

          // Agregar un manejador para cuando se interactúa con la notificación
          LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
            if (notification.actionId === 'tap') {
              // Puedes acceder a los datos adicionales directamente en la notificación original
              
              const data = notification.notification.extra?.data;
              if (data) {
                // Navegar a la página correspondiente
                //window.open(data, '_blank');

                //alert('Notificación: ' + JSON.stringify(data));
                const { title, message  } = data;
                this.alertService.showAlert('ic_notification_color.svg', title, message);
          
              }
            }
          });
        }
      );

      // Method called when tapping on a notification
      await PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          alert('Push action performed: ' + JSON.stringify(notification));
          //router para abrir nueva ruta
        }
      );
      
    }else{
      console.log('PushNotification.requestPermission()-> no es movil')
    }
  }

  guardarToken(token: string,userId: string,sourceToken: string){
    const savetoken = this.saveToken(token, userId,sourceToken).subscribe(
      response => {
        console.log(response);
      },
      error => {console.log(error);},
    )
  }

  saveToken(token: string,userId: string,sourceToken: string){
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    const body: IRequestAracne2_PA = {
        formatValues: "int,varchar,varchar",
        procedureName: environment.DB.PROCEDURES.REGISTER_TOKENFCM,
        values: `${userId},${token},${sourceToken}`,
        parameters: "IdUsuario,Token,SourceToken",
        sqlName: environment.DB.SQL_NAME.SQLDATA_ARACNE2
    }
    return this.httpService.post(body).pipe(catchError(error => {
      console.log(error)
      return null;
    }));
  }
  
  subscribeTopic(topicCampaign: string, topicRol: string){
    try {
      //Subscribe a un tema específico campaign
      FCM.subscribeTo({ topic: topicCampaign })
      .then((r) => {
        //alert(`subscribed to topic`)
        console.log('subscribed to topic');
      })
      .catch((err) => console.log(err));
      
      //Subscribe a un tema específico idrol
      FCM.subscribeTo({ topic: topicRol })
      .then((r) => {
        //alert(`subscribed to topic`)
        console.log('subscribed to topic');
      })
      .catch((err) => console.log(err));
    } catch (error) {
      console.error('Error al suscribirse al tema:', error);
    }
  }

  unsubscribeTopic(topicCampaign: string, topicRol: string){
    try {
      //Unsubscribe a un tema específico campaign
      FCM.unsubscribeFrom({ topic: topicCampaign })
      .then(() => alert(`unsubscribed from topic`))
      .catch((err) => console.log(err));

      //Unsubscribe a un tema específico topicRol
      FCM.unsubscribeFrom({ topic: topicRol })
      .then(() => alert(`unsubscribed from topic`))
      .catch((err) => console.log(err));

      // Remove FCM instance
      FCM.deleteInstance()
      .then(() => {
        //alert(`Token deleted`)
        console.log(`Token deleted`);
      })
      .catch((err) => console.log(err));
    } catch (error) {
      console.error('Error al suscribirse al tema:', error);
    }
  }
}


