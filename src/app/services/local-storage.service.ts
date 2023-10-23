import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'
import { LOCAL_DB_NAMES } from '../shared/constants/values.constants';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private _storage: Storage | null = null;
  private _storageUnification: Storage = null;
  private _storageDefault: Storage = null;

  constructor() {
  }

  public async init() {
    // Creamos la bd "database-name" por defecto
    this._storageDefault = new Storage({
      name: LOCAL_DB_NAMES.DEFAULT
    })
    await this._storageDefault.create();

    // Creamos la bd "UNIFICATIONS"
    // this._storageUnification = new Storage({
    //   name: LOCAL_DB_NAMES.UNIFICATION
    // })
    // await this._storageUnification.create();
  }



  // Create and expose methods that users of this service can
  // call, for example:
  public setData(key: string, value: any, localDB?: string) {
    this.selectLocalDB(localDB);
    this._storage?.set(key, value);
  }

  public async  getData(key: string, localDB?: string) {
    this.selectLocalDB(localDB);
    const data = await this._storage?.get(key);
    return data;
  }

  public async removeData(key: string, localDB?: string) {
    this.selectLocalDB(localDB);
    await this._storage.remove(key);
  }

  public async removeAllByDB(localDB: string) {
    this.selectLocalDB(localDB);
    await this._storage.clear();
  }

  public async removeAll() {
    await this._storageDefault.clear();
    // await this._storageUnification.clear();
  }

  private selectLocalDB(localDB) {
    switch (localDB) {
      case LOCAL_DB_NAMES.UNIFICATION: return this.useUnificationDB();
      default: return this.useDefaultDB();
    }
  }

  /**GET DATABASES */
  private useUnificationDB() {
    this._storage = this._storageUnification;
  }
  
  private useDefaultDB() {
    this._storage = this._storageDefault;
  }
}
