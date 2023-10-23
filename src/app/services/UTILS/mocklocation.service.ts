import { Injectable } from '@angular/core';
import { DeviceService } from './device.service';
declare var window;

@Injectable({
  providedIn: 'root'
})
export class MockLocationService {
  constructor(
    private deviceService: DeviceService
  ) { }

  getAllAplicationsAndroid = (_this: any) => {
    if (!this.deviceService.isPlatformMobile()) {
      return;
    }

    _this.platform.ready().then(() => {
      window.plugins.packagemanager.show(true,
        (list) => console.log("RESULT APP LIST ::: "),
        error => console.log("=========> ERROR : ", error)
      )
    })
  }
}
