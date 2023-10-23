import { Injectable } from '@angular/core';

import { DatabaseAppService } from './database-app.service';
import { AssistanceType, AssistanceWorkResponse } from '../../shared/models/assistance.interface';

import * as moment from 'moment';
import { InformationPDV } from 'src/app/shared/models/jornada.interface';

@Injectable({
  providedIn: 'root'
})
export class TableWorkdayAssistanceService {

  constructor(private databaseAppServices: DatabaseAppService) { }

  async createAssistanceTypeTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppServices.dbObject.executeSql('CREATE TABLE IF NOT EXISTS ASSISTANCE_TYPE (' +
      'AssistanceTypeDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', AssistanceTypeId INTEGER NOT NULL' +
      ', AssistanceTypeName TEXT' +
      ', WithObservation INTEGER' +
      ', WithPhoto INTEGER' +
      ', Active INTEGER' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => result = true)
      .catch(error => console.log('ERROR CREATE TABLE WORKDAYROUTE_LIST', error));
    return result;
  }

  async addAssistanceTypeCollection(request: Array<AssistanceType>): Promise<boolean> {
    const header = 'INSERT INTO ASSISTANCE_TYPE (AssistanceTypeId,AssistanceTypeName,WithObservation,WithPhoto,Active,CampaignId)' +
      ' SELECT ?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM ASSISTANCE_TYPE WHERE AssistanceTypeId = ? AND CampaignId = ?)'

    const values = request.reduce((prev, curr) => {
      prev.push([curr.idTipoAsistencia, curr.tipoAsistencia, (curr.observaciones ? 1 : 0), (curr.foto ? 1 : 0), (curr.activo ? 1 : 0), curr.idCampania,
      curr.idTipoAsistencia, curr.idCampania]);
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

  async getAssistanceTypeCollection(campingId: number): Promise<Array<AssistanceType>> {
    let response: Array<AssistanceType> = [];
    const sentenceSQL: string = 'SELECT * FROM ASSISTANCE_TYPE WHERE CampaignId = ?';
    return new Promise(async (resolve, reject) => {
      await this.databaseAppServices.dbObject.executeSql(sentenceSQL, [campingId])
        .then(async (data) => {
          response = await this.preparedAssistanceTypeCollection(data);
        })
        .catch(error => console.log('ERROR SELECT TABLE ASSISTANCE_TYPE', error))

      resolve(response);
    });
  }

  async preparedAssistanceTypeCollection(data: any): Promise<Array<AssistanceType>> {
    return new Promise<Array<AssistanceType>>((resolve, reject) => {
      let collection: Array<AssistanceType> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          collection.push({
            idTipoAsistencia: data.rows.item(index).AssistanceTypeId,
            tipoAsistencia: data.rows.item(index).AssistanceTypeName,
            observaciones: (data.rows.item(index).WithObservation === 1 ? true : false),
            foto: (data.rows.item(index).WithPhoto === 1 ? true : false),
            activo: (data.rows.item(index).Active === 1 ? true : false),
            idCampania: data.rows.item(index).CampaignId
          });
        }
      }

      resolve(collection);
    });
  }

  async createAssistanceWorkdayTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppServices.dbObject.executeSql('CREATE TABLE IF NOT EXISTS ASSISTANCE_WORKDAY (' +
      'AssistanceWorkDayDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', AssistanceWorkDayId INTEGER NOT NULL' +
      ', WorkDayId INTEGER NOT NULL' +
      ', SalespointId INTEGER NOT NULL' +
      ', AssistanceTypeId INTEGER NOT NULL' +
      ', HourDate TEXT' +
      ', Latitude TEXT' +
      ', Longitude TEXT' +
      ', GoogleAddress TEXT' +
      ', Observations TEXT' +
      ', Photo TEXT' +
      ', BatteryLevel INTEGER' +
      ', DistanceSalespoint INTEGER' +
      ', UsCreation INTEGER' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => result = true)
      .catch(error => console.log('ERROR CREATE TABLE ASSISTANCE_WORKDAY', error));
    return result;
  }

  async addAssistanceWorkday(request: Array<AssistanceWorkResponse>): Promise<boolean> {
    const header = 'INSERT INTO ASSISTANCE_WORKDAY (AssistanceWorkDayId,WorkDayId,SalespointId,AssistanceTypeId,HourDate,Latitude,Longitude' +
      ',GoogleAddress,Observations,Photo,BatteryLevel,DistanceSalespoint,UsCreation,CampaignId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM ASSISTANCE_WORKDAY WHERE AssistanceWorkDayId = ? AND WorkDayId = ?' +
      ' AND SalespointId = ? AND AssistanceTypeId = ? AND CampaignId = ?)'

    const values = request.reduce((prev, curr) => {
      prev.push([curr.idAsistenciaJornada, curr.idJornada, curr.idPdv, curr.idTipoAsistencia, moment(curr.fechaHora).format('YYYY-MM-DDThh:mm:ss'),
      curr.latitud, curr.longitud, curr.direccionGoogle, (curr.observaciones ? curr.observaciones : ''), (curr.foto ? curr.foto : ''), curr.nivelBateria,
      curr.distanciaPdv, curr.usCreacion, curr.idCampania, curr.idAsistenciaJornada, curr.idJornada, curr.idPdv, curr.idTipoAsistencia, curr.idCampania]);
      return prev;
    }, []);

    if (values.length > 0) {
      await this.databaseAppServices.dbObject.transaction((tx) => {
        values.forEach((item) => {
          tx.executeSql(header, item);
        });
      });
    }

    return true;
  }

  async getAssistanceWorkday(campaignId: number, workDayId: number, salespointId: number = null): Promise<Array<AssistanceWorkResponse>> {
    let response: Array<AssistanceWorkResponse> = [];
    const sentenceSQL: string = `SELECT * FROM ASSISTANCE_WORKDAY WHERE CampaignId = ? AND WorkDayId = ?${(salespointId ? ' AND SalespointId = ?' : '')}`;
    const valueSQL: Array<number> = (salespointId ? [campaignId, workDayId, salespointId] : [campaignId, workDayId]);

    return new Promise(async (resolve, reject) => {
      await this.databaseAppServices.dbObject.executeSql(sentenceSQL, valueSQL)
        .then(async (data) => {
          response = await this.preparedAssistanceWorkday(data);
        })
        .catch(error => console.log('ERROR SELECT TABLE ASSISTANCE_WORKDAY', error))

      resolve(response);
    });
  }

  async preparedAssistanceWorkday(data: any): Promise<Array<AssistanceWorkResponse>> {
    return new Promise<Array<AssistanceWorkResponse>>((resolve, reject) => {
      let collection: Array<AssistanceWorkResponse> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          collection.push({
            idAsistenciaJornada: data.rows.item(index).AssistanceWorkDayId,
            idJornada: data.rows.item(index).WorkDayId,
            idPdv: data.rows.item(index).SalespointId,
            idTipoAsistencia: data.rows.item(index).AssistanceTypeId,
            fechaHora: data.rows.item(index).HourDate,
            latitud: data.rows.item(index).Latitude,
            longitud: data.rows.item(index).Longitude,
            direccionGoogle: data.rows.item(index).GoogleAddress,
            observaciones: (data.rows.item(index).Observations != '' ? data.rows.item(index).Observations : null),
            foto: (data.rows.item(index).Photo != '' ? data.rows.item(index).Photo : null),
            nivelBateria: data.rows.item(index).BatteryLevel,
            distanciaPdv: data.rows.item(index).DistanceSalespoint,
            ubicacionFalsa: null,
            usModificacion: null,
            feModificacion: null,
            usCreacion: data.rows.item(index).UsCreation,
            idCampania: data.rows.item(index).CampaignId
          });
        }
      }

      resolve(collection);
    });
  }

  // async deleteAssistanceWorkday(): Promise<boolean> {
  //   return new Promise(async (resolve, reject) => {
  //     await this.databaseAppServices.dbObject.executeSql('DELETE FROM ASSISTANCE_WORKDAY', [])
  //       .then(() => resolve(true))
  //       .catch((error) => {
  //         console.log('ERROR DELETE TABLE ASSISTANCE_WORKDAY', error);
  //         resolve(false);
  //       });
  //   });
  // }

  async createInformacionPdvTypeTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppServices.dbObject.executeSql('CREATE TABLE IF NOT EXISTS InformacionPdv (' +
      'InformacionTypeDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', idPDV INTEGER NOT NULL' +
      ', nombreGerente TEXT' +
      ', telefono TEXT' +
      ', facturacion TEXT' +
      ', nombreCanal TEXT' +
      ', fechaUltimaVisita TEXT' +
      ')', [])
      .then(() => result = true)
      .catch(error => console.log('ERROR CREATE TABLE InformacionPdv', error));
    return result;
  }

  async addInformacionPdvTypeCollection(request: InformationPDV,idPDV): Promise<boolean> {
    const header = 'INSERT INTO InformacionPdv (idPDV,nombreGerente,telefono,facturacion,nombreCanal,fechaUltimaVisita)' +
      ' SELECT ?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM InformacionPdv WHERE idPDV = ? )'
      if(request){
        const values = [ 
          idPDV,
          request.nombreGerente,
          request.telefono,
          request.facturacion,
          request.nombreCanal,
          request.fechaUltimaVisita, 
        ];
        if (values.length > 0) {
          await this.databaseAppServices.dbObject.transaction((tx) => { 
            tx.executeSql(header, values); 
          });
        } 
      }
     
    
    return true;
  }
  async getInformacionPdv(idPDV:number): Promise<InformationPDV> {
    let response: InformationPDV ;
    const sentenceSQL: string = `SELECT * FROM InformacionPdv WHERE idPDV = ?`;
    const valueSQL: Array<number> = [idPDV];

    return new Promise(async (resolve, reject) => {
      await this.databaseAppServices.dbObject.executeSql(sentenceSQL, valueSQL)
        .then(async (data) => {
          response = await this.preparedInformacionPdv(data);
        })
        .catch(error => console.log('ERROR SELECT TABLE InformacionPdv', error))

      resolve(response);
    });
  }
  
  async preparedInformacionPdv(data: any): Promise<InformationPDV> {
    if (data) {
      const collection: InformationPDV = {
        idPDV: data.rows.item(0).idPDV,
        nombreGerente: data.rows.item(0).nombreGerente,
        telefono: data.rows.item(0).telefono,
        facturacion: data.rows.item(0).facturacion,
        nombreCanal: data.rows.item(0).nombreCanal,
        fechaUltimaVisita: data.rows.item(0).fechaUltimaVisita
      }; 
      return collection;
    } 
  }  
}
