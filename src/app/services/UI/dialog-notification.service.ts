import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DialogNotificationService {

  constructor(
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  async showAlert(icon: string = null, header: string, message: string) {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header,
      message,
      id: 'aracneFormAlert',
      buttons: [
        {
          text: 'Notificaciones',
          cssClass: 'alert_button_aracne',
          role: 'confirm',
          handler: () => {
            document.getElementById("aracneFormAlert").remove();
            //this.router.navigate(['/main/notificaciones']);
          },
        }
      ],
      backdropDismiss: true
    });

    if (icon !== null) {
      const alertElement = await alert;
      const alertIconHtml = document.createElement("img");
      alertIconHtml.src = `../../../assets/svg/${icon}`;
      alertIconHtml.style.maxWidth = '75px';
      alertIconHtml.style.marginTop = '1rem';

      const wrapperElement: HTMLElement = alertElement.querySelector('.alert-wrapper');
      wrapperElement.insertBefore(alertIconHtml, wrapperElement.firstChild);
      wrapperElement.setAttribute('style', 'align-items: center;');
    }

    alert.present();
  }
}
