import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { IItemCampaign } from 'src/app/shared/models/campaing.interface';

const TABLE_NAME = "CampaignModel";

@Injectable({
  providedIn: 'root'
})
export class CampaignModelTable {
  resultOfTable: boolean = false;

  constructor() { }

  async createTable(dbObject: SQLiteObject): Promise<boolean> {
    await dbObject.executeSql(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (` +
      'localCampaignId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', idLineaNegocio INTEGER' +
      ', idCampania TEXT' +
      ', campania TEXT' +
      ', idRol TEXT' +
      ', rol TEXT' +
      ', paisCampania TEXT' +
      ', OnLine TEXT' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        console.error(`TABLE ${TABLE_NAME} ERROR :` + JSON.stringify(error));
        this.resultOfTable = false
      });

    return this.resultOfTable;
  }

  async addCampaignsModel(dbObject: SQLiteObject ,r: IItemCampaign): Promise<boolean> {
    const data = [r.idLineaNegocio, r.idCampania, r.campania, r.idRol, r.rol, r.paisCampania, r.online]
    await dbObject.executeSql(`INSERT INTO ${TABLE_NAME} (idLineaNegocio, idCampania, campania, idRol, rol, paisCampania, OnLine ) VALUES (?,?,?,?,?,?,?)`, data)
      .then(() => this.resultOfTable = true)
      .catch(error => {
        console.log(`TABLE ${TABLE_NAME} ADD ERROR : ` + JSON.stringify(error));
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

}
