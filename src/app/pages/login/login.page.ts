import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { AuthServiceAPI } from '../../services/API/auth.api.service';
import { InternetConnectionService } from '../../services/internet-connection.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  aracne_logo: string = 'assets/svg/aracne3_login.svg';
  background: string = 'assets/svg/background_login.png';
  passwordMode: string = 'password';
  show_password_icon: string = 'eye-outline';
  loading: boolean = false;
  process_login: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private autService: AuthServiceAPI,
    private router: Router,
    private alertCtrl: AlertController,
    private internetService: InternetConnectionService
  ) { }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
      readPrivacityPolicy: [false, [Validators.required]],
      acceptPrivacityPolicy: [false, [Validators.required]]
    });
  }

  showPassword() {
    this.passwordMode = (this.passwordMode == 'password' ? 'text' : 'password');
    this.show_password_icon = (this.show_password_icon == 'eye-outline' ? 'eye-off-outline' : 'eye-outline');
  }

  async signIn() {
    this.loading = true;

    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      this.showAlert('no_wifi.svg', '¡Sin conexión a internet!', `Por favor, verificar su conexión.`);
      return;
    }

    this.process_login = 'Validando credenciales';

    const { usuario, password } = this.loginForm.value;
    const body = { "usuario": usuario, "password": password }

    const loginSubs = this.autService.apiSignIn(body).subscribe(
      response => {
        if (response.token != null || response.refreshTokenExpirationTime != null) {
          setTimeout(() => {
            this.process_login = 'Cargando datos';
            setTimeout(() => {
              this.router.navigate(['/campaing']);
              this.process_login = '';
              this.loading = false;
              loginSubs?.unsubscribe();
            }, 500);
          }, 1000);
        } else {
          this.showAlert(null, 'Datos incorrectos', 'Las credenciales ingresadas no son correctas. Por favor, intentar nuevamente.');
          setTimeout(() => { loginSubs?.unsubscribe(), 500 });
        }
      },
      error => {
        this.showAlert(null, 'Ocurrió un error', 'No se pudo completar la autenticación. Por favor, intentar nuevamente.');
        setTimeout(() => { loginSubs?.unsubscribe(), 500 });
      }
    );
  }

  async showAlert(icon: string, header: string, message: string) {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header,
      message,
      id: 'aracneAlert',
      buttons: [
        {
          text: 'Aceptar',
          cssClass: 'alert_button_aracne',
          role: 'confirm',
          handler: () => {
            this.loading = false;
            document.getElementById("aracneAlert").remove();
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
