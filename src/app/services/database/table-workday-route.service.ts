import { Injectable } from '@angular/core';

import { DatabaseAppService } from './database-app.service';

import { Rutas, PdvsJornada } from '../../shared/models/jornada.interface';

@Injectable({
  providedIn: 'root'
})
export class TableWorkdayRouteService {

  constructor(private databaseAppServices: DatabaseAppService) { }

  async createWorkdayRouteTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppServices.dbObject.executeSql('CREATE TABLE IF NOT EXISTS WORKDAYROUTE_LIST (' +
      'WorkdayRouteListDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', RouteId INTEGER NOT NULL' +
      ', WorkDayId INTEGER NOT NULL' +
      ', RouteTypeId INTEGER' +
      ', RouteTypeName TEXT' +
      ', UserId INTEGER' +
      ', RouteName TEXT' +
      ', WorkDayDate TEXT' +
      ', StartTime TEXT' +
      ', EndTime TEXT' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => result = true)
      .catch(error => {
        result = false;
        console.log('ERROR CREATE TABLE WORKDAYROUTE_LIST', error)
      });
    return result;
  }

  async createWorkdayRouteSalespointTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppServices.dbObject.executeSql('CREATE TABLE IF NOT EXISTS WORKDAYROUTE_SALESPOINT (' +
      'WorkdayRouteSalespointDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', RouteId INTEGER NOT NULL' +
      ', SalespointId INTEGER NOT NULL' +
      ', WorkDayId INTEGER NOT NULL' +
      ', SalespointName TEXT NOT NULL' +
      ', Address TEXT' +
      ', SalespointCode TEXT' +
      ', VisitOrder TEXT' +
      ', Latitude TEXT' +
      ', Longitude TEXT' +
      ', Distance INTEGER' +
      ', Active INTEGER' +
      ', IsComplete INTEGER' +
      ', CampaignId INTEGER' +
      ', CancellationReasonId INTEGER' +
      ')', [])
      .then(() => result = true)
      .catch(error => {
        result = false;
        console.log('ERROR CREATE TABLE WORKDAYROUTE_SALESPOINT', error)
      });
    return result;
  }

  async addWorkdayRouteCollection(request: Array<Rutas>, campaignId: number): Promise<boolean> {
    const header = 'INSERT INTO WORKDAYROUTE_LIST (RouteId,WorkDayId,RouteTypeId,RouteTypeName,UserId,RouteName,WorkDayDate,StartTime,EndTime,CampaignId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM WORKDAYROUTE_LIST WHERE RouteId = ? AND WorkDayId = ? AND RouteTypeId = ? AND CampaignId = ?)'

    const values = request.reduce((prev, curr) => {
      prev.push([curr.idRuta, curr.idJornada, curr.idTipoRuta, curr.tipoRuta, curr.idUsuario, curr.nombreRuta, curr.fechaJornada, curr.horaEntrada, curr.horaSalida, campaignId,
      curr.idRuta, curr.idJornada, curr.idTipoRuta, campaignId]);
      return prev;
    }, []);

    if (values.length > 0) {
      await this.databaseAppServices.dbObject.transaction((tx) => {
        values.forEach((item) => {
          tx.executeSql(header, item);
        })
      });
    }

    return true;
  }

  async addWorkdayRouteSalespointCollection(request: Array<PdvsJornada>, campaignId: number): Promise<boolean> {
    const header = 'INSERT INTO WORKDAYROUTE_SALESPOINT (RouteId,SalespointId,WorkDayId,SalespointName,Address,SalespointCode,VisitOrder,Latitude,Longitude,Distance,Active,IsComplete,CampaignId, CancellationReasonId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM WORKDAYROUTE_SALESPOINT WHERE RouteId = ? AND SalespointId = ? AND WorkDayId = ? AND CampaignId = ?)';

    const headerUpdate = 'UPDATE WORKDAYROUTE_SALESPOINT SET SalespointName = ?, Address = ?, VisitOrder = ?, Latitude = ?, Longitude = ?, Distance = ?, IsComplete = ?,CancellationReasonId = ?' +
      ' WHERE RouteId = ? AND SalespointId = ? AND WorkDayId = ?  AND CampaignId = ?';

    const values = request.reduce((prev, curr) => {
      prev.push([curr.idRuta, curr.idPdv, curr.idJornada, curr.nombrePdv, curr.direccion, curr.codigoPdv, curr.ordenVisita, curr.latitud, curr.longitud, curr.distancia,
      (curr.activo ? 1 : 0), curr.asistenciaCompleta, campaignId, curr.idMotivoCancelacion,
      curr.idRuta, curr.idPdv, curr.idJornada, campaignId]);
      return prev;
    }, []);

    const valuesUpdate = request.reduce((prev, curr) => {
      prev.push([curr.nombrePdv, curr.direccion, curr.ordenVisita, curr.latitud, curr.longitud, curr.distancia, curr.asistenciaCompleta,curr.idMotivoCancelacion,
      curr.idRuta, curr.idPdv, curr.idJornada, campaignId]);
      return prev;
    }, []);

    if (values.length > 0) {
      await this.databaseAppServices.dbObject.transaction((tx) => {
        values.forEach((item) => {
          tx.executeSql(header, item);
        })
      });
    }

    if (valuesUpdate.length > 0) {
      await this.databaseAppServices.dbObject.transaction((tx) => {
        valuesUpdate.forEach((item) => {
          tx.executeSql(headerUpdate, item);
        })
      });
    }
    return true;
  }

  async getWorkdayRouteCollection(campaignId: number, userId: number): Promise<Array<Rutas>> {
    let response: Array<Rutas> = [];
    let responsePdv: Array<PdvsJornada> = [];

    const sentenceRouteSQL: string = 'SELECT * FROM WORKDAYROUTE_LIST WHERE UserId = ? AND CampaignId = ?';
    const sentencePdvSQL: string = 'SELECT * FROM WORKDAYROUTE_SALESPOINT WHERE CampaignId = ?';

    return new Promise(async (resolve, reject) => {
      await this.databaseAppServices.dbObject.executeSql(sentenceRouteSQL, [userId, campaignId])
        .then(async (data) => {
          response = await this.preparedWorkdayRouteCollection(data);
        })
        .catch(error => console.log('ERROR SELECT TABLE WORKDAYROUTE_LIST', error));

      await this.databaseAppServices.dbObject.executeSql(sentencePdvSQL, [campaignId])
        .then(async (data) => {
          responsePdv = await this.preparedWorkdayRouteSalespointCollection(data);
          response = response.map(x => ({ ...x, pdvsJornada: responsePdv.filter(y => y.idRuta === x.idRuta && y.idJornada === x.idJornada) }));
        });

      resolve(response);
    });
  }

  async preparedWorkdayRouteCollection(data: any): Promise<Array<Rutas>> {
    return new Promise<Array<Rutas>>((resolve, reject) => {
      let collection: Array<Rutas> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          collection.push({
            idRuta: data.rows.item(index).RouteId,
            idJornada: data.rows.item(index).WorkDayId,
            idTipoRuta: data.rows.item(index).RouteTypeId,
            tipoRuta: data.rows.item(index).RouteTypeName,
            idUsuario: data.rows.item(index).UserId,
            nombreRuta: data.rows.item(index).RouteName,
            fechaJornada: data.rows.item(index).WorkDayDate,
            horaEntrada: data.rows.item(index).StartTime,
            horaSalida: data.rows.item(index).EndTime,
            pdvsJornada: []
          });
        }
      }

      resolve(collection);
    });
  }

  async preparedWorkdayRouteSalespointCollection(data: any): Promise<Array<PdvsJornada>> {
    return new Promise((resolve, reject) => {
      let collection: Array<PdvsJornada> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          collection.push({
            idRuta: data.rows.item(index).RouteId,
            idPdv: data.rows.item(index).SalespointId,
            idJornada: data.rows.item(index).WorkDayId,
            nombrePdv: data.rows.item(index).SalespointName,
            direccion: data.rows.item(index).Address,
            codigoPdv: data.rows.item(index).SalespointCode,
            ordenVisita: data.rows.item(index).VisitOrder,
            latitud: data.rows.item(index).Latitude,
            longitud: data.rows.item(index).Longitude,
            distancia: data.rows.item(index).Distance,
            activo: (data.rows.item(index).Active === 1 ? true : false),
            asistenciaCompleta: data.rows.item(index).IsComplete,
            idMotivoCancelacion: data.rows.item(index).CancellationReasonId
          })
        }
      }

      resolve(collection);
    });
  }
}
