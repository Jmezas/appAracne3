import { Injectable } from '@angular/core';

import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
    loading;

    constructor(
        private loadingCtrl: LoadingController
    ){};

    async show(message?: string) {
        message = message ? message : "Cargando ...";
        this.loading = await this.loadingCtrl.create({
            message,
            mode: 'ios'
          });
          
        this.loading.present();
    }

    stop() {
        this.loading?.dismiss();
    }
}
