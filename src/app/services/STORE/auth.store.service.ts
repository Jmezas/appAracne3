import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import * as authAction from '../../store/actions/auth.action';
import { removeActiveCampaign } from '../../store/actions/campaing.action';

import { JwtService } from '../UTILS/jwt.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { GenericStoreService } from './store.service';

import { IUserToken } from '../../shared/models/user.interface';
import { User } from '../../shared/models/user.model';

const userKey: string = 'USER';
const userToken: string = 'TOKEN';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceStore {
  constructor(
    public jwtService: JwtService,
    private router: Router,
    private localStorageSvc: LocalStorageService,
    private store: Store<AppState>,
    private storeService: GenericStoreService
  ) { }

  async storeUserAuthData(userDataToken: IUserToken) {
    const decodeToken = await this.jwtService.decodeToken(userDataToken.token);

    if (!decodeToken) {
      this.setActiveUser(null);
      this.setActiveToken(null);
      return null;
    }
    const userModel: User = {
      nombre: decodeToken.NombreCompleto,
      role: null,
      token: userDataToken.token,
      uid: decodeToken.IdUsuario
    }

    this.setActiveUser(userModel);
    this.setActiveToken(userDataToken);
    return userModel;
  }

  public async closeSession() {
    // Eliminamos todo lo que tengamos en memoria
    await this.localStorageSvc.removeAll();

    this.store.dispatch(authAction.unsetActiveUser());
    this.store.dispatch(authAction.unsetActiveToken());
    this.store.dispatch(removeActiveCampaign());

    this.router.navigate(['/login']);
  }

  public async getAuthToken() {
    let user = await this.getActiveUser();
    if (!user?.token) return null;
    return user.token
  }

  public setActiveUser(userModel) {
    this.store.dispatch(authAction.setActiveUser({ user: userModel }));
    this.localStorageSvc.setData(userKey, userModel);
  }

  public async getActiveUser(): Promise<User> {
    let userAuth: User = null;

    return new Promise(async (resolve, reject) => {
      const authSubscription = this.store.select('auth').subscribe(async ({ user }) => {
        userAuth = user;

        if (!userAuth) {
          userAuth = await this.localStorageSvc.getData(userKey);

          if (userAuth) {
            this.store.dispatch(authAction.setActiveUser({ user: userAuth }));
          }
        }

        setTimeout(() => { authSubscription?.unsubscribe(); }, 250);

        resolve(userAuth);
      });
    });
  }

  public setActiveToken(token: IUserToken) {
    this.store.dispatch(authAction.setActiveToken({ userToken: token }));
    this.localStorageSvc.setData(userToken, token);
  }

  public async getActiveToken() {
    let activeToken: IUserToken;

    const tokenSubs = await this.store.select('auth').subscribe(auth => activeToken = auth.token);

    if (!activeToken) {
      activeToken = await this.storeService.getLocalData(authAction.setActiveToken, { activeToken }, userToken);
    }

    setTimeout(() => { tokenSubs?.unsubscribe(); }, 250); 

    return activeToken;
  }
}
