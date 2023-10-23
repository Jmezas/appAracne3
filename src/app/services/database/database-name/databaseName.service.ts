import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { CampaignModelTable } from './CampaingModel.table';

import { BehaviorSubject, Observable } from 'rxjs';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

const DATABASE_NAME = 'database-name';

@Injectable({
  providedIn: 'root',
})
export class DatabaseNameService {
  resultOfTable: boolean = false;
  dbObject: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public campaingModelTable = new CampaignModelTable();

  constructor(
    private platform: Platform,
    private sqlite: SQLite
  ) { }

  createDatabaseName(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.platform.ready()
        .then(async () => {
          await this.sqlite.create({
            name: DATABASE_NAME,
            location: 'default',
          }).then((db: SQLiteObject) => {
            this.dbObject = db;
            this.dbReady.next(true);
            resolve(true);
          }).catch(error => {
            console.log('ERROR CREANDO BD : ', error);
            resolve(false);
          });
        });
    });
  }

  getDatabaseNameState(): Observable<boolean> {
    return this.dbReady.asObservable();
  }


  async createDatabaseNameTables() {
    await this.campaingModelTable.createTable(this.dbObject);
  }

}
