
import { Injectable } from '@angular/core';
// import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  constructor(
    // private backgroundMode: BackgroundMode
  ) { }

  runTask() {
    // this.backgroundMode.enable();
    // this.backgroundMode.setDefaults()
    // this.backgroundMode.on('activate').subscribe(
    //   result => {
    //     console.log("SEGUNDO PLANO : ", result);
    //   }
    // )
  }
}
