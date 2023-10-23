import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import * as menuAction from '../../store/actions/menu.action';

import { LocalStorageService } from '../local-storage.service';
import { IMenuItem } from 'src/app/shared/models/menu.interface';
import { GenericStoreService } from './store.service';

const menuLateralKey: string = 'Menu_lateral';
const selectedModuleKey: string = 'Active_Module';

@Injectable({
  providedIn: 'root',
})
export class SideMenuStore {

  constructor(
    private store: Store<AppState>,
    private genericStoreService: GenericStoreService
  ) {
  }

  /** GUARDAR MODULOS DE MENU PARA OFFLINE */
  async getSideMenu() {
    let listMenuLateral: Array<IMenuItem>;
    await this.store.select('sideMenu').subscribe( sideMenu => listMenuLateral = sideMenu.menuItems);
    if (!listMenuLateral) {
      const fn = menuAction.populateMenuAction;
      listMenuLateral = await this.genericStoreService.getLocalData(fn, { menuItems: listMenuLateral }, menuLateralKey);
    }
    return listMenuLateral;
  }

  setMenuLateral(lsItemsMenu: Array<IMenuItem>) {
    const fn = menuAction.populateMenuAction;
    this.genericStoreService.setLocalData(fn, {menuItems : lsItemsMenu }, menuLateralKey);
  }

  /* GUARDAR EL MODULO SELECCIONADO DESDE EL MENU LATERAL */

  async getSelectedModule() {
    let module: IMenuItem;
    await this.store.select('sideMenu').subscribe( sideMenu => module = sideMenu.selectedModule);
    if (!module) {
      const fn = menuAction.selectedModule;
      module = await this.genericStoreService.getLocalData(fn, { selectedModule: module }, selectedModuleKey);
    }
    return module;
  }

  setSelectedModule(module: IMenuItem) {
    const fn = menuAction.selectedModule;
    this.genericStoreService.setLocalData(fn, {selectedModule : module }, selectedModuleKey);
  }

}
