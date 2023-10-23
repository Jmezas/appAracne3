import { Injectable } from '@angular/core';
import { DatabaseAppService } from './database-app.service';
import { MenuApp } from '../../shared/models/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class TableMenuService {

  constructor(private databaseAppServices: DatabaseAppService) { }

  async createLateralMenuTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppServices.dbObject.executeSql('CREATE TABLE IF NOT EXISTS LATERAL_MENU (' +
      'LateralMenuDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', LateralMenuId INTEGER NOT NULL' +
      ', CampaignId INTEGER NOT NULL' +
      ', RoleId INTEGER NOT NULL' +
      ', ModuleId INTEGER NOT NULL' +
      ', WorkdayReportAssign INTEGER' +
      ', GalleryAccess INTEGER' +
      ', Module TEXT' +
      ', OrderNumber INTEGER' +
      ', Icon TEXT' +
      ', Route TEXT' +
      ')', [])
      .then(() => result = true)
      .catch(error => console.log('ERROR CREATE TABLE LATERAL_MENU', error));
    return result;
  }

  async addLateralMenuCollection(request: Array<MenuApp>): Promise<boolean> {
    const updateHeader = 'UPDATE LATERAL_MENU SET WorkdayReportAssign = ?, GalleryAccess = ?, Module = ?, OrderNumber = ?, Icon = ?, Route = ?' +
      ' WHERE LateralMenuId = ? AND CampaignId = ? AND RoleId = ? AND ModuleId = ?';

    const updateValues = request.reduce((prev, curr) => {
      prev.push([(curr.asignarJornadasReporte ? 1 : 0), (curr.accesoGaleria ? 1 : 0), curr.modulo, curr.orden,
      (curr.icono ? curr.icono : ''), curr.route, curr.id, curr.idCampania, curr.idRol, curr.idModulo]);
      return prev;
    }, []);

    if (updateValues.length > 0) {
      await this.databaseAppServices.dbObject.transaction((tx) => {
        updateValues.forEach((item) => {
          tx.executeSql(updateHeader, item);
        })
      });
    } 

    const insertHeader = 'INSERT INTO LATERAL_MENU (LateralMenuId,CampaignId,RoleId,ModuleId,WorkdayReportAssign,GalleryAccess,Module,OrderNumber,Icon,Route)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM LATERAL_MENU WHERE LateralMenuId = ? AND CampaignId = ? AND RoleId = ? AND ModuleId = ?)';

    const insertValues = request.reduce((prev, curr) => {
      prev.push([curr.id, curr.idCampania, curr.idRol, curr.idModulo, (curr.asignarJornadasReporte ? 1 : 0), (curr.accesoGaleria ? 1 : 0),
      curr.modulo, curr.orden, (curr.icono ? curr.icono : ''), curr.route, curr.id, curr.idCampania, curr.idRol, curr.idModulo]);
      return prev;
    }, []);
 
    if (insertValues.length > 0) {
      await this.databaseAppServices.dbObject.transaction((tx) => {
        insertValues.forEach((item) => {
          tx.executeSql(insertHeader, item);
        })
      });
    } 

    const deleteValues = request.reduce((prev, curr) => {
      prev.push([curr.id]);
      return prev;
    }, []);
    
    const deleteHeader = `DELETE FROM LATERAL_MENU WHERE LateralMenuId NOT IN (${deleteValues.toString()})`;
 
    if (deleteValues.length > 0) {
      await this.databaseAppServices.dbObject.executeSql(deleteHeader, []);
    }

    return true;
  }

  async getLateralMenuColllection(campaignId: number, roleId: number): Promise<Array<MenuApp>> {
    let response: Array<MenuApp> = [];
    const sentenceSQL = 'SELECT * FROM LATERAL_MENU WHERE CampaignId = ? AND RoleId = ?';
    const valueSQL = [campaignId, roleId];

    return new Promise(async (resolve, reject) => {
      await this.databaseAppServices.dbObject.executeSql(sentenceSQL, valueSQL)
        .then(async (data) => {
          response = await this.preparedLateralMenuColllection(data);
        })
        .catch(error => console.log('ERROR SELECT TABLE LATERAL_MENU', error))

      resolve(response);
    });
  }

  async preparedLateralMenuColllection(data: any): Promise<Array<MenuApp>> {
    return new Promise<Array<MenuApp>>((resolve, reject) => {
      let collection: Array<MenuApp> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          collection.push({
            id: data.rows.item(index).LateralMenuId,
            idCampania: data.rows.item(index).CampaignId,
            idRol: data.rows.item(index).RoleId,
            idModulo: data.rows.item(index).ModuleId,
            asignarJornadasReporte: (data.rows.item(index).WorkdayReportAssign === 1 ? true : false),
            accesoGaleria: (data.rows.item(index).GalleryAccess === 1 ? true : false),
            modulo: data.rows.item(index).Module,
            orden: data.rows.item(index).OrderNumber,
            icono: data.rows.item(index).Icon,
            route: data.rows.item(index).Route
          });
        }
      }

      resolve(collection);
    });
  }
}
