import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';

import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import * as rolesAction from 'src/app/store/actions/roles.action';
import { Router } from '@angular/router';
import { IResponseCampaignsRolesPA } from 'src/app/shared/models/roles.interface';

const MasterRolesKey:string = 'Master_roles'

@Injectable({
  providedIn: 'root',
})
export class RolesStoreService {

  constructor(
    private localStorageSvc: LocalStorageService,
    private store: Store<AppState>,
    private router: Router
  ) {
  }

  setRoles(rolesItems: Array<IResponseCampaignsRolesPA>) {
    
    this.localStorageSvc.setData(MasterRolesKey, rolesItems);
    this.store.dispatch(
        rolesAction.setMasterRoles({rolesItems})
      );
  }

  async getStoreRoles() {
    let rolesItems = null;
    const subs =  await this.store.select('rolesMaster').subscribe( roles => rolesItems = roles.rolesItems );
    if(!rolesItems) {
        rolesItems = await this.localStorageSvc.getData(MasterRolesKey);
        if(rolesItems) {
            this.setRoles(rolesItems);
        }else {
            console.log("ERROR OBTENIENDO ROLES MASTER");
        }
    }
    subs.unsubscribe();
    return  rolesItems;
  }

  async getRolById(roleId: number) {
    const roles: Array<IResponseCampaignsRolesPA> = await this.getStoreRoles();
    return roles.find( rol => rol.IdRol == roleId);
  }
}
