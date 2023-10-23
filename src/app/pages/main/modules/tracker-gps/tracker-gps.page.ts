import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { AlertController } from '@ionic/angular';
// import { SalePointsService } from 'src/app/services/API/salePoints.service';
// import { LocalNotificationService } from 'src/app/services/UTILS/localNotification.service';
import { IItemCampaign } from 'src/app/shared/models/campaing.interface';
import { IUserAuth } from 'src/app/shared/models/user.interface';
// import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@awesome-cordova-plugins/background-geolocation/ngx';

import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';


const MESSAGE_NOT_INIT = 'Iniciar tracker para obtener ubicación actual';
const MESSAGE_NOT_LOCATION = 'Se requiere localización para registrar PV';

// const config: BackgroundGeolocationConfig = {
//   desiredAccuracy: 10,
//   stationaryRadius: 20,
//   distanceFilter: 30,
//   debug: true, //  Esto hace que el dispositivo emita sonidos cuando lanza un evento de localización
//   stopOnTerminate: false, // Si pones este en verdadero, la aplicación dejará de trackear la localización cuando la app se haya cerrado.
//   //Estas solo están disponibles para Android
//   locationProvider: 1, //Será el proveedor de localización. Gps, Wifi, Gms, etc...
//   startForeground: true, 
//   interval: 3500, //El intervalo en el que se comprueba la localización.
//   fastestInterval: 3000, //Este para cuando está en movimiento.
//   activitiesInterval: 4000
// };

@Component({
  selector: 'app-tracker-gps',
  templateUrl: './tracker-gps.page.html',
  styleUrls: ['./tracker-gps.page.scss'],
})
export class TrackerGPSPage implements OnInit {
  @ViewChild('popover') popover;

  lastLocation

  activeUser: IUserAuth;
  activeCampaing: IItemCampaign

  isOpen = false;
  listOptions = [
    {
      text: 'Registrar PV',
      event: 'register'
    },
    {
      text: 'Iniciar Tracker',
      event: 'start'
    },
    {
      text: 'Detener Tracker',
      event: 'end'
    },
    {
      text: 'Sincronizar',
      event: 'sync'
    }
  ]

  constructor(
    // private backgroundMode: BackgroundMode,
    // private salesPointService: SalePointsService,
    // private localNotification: LocalNotificationService,
    private alertController: AlertController,
    private router: Router,
    // private backgroundGeolocation: BackgroundGeolocation,
    private androidPermissions: AndroidPermissions
  ) { 
    
  }

  async ngOnInit() {
    await this.checkPermissions();
    this.startBackgroundGeolocation();
  }

  presentPopover($event: Event) {
    this.popover.event = $event;
    this.isOpen = true;
  }

  menuOptionSelected (event) {
    switch(event) {
      case 'register': {
        if(true ) { //localization != null
          this.router.navigate(['main/tracker-gps/registrar-pv']);
        }else {
          this.displaySimpleAlerts(MESSAGE_NOT_LOCATION);
        }
      }; break;
      case 'start': this.iniciarGPSsync(); break;
      case 'end': console.log("Detener tracker"); break;
      case 'sync': console.log("Sync en tracker"); break;
    }
  }

  iniciarGPSsync() {
    
  }


  observeRuta() {

  }

  observePVs(ruta: Array<any>){
    if(this.lastLocation!=null){
      // this.salesPointService.getPVTracker()
    }
  }

  async updateLocation(mLocation) {
    try {
      if(true) { // Validar que exista el mapa
        if(mLocation == null) throw MESSAGE_NOT_INIT;
        if(mLocation!=this.lastLocation) {
          // map.clear  // Limpiar el mapa
          // Agregar la ubicacion del usuario actual al mapa
          this.lastLocation = mLocation;
  
          this.observeRuta();
        }
      }
    } catch (error) {
      this.displaySimpleAlerts(error)
    } 
  }


  // configureBackgroundTask() {
  //   this.backgroundMode.setDefaults({
  //     title: "Ubicación",
  //     text: "Probando notificacion en segundo plano",
  //   })
  //   this.backgroundMode.enable()
  //   this.backgroundMode.configure({
  //     title: "Probando!!",
  //     text: "Proyecto corriendo en segundo plano",
  //   })

  //   this.backgroundMode.on('enable').subscribe( resultado => {
  //     console.log("Activando funcion enable")
  //   })
  //   this.backgroundMode.on('activate').subscribe( resultado => {
  //     console.log("Activando funcion activate");
  //     // Creating Random id
  //     const randomId = Math.floor(Math.random() * 10000) + 1;
  //     this.localNotification.simpleNotif();
  //   })
  // }

  async displaySimpleAlerts (message: string) {
    const alert = await this.alertController.create({
      header: message,
      buttons: ['OK']
    });

    await alert.present(); 
  }


  startBackgroundGeolocation () {
    // this.backgroundGeolocation.configure(config)
    //   .then(() => {

    //     this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
    //       console.log("***** RESPONSE LOCATION : ", JSON.stringify(location));

    //       // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
    //       // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
    //       // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
    //       // this.backgroundGeolocation.finish(); // FOR IOS ONLY
    //     });

    //   });

    // this.backgroundGeolocation.start();

    // // // If you wish to turn OFF background-tracking, call the #stop method.
    // // this.backgroundGeolocation.stop();
  }

  async checkPermissions() {
    try {
      const result = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION);

      console.log("*** RESULTADO PERMISOS : ", JSON.stringify(result))
      if (!result || result.hasPermission === false) {
        this.requestPermissions();
      }
    } catch (error) {
      this.requestPermissions();
    }
  }

  private async requestPermissions() {
    try {
      const data = await this.androidPermissions.requestPermissions([
        "android.permission.ACCESS_BACKGROUND_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
        this.androidPermissions.PERMISSION.FOREGROUND_SERVICE
      ]);
      if (!data.hasPermission) {
        throw new Error('No permission');
      }
    } catch (error) {
      console.error(" **** ERROR DE PERMISOS **** : ", error)
    }
  }

}
