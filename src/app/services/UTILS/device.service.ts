
import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(
    private platform: Platform
  ) { }

  isPlatformMobile = () => this.platform.is('ios') || this.platform.is('android');
  
  typePlatformMobile(): string {
    return (this.platform.is('ios') ? 'ios' :'android');
  }
}
