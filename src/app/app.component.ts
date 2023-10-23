import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

import { InternetConnectionService } from './services/internet-connection.service';
import { MockLocationService } from './services/UTILS/mocklocation.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  hideSplash = false;
  splashSubcription: Subscription;

  constructor(
    private internetConnectionService: InternetConnectionService,
    private platform: Platform,
    private store: Store<AppState>,
    private mockLocationService: MockLocationService
  ) { }

  async ngOnInit() {
    this.internetConnectionService.startNetworkListener();

    this.platform.pause.subscribe(() => {
      console.log('APP PAUSED');
    });

    this.platform.resume.subscribe(() => {
      console.log('APP RESUMEN');
    });

    this.subscribeSplash();
  }

  ngAfterViewInit(): void {
    this.mockLocationService.getAllAplicationsAndroid(this)
  }

  ngOnDestroy(): void {
    this.internetConnectionService?.endNetworkListener();
    this.splashSubcription?.unsubscribe();
  }

  subscribeSplash() {
    this.splashSubcription = this.store.select('splash').subscribe((splash) => {
      this.hideSplash = splash.stopSplash;
    });
  }
}
