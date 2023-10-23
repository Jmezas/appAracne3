import { Injectable } from '@angular/core';

import { ToastController } from '@ionic/angular';
import { TYPE_TOAST } from '../../shared/models/toast.interface';



@Injectable({
  providedIn: 'root'
})
export class ToastAlertService {

  constructor(public toastController: ToastController) {}

  async danger(message: string, icon?: string) {
    const toast = await this.toastController.create(this.getConfigToast(message, TYPE_TOAST.danger, icon));
    toast.present();
  }

  async success(message: string, icon?: string,) {
    const toast = await this.toastController.create(this.getConfigToast(message, TYPE_TOAST.success, icon));
    toast.present();
  }

  async warning(message: string, icon?: string) {
    const toast = await this.toastController.create(this.getConfigToast(message, TYPE_TOAST.warning, icon));
    toast.present();
  }

  async dark(message: string, icon?: string) {
    const toast = await this.toastController.create(this.getConfigToast(message,TYPE_TOAST.dark, icon));
    toast.present();
  }

  private getConfigToast(message: string, type:any, icon: string) {
    return { message, color: type, icon, duration: 2500};
  }

}
