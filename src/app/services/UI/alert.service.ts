import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  async showAlert(icon: string = null, header: string, message: string, urlReturn?: string) {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header,
      message,
      id: 'aracneFormAlert',
      buttons: [
        {
          text: 'Aceptar',
          cssClass: 'alert_button_aracne',
          role: 'confirm',
          handler: () => {
            document.getElementById("aracneFormAlert").remove();

            if (urlReturn != undefined) {
              this.router.navigate([`${urlReturn}`]);
            }
          },
        }
      ],
      backdropDismiss: false
    });

    alert.present();

    let alertIconHtml = document.createElement("img");
    alertIconHtml.src = `../../../assets/svg/${(icon == null ? 'error_login.svg' : icon)}`;
    alertIconHtml.style.maxWidth = '75px';
    alertIconHtml.style.marginTop = '1rem';

    let alertHtml = document.getElementsByClassName('alert-wrapper')[0];
    alertHtml.insertAdjacentElement('afterbegin', alertIconHtml);
    alertHtml.setAttribute('style', 'align-items: center;');
  }
}
