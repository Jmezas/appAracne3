import { Component, OnDestroy, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';

import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import * as splashAction from '../../../store/actions/splash.action';

import { LocalStorageService } from '../../../services/local-storage.service';
import { ConfigService } from '../../../services/API/config.api.service';
import { InternetConnectionService } from '../../../services/internet-connection.service';
import { AlertService } from '../../../services/UI/alert.service';

import { IVersionResponse } from '../../models/config.interface';

import { forkJoin, Observable, Subscription, timer } from 'rxjs';
import { Platform } from '@ionic/angular';
interface ISplashValidations {
  connection: boolean,
  version: boolean,
  authenticate: boolean,
}

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit, OnDestroy {
  aracne_logo: string = 'assets/svg/aracne3_login.svg';
  validations: ISplashValidations;
  splashSubscription: Subscription;
  isUpgradeAvailable: boolean = false;

  constructor(
    private internetConnectionService: InternetConnectionService,
    private store: Store<AppState>,
    private configService: ConfigService,
    private localStorageSvc: LocalStorageService,
    private alertService: AlertService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.executeValidations();
    this.localStorageSvc.init();
  }

  ngOnDestroy(): void {
    this.splashSubscription?.unsubscribe();
  }

  executeValidations() {
    this.splashSubscription = forkJoin(
      {
        connection: this.getIsConnected(),
        remoteVersion: this.getRemoteVersion(),
        mintime: timer(2000)
      }
    ).subscribe(
      response => {
        const version = (this.platform.is('android') ? environment.APPVERSION_ANDROID : environment.APPVERSION_IOS);
        this.internetConnectionService.setIsConnected(response.connection.connected);
        this.runValidations(response.connection.connected, version, response.remoteVersion);
      }
    )
  }

  getIsConnected() {
    return this.internetConnectionService.getNetworkStatus();
  }

  /** Pendiente : Obtener la ultima version registrada */
  getRemoteVersion(): Observable<Array<IVersionResponse>> {
    return this.configService.getRemoteLastVersion()
  }

  runValidations(connected: boolean, appVersion: string, versions: Array<IVersionResponse>) {
    const testVersion =  this.platform.is('android') ? versions.filter(x => x.id === 7) : versions.filter(x => x.id === 9);
    const productionVersion = this.platform.is('android') ? versions.filter(x => x.id === 4) : versions.filter(x => x.id === 6);


    if (!connected) {
      this.hideSplash();
      this.alertService.showAlert('no_wifi.svg', '¡Sin conexión a internet!', `Es posible que no pueda utilizar ciertas funcionalidades.`);
      return;
    }

    if (testVersion && productionVersion && appVersion !== testVersion[0].version && appVersion !== productionVersion[0].version) {
      this.isUpgradeAvailable = true;
      this.alertService.showAlert('aracne3_vertical.svg', 'Actualización!', 'Existe una nueva versión disponible.\r\ Consigue las nuevas características, actualizando desde la tienda de Aplicaciones.');
      return;
    }

    this.hideSplash();
  }

  hideSplash() {
    this.store.dispatch(splashAction.stopSplash());
  }
}
