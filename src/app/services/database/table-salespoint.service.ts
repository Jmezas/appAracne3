import { Injectable } from '@angular/core';

import { DatabaseAppService } from './database-app.service';
import { IResponseItemSalePoint } from '../../shared/models/salePoint.interface';

@Injectable({
  providedIn: 'root'
})
export class TableSalespointService {
  resultOfTable: boolean = false;

  constructor(private databaseAppService: DatabaseAppService) { }

  async createTable(): Promise<boolean> {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS SALESPOINT (' +
      'SalespointDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', SalespointId INTEGER' +
      ', CampaignId INTEGER' +
      ', SalespointName TEXT' +
      ', Address TEXT' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false
      });

    return this.resultOfTable;
  }

  async addSalespoint(salespoints: Array<IResponseItemSalePoint>) {
    salespoints.forEach((item, i) => {
      const data = [item.IDPV, item.IdCampaña, item.NombreCentro, item.Direccion, item.IDPV, item.IdCampaña];
      this.databaseAppService.dbObject.executeSql('INSERT INTO SALESPOINT (SalespointId,CampaignId,SalespointName,Address) ' + 
      'SELECT ?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM SALESPOINT WHERE SalespointId = ? AND CampaignId = ?)', data);
    });
  }

  async getSalespoint(): Promise<Array<IResponseItemSalePoint>> {
    return this.databaseAppService.dbObject.executeSql('SELECT * FROM SALESPOINT', [])
      .then(data => {
        let salespointCollection: Array<IResponseItemSalePoint> = [];

        if (data.rows.length > 0) {
          for (let index = 0; index < data.rows.length; index++) {
            salespointCollection.push({
              IDPV: data.rows.item(index).SalespointId,
              IdCampaña: data.rows.item(index).CampaignId,
              NombreCentro: data.rows.item(index).SalespointName,
              Direccion: data.rows.item(index).Address
            });
          }
        }

        return salespointCollection;
      })
      .catch(error => {
        return [];
      });
  }
}
