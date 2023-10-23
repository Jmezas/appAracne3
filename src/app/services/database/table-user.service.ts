import { Injectable } from '@angular/core';

import { DatabaseAppService } from './database-app.service';

import { UserData } from '../../shared/models/user.interface';
import { AppUserConfig } from '../../shared/models/appUserConfig.interface';

@Injectable({
  providedIn: 'root'
})
export class TableUserService {
  resultOfTable: boolean = false;

  constructor(private databaseAppService: DatabaseAppService) { }

  // Configuraciones del Usuario en la Aplicación
  async createTableAppUserConfig() {
    let result: boolean = false;

    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS APP_CONFIG (' +
      'AppConfigDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', UserId INTEGER NOT NULL' +
      ', CampaignId INTERGET NOT NULL' +
      ', Key INTEGER NOT NULL' +
      ', Value INTEGER' +
      ', ValueObject TEXT' +
      ')', [])
      .then(() => result = true)
      .catch(error => { });

    return result;
  }

  async addAppUserConfig(appConfig: AppUserConfig): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.databaseAppService.dbObject.executeSql(
        `UPDATE APP_CONFIG SET Value = ${(appConfig.value ? 1 : 0)}, ValueObject = '${appConfig.valueObject}' WHERE UserId = ? AND CampaignId = ? AND Key = ?`,
        [appConfig.userId, appConfig.campaignId, appConfig.key]
      );

      const data = [appConfig.userId, appConfig.campaignId, appConfig.key, (appConfig.value ? 1 : 0),
        ((appConfig.valueObject !== undefined && appConfig.valueObject !== null ? appConfig.valueObject : '')),
        appConfig.userId, appConfig.campaignId, appConfig.key]; 

      this.databaseAppService.dbObject.executeSql('INSERT INTO APP_CONFIG (UserId, CampaignId, Key, Value, ValueObject) ' +
        'SELECT ?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM APP_CONFIG WHERE UserId = ? AND CampaignId = ? AND Key = ?)', data); 

      resolve(true);
    })
  }

  getAppUserConfigCollection(userId: number, campaignId: number, key: number = null): Promise<Array<AppUserConfig>> {
    return new Promise((resolve, reject) => {
      this.databaseAppService.dbObject.executeSql(`SELECT * FROM APP_CONFIG WHERE UserId = ${userId} AND CampaignId = ${campaignId} ${(key !== null ? `AND Key = ${key}` : '')}`, [])
        .then(data => {
          let configCollection: Array<AppUserConfig> = [];

          if (data.rows.length > 0) {
            for (let index = 0; index < data.rows.length; index++) {
              configCollection.push({
                userId: data.rows.item(index).UserId,
                campaignId: data.rows.item(index).CampaignId,
                key: data.rows.item(index).Key,
                value: (data.rows.item(index).Value == 1 ? true : false),
                valueObject: data.rows.item(index).ValueObject
              });
            }
          }

          resolve(configCollection);
        })
        .catch(error => {
          resolve([]);
        });
    })
  }

  deleteAppUserConfig(userId: number, campaignId: number, keys: number[] = []): Promise<boolean> {
    const keyConditional: string = (keys.length > 0 ? `AND Key IN (${keys.join(',')})`: '');

    return new Promise((resolve, reject) => {
      this.databaseAppService.dbObject.executeSql(`DELETE FROM APP_CONFIG WHERE UserId = ${userId} AND CampaignId = ${campaignId} ${keyConditional}`, [])
        .then(() => resolve(true))
        .catch(error => {
          resolve(false);
        });
    });
  }

  // Datos de Usuarios
  async createTable() {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS USER (' +
      'UserDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', UserId INTEGER NOT NULL' +
      ', FullName TEXT' +
      ', User TEXT' +
      ', RoleId INTEGER' +
      ', Role TEXT' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false
      });

    return this.resultOfTable;
  }

  addUserCollection(users: Array<UserData>) {
    users.forEach((item) => {
      const data = [item.IdUsuario, item.NombreCompleto, item.Usuario, item.IdRol, item.Rol, item.IdUsuario];
      this.databaseAppService.dbObject.executeSql('INSERT INTO USER (UserId, FullName, User, RoleId, Role) ' +
        'SELECT ?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM USER WHERE UserId = ?)', data);
    });
  }

  getUserCollection(): Promise<Array<UserData>> {
    return this.databaseAppService.dbObject.executeSql('SELECT * FROM USER', [])
      .then(data => {
        let userCollection: UserData[] = [];

        if (data.rows.length > 0) {
          for (let index = 0; index < data.rows.length; index++) {
            userCollection.push({
              IdUsuario: data.rows.item(index).UserId,
              NombreCompleto: data.rows.item(index).FullName,
              Usuario: data.rows.item(index).User,
              IdRol: data.rows.item(index).RoleId,
              Rol: data.rows.item(index).Role
            });
          }
        }

        return userCollection;
      })
      .catch(error => {
        return [];
      });
  }
}
