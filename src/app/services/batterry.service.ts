import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { BatteryStatus } from '@awesome-cordova-plugins/battery-status/ngx';
import { Device } from '@capacitor/device';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BatterryService {

  constructor(
    private platForm: Platform,
    private batteryStatus: BatteryStatus
  ) { }

  async getBatterryStatus(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      if (this.platForm.is('android')) {
        const batterySubs: Subscription = this.batteryStatus.onChange().subscribe(response => {
          batterySubs?.unsubscribe();
          resolve(response.level);
        });
        return;
      }

      if (this.platForm.is('ios')) {
        const batteryInfo = await Device.getBatteryInfo();
        resolve(batteryInfo.batteryLevel);
        return;
      }

      return resolve(0);
    });
  }
}
