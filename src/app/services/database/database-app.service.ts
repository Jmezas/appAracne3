import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { DeviceService } from '../UTILS/device.service';

import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseAppService {
  dbObject: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private deviceService: DeviceService
  ) { }

  createDatabase(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (this.deviceService.isPlatformMobile()) {
        await this.platform.ready()
          .then(async () => {
            await this.sqlite.create({
              name: 'Aracne.db',
              location: 'default'
            }).then((db: SQLiteObject) => {
              this.dbObject = db;
              this.dbReady.next(true);
              resolve(true);
            }).catch(error => {
              console.log('ERROR CREANDO BD : ', error);
              resolve(false);
            });
          });
      } else {
        console.log('ERROR CREANDO BD : Dispositivo no es movil');
        resolve(false);
      }
    });
  }

  getDatabaseState(): Observable<boolean> {
    return this.dbReady.asObservable();
  }
}
