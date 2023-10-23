import { Injectable } from '@angular/core';

import { HttpService } from '../http.service';
import { AuthServiceStore } from '../STORE/auth.store.service';
import { LoadingService } from '../UI/loading.service';
import { AlertService } from '../UI/alert.service';

import { IUserToken } from '../../shared/models/user.interface';

import { switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import * as moment from 'moment';
moment.locale('es');

@Injectable({
  providedIn: 'root',
})
export class AuthServiceAPI {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  currentAccessToken: IUserToken = null;

  constructor(
    private authStore: AuthServiceStore,
    private httpService: HttpService,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {
    this.loadToken();
  }

  async loadToken() {
    const tokenData = await this.authStore.getActiveToken();

    if (tokenData) {
      this.currentAccessToken = tokenData;

      const today = moment().toDate();
      const refreshTokenExpired = moment(tokenData.refreshTokenExpirationTime)['_d'];

      if (refreshTokenExpired < today) {
        this.isAuthenticated.next(false);
        return;
      }

      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  public apiSignIn(credentialBody) {
    this.httpService.setUriAracne3('api/authenticate');
    // this.httpService.setUriAracne3('api/authenticate/test');

    return this.httpService.post(credentialBody).pipe(
      switchMap((response: IUserToken) => {
        return this.storeAuthenticationData(response);
      }),
      tap(_token => {
        if (_token.token == null || _token.refreshTokenExpirationTime == null) {
          this.isAuthenticated.next(false);
        } else {
          this.isAuthenticated.next(true);
        }
      })
    );
  }

  public async refreshToken(): Promise<IUserToken> {
    return new Promise(async (resolve, reject) => {
      await this.authStore.getActiveToken().then(async (token) => {

        if (token) {
          const thisDay: string = moment().format('YYYY-MM-DDTHH:mm:ss');
          const refreshTokenExpired: string = moment(token.refreshTokenExpirationTime).format('YYYY-MM-DDTHH:mm:ss');

          const diferrenceOfDays: number = moment(refreshTokenExpired).diff(moment(thisDay), 'days');
          const diferrenceOfMinutes: number = moment(refreshTokenExpired).diff(moment(thisDay), 'minutes');

          if (diferrenceOfDays > 0 || (diferrenceOfDays === 0 && diferrenceOfMinutes <= 0)) {
            this.resolveExpiredRefreshToken();
            resolve(null);
            return;
          }

          this.httpService.setUriAracne3('api/authenticate/refresh');
          // this.httpService.setUriAracne3('api/authenticate/refresh/test');

          await this.httpService.post(token).toPromise()
            .then(newToken => {
              resolve(newToken);
            })
            .catch(error => {
              this.resolveExpiredRefreshToken();
              resolve(null);
            });
        } else {
          this.resolveExpiredRefreshToken();
          resolve(null);
        }
      });
    });
  }

  resolveExpiredRefreshToken() {
    // Si esta cargando algun loading procedemos a detenerlo
    this.loadingService.stop();
    // Avisamos la sesión expirada y mandamos al login al aceptar
    // No pasamos por el método this.authStore.closeSession() dado que necesitamos mantener la campaña activa
    this.alertService.showAlert(null, 'Sesión expirada', 'Necesita volver a iniciar sesión para poder continuar', '/login');
  }

  storeAuthenticationData(tokenData: IUserToken) {
    this.currentAccessToken = tokenData;
    this.authStore.storeUserAuthData(tokenData);
    // Auditoria de Login, trasladar a Campaña, esto ya lo hace el servicio de auth, validar!
    // this.auditoriaService.registrarAuditoria('81', userModel.uid);
    return of(tokenData);
  }
}
