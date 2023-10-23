import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';

import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class GenericStoreService {
  constructor(
    private localStorageSvc: LocalStorageService,
    private store: Store<AppState>
  ) {}

  setLocalData(
    fn: Function,
    obj: Object,
    tableKey: string,
    storeInDB: boolean = true
  ) {
    if (storeInDB) {
      this.localStorageSvc.setData(tableKey, Object.values(obj)[0]);
    }
    this.store.dispatch(fn(obj));
  }

  async getLocalData(fn: Function, obj: Object, tableKey: string) {
    const localResult = await this.localStorageSvc.getData(tableKey);
    if (localResult) {
      this.setLocalData(fn, obj, tableKey, false);
    }
    return localResult;
  }
}
