import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingCtrlService {
  isLoading: boolean = false;

  constructor(private loadingCtrl: LoadingController) { }

  presentLoading(message?: string) {
    this.isLoading = true;

    const objectLoading = ((message != undefined && message != null && message.trim() != '') ? { message } : {});

    return this.loadingCtrl.create(objectLoading)
      .then(result => {
        result.present().then(() => {
          if (!this.isLoading) {
            result.dismiss();
          }
        })
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss()
  }
}
