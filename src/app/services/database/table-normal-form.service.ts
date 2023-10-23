import { Injectable } from '@angular/core';

import { DatabaseAppService } from './database-app.service';
import { FormularioNormal, FormularioLibre, FormularioLibreRequest, DataInsertReporteFormulario, Respuesta } from '../../shared/models/formulario';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TableNormalFormService {

  constructor(private databaseAppService: DatabaseAppService) { }

  async createNormalFormTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS NORMALFORM_LIST (' +
      'NormalFormListDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', FormId INTEGER NOT NULL' +
      ', FormName TEXT NOT NULL' +
      ', FieldNumber INTEGER' +
      ', AssistanceRequired INTEGER' +
      ', IsRequired INTEGER' +
      ', IsActive INTEGER' +
      ', IsPublished INTEGER' +
      ', ApprovalEdition INTEGER' +
      ', ApprovalEditionRoleId INTEGER' +
      ', ApprovalEditionEndDate TEXT' +
      ', CreatedDate TEXT' +
      ', PublishedDate TEXT' +
      ', RequiredIcon TEXT' +
      ', IsCompleted INTEGER' +
      ', IsSalespointAssociated INTEGER' +
      ', SalespointId INTEGER' +
      ', SalespointName TEXT' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => result = true)
      .catch(error => {
        result = false;
        console.log('ERROR CREATE TABLE NORMALFORM_LIST', error);
      });
    return result;
  }

  async addNormalFormCollection(request: Array<FormularioNormal>): Promise<boolean> {
    const header = 'INSERT INTO NORMALFORM_LIST (FormId,FormName,FieldNumber,AssistanceRequired,IsRequired,IsActive,IsPublished,ApprovalEdition' +
      ',ApprovalEditionRoleId,ApprovalEditionEndDate,CreatedDate,PublishedDate,RequiredIcon,IsCompleted,IsSalespointAssociated,SalespointId' +
      ',SalespointName,CampaignId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM NORMALFORM_LIST WHERE FormId = ? AND CampaignId = ?)';

    const values = request.reduce((prev, curr) => {
      prev.push([curr.idFormulario, curr.nombreFormulario, curr.numeroCampos, (curr.asistenciaObligatoria ? 1 : 0), (curr.obligatorio ? 1 : 0),
      (curr.activo ? 1 : 0), (curr.publicado ? 1 : 0), (curr.edicionAprobacion ? 1 : 0), curr.idRolEdicionAprobacion,
      moment(curr.fechaFinEdicionAprobacion).format('YYYY-MM-DDThh:mm:ss'), moment(curr.fechaCreacion).format('YYYY-MM-DDThh:mm:ss'),
      moment(curr.fechaPublicado).format('YYYY-MM-DDThh:mm:ss'), curr.obligatorioIcon, (curr.isCompleted ? 1 : 0), (curr.asociadoPdv ? 1 : 0),
      (curr.salespointId ? curr.salespointId : 0), (curr.salespointName ? curr.salespointName : ''), curr.campaignId, curr.idFormulario, curr.campaignId]);
      return prev;
    }, []);

    if (values.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        values.forEach((item) => {
          tx.executeSql(header, item);
        })
      });
    }

    return true;
  }

  async getNormalFormCollection(campaignId: number): Promise<Array<FormularioNormal>> {
    let response: Array<FormularioNormal> = [];
    const sentenceSQL: string = 'SELECT * FROM NORMALFORM_LIST WHERE CampaignId = ?';
    return new Promise(async (resolve, reject) => {
      await this.databaseAppService.dbObject.executeSql(sentenceSQL, [campaignId])
        .then(async (data) => {
          response = await this.preparedNormalFormCollection(data);
        })
        .catch(error => console.log('ERROR SELECT TABLE NORMALFORM_LIST', error))

      resolve(response);
    });
  }

  async preparedNormalFormCollection(data: any): Promise<Array<FormularioNormal>> {
    return new Promise<Array<FormularioNormal>>((resolve, reject) => {
      let collection: Array<FormularioNormal> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          collection.push({
            idFormulario: data.rows.item(index).FormId,
            nombreFormulario: data.rows.item(index).FormName,
            numeroCampos: data.rows.item(index).FieldNumber,
            asistenciaObligatoria: (data.rows.item(index).AssistanceRequired === 1 ? true : false),
            obligatorio: (data.rows.item(index).IsRequired === 1 ? true : false),
            activo: (data.rows.item(index).IsActive === 1 ? true : false),
            publicado: (data.rows.item(index).IsPublished === 1 ? true : false),
            edicionAprobacion: (data.rows.item(index).ApprovalEdition === 1 ? true : false),
            idRolEdicionAprobacion: data.rows.item(index).ApprovalEditionRoleId,
            fechaFinEdicionAprobacion: data.rows.item(index).ApprovalEditionEndDate,
            fechaCreacion: data.rows.item(index).CreatedDate,
            fechaPublicado: data.rows.item(index).PublishedDate,
            obligatorioIcon: data.rows.item(index).RequiredIcon,
            isCompleted: (data.rows.item(index).IsCompleted === 1 ? true : false),
            asociadoPdv: (data.rows.item(index).IsSalespointAssociated === 1 ? true : false),
            salespointId: (data.rows.item(index).SalespointId === 0 ? null : data.rows.item(index).SalespointId),
            salespointName: (data.rows.item(index).SalespointName === '' ? null : data.rows.item(index).SalespointName),
            campaignId: data.rows.item(index).CampaignId
          });
        }
      }

      resolve(collection);
    });
  }

  async createNormalFormDataTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS NORMALFORM_DATA (' +
      'NormalFormLDataDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', FormId INTEGER NOT NULL' +
      ', FormName TEXT NOT NULL' +
      ', AssistanceRequired INTEGER' +
      ', ApprovalEdition INTEGER' +
      ', ApprovalEditionRoleId INTEGER' +
      ', ApprovalEditionEndDate TEXT' +
      ', IsActive INTEGER' +
      ', IsRequired INTEGER' +
      ', IsPublished INTEGER' +
      ', UserCreationId INTEGER' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => result = true)
      .catch(error => {
        result = false;
        console.log('ERROR CREATE TABLE NORMALFORM_DATA', error);
      });
    return result;
  }

  async createNormalFormFieldTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS NORMALFORM_FIELD (' +
      'NormalFormLFieldDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', FormId INTEGER NOT NULL' +
      ', FieldId INTEGER NOT NULL' +
      ', FieldType TEXT NOT NULL' +
      ', FieldName TEXT NOT NULL' +
      ', ControlId TEXT' +
      ', FieldTypeId INTEGER' +
      ', ControlTypeName TEXT' +
      ', Prefix TEXT' +
      ', IsRequired INTEGER' +
      ', IsActive INTEGER' +
      ', Orden INTEGER' +
      ', Reusable INTEGER' +
      ', RelatedTheme INTEGER' +
      ', FieldParentDependencyId INTEGER' +
      ', ImageUploadUrl TEXT' +
      ', ImageSendUrl TEXT' +
      ', Visible INTEGER' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => result = true)
      .catch(error => {
        result = false;
        console.log('ERROR CREATE TABLE NORMALFORM_FIELD', error);
      });
    return result;
  }

  async createNormalFormOptionTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS NORMALFORM_OPTION (' +
      'NormalFormLOptionDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', FormId INTEGER NOT NULL' +
      ', FieldId INTEGER NOT NULL' +
      ', ValueId INTEGER' +
      ', Value TEXT' +
      ', FieldChildDependencyId INTEGER' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => result = true)
      .catch(error => {
        result = false;
        console.log('ERROR CREATE TABLE NORMALFORM_OPTION', error);
      });
    return result;
  }

  async addNormalFormData(campaignId: number, request: Array<Array<FormularioLibre>>): Promise<boolean> {
    const headerData = 'INSERT INTO NORMALFORM_DATA (FormId,FormName,AssistanceRequired,ApprovalEdition,' +
      'ApprovalEditionRoleId,ApprovalEditionEndDate,IsActive,IsRequired,IsPublished,UserCreationId,CampaignId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM NORMALFORM_DATA WHERE FormId = ? AND CampaignId = ?)';

    const headerField = 'INSERT INTO NORMALFORM_FIELD (FormId,FieldId,FieldType,FieldName,ControlId,FieldTypeId,ControlTypeName,' +
      'Prefix,IsRequired,IsActive,Orden,Reusable,RelatedTheme,FieldParentDependencyId,ImageUploadUrl,ImageSendUrl,Visible,CampaignId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM NORMALFORM_FIELD WHERE FormId = ? AND FieldId = ? AND CampaignId = ?)';

    const headerOption = 'INSERT INTO NORMALFORM_OPTION (FormId,FieldId,ValueId,Value,FieldChildDependencyId,CampaignId)' +
      ' SELECT ?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM NORMALFORM_OPTION WHERE FormId = ? AND FieldId = ? AND ValueId = ? AND CampaignId = ?)';

    const valuesData = request.reduce((prev, curr) => {
      prev.push([curr[0].idFormulario, curr[0].nombreFormulario, (curr[0].asistenciaObligatoria ? 1 : 0), (curr[0].edicionAprobacion ? 1 : 0),
      curr[0].idRolEdicionAprobacion, moment(curr[0].fechaFinEdicionAprobacion).format('YYYY-MM-DDThh:mm:ss'), (curr[0].activo ? 1 : 0),
      (curr[0].obligatorio ? 1 : 0), (curr[0].publicado ? 1 : 0), curr[0].usCreacion, campaignId,
      curr[0].idFormulario, campaignId]);
      return prev;
    }, ([] as Array<any>));

    const valuesField = request.reduce((prev, curr) => {
      const fields = curr[0].campos;
      fields.forEach(item => {
        prev.push([curr[0].idFormulario, item.idCampo, item.tipoCampo, item.nombreCampo, item.idControl, item.idTipoCampo, item.tipoControl,
        item.prefijo, (item.obligatorio ? 1 : 0), (item.activo ? 1 : 0), item.orden, (item.reutilizable ? 1 : 0), (item.referenteTema ? 1 : 0),
        (item.idCampoDependenciaPadre ? item.idCampoDependenciaPadre : 0), (item.imageUploadUrl ? item.imageUploadUrl : ''),
        (item.imageSendUrl ? item.imageSendUrl : ''), (item.visible ? 1 : 0), campaignId,
        curr[0].idFormulario, item.idCampo, campaignId]);
      });
      return prev;
    }, ([] as Array<any>));

    const valuesOption = request.reduce((prev, curr) => {
      const fieldWithOptions = curr[0].campos.filter(x => x.opciones.length > 0);
      fieldWithOptions.forEach(item1 => {
        const options = item1.opciones;
        options.forEach(item2 => {
          prev.push([curr[0].idFormulario, item1.idCampo, item2.idValor, item2.valor, item2.idCampoDependenciaHijo, campaignId, 
          curr[0].idFormulario, item1.idCampo, item2.idValor, campaignId]);
        });
      });
      return prev;
    }, ([] as Array<any>));

    if (valuesData.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        valuesData.forEach((item) => {
          tx.executeSql(headerData, item);
        })
      });
    }
    if (valuesField.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        valuesField.forEach((item) => {
          tx.executeSql(headerField, item);
        })
      });
    }
    if (valuesOption.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        valuesOption.forEach((item) => {
          tx.executeSql(headerOption, item);
        })
      });
    }

    return true;
  }

  async getNormalFormDataCollection(campaignId: number, normalFormId: number): Promise<Array<FormularioLibre>> {
    let response: Array<FormularioLibre> = [];
    const sentenceDataSQL: string = 'SELECT * FROM NORMALFORM_DATA WHERE CampaignId = ? AND FormId = ?';
    const sentenceFieldSQL: string = 'SELECT * FROM NORMALFORM_FIELD WHERE CampaignId = ? AND FormId = ?';
    const sentenceOptionSQL: string = 'SELECT * FROM NORMALFORM_OPTION WHERE CampaignId = ? AND FormId = ?';

    return new Promise(async (resolve, reject) => {
      await this.databaseAppService.dbObject.executeSql(sentenceDataSQL, [campaignId, normalFormId])
        .then(async (data) => {
          response = await this.preparedNormalFormDataCollection(data);

          await this.databaseAppService.dbObject.executeSql(sentenceFieldSQL, [campaignId, normalFormId])
            .then(async (field) => {
              response = await this.preparedNormalFormFieldCollection(response, field);

              await this.databaseAppService.dbObject.executeSql(sentenceOptionSQL, [campaignId, normalFormId])
                .then(async (option) => {
                  response = await this.preparedNormalFormOptionCollection(response, option);

                  resolve(response);
                })
                .catch(error => {
                  console.log('ERROR SELECT TABLE NORMALFORM_FIELD', error)
                  resolve([]);
                });
            })
            .catch(error => {
              console.log('ERROR SELECT TABLE NORMALFORM_FIELD', error)
              resolve([]);
            });
        })
        .catch(error => {
          console.log('ERROR SELECT TABLE NORMALFORM_LIST', error)
          resolve([]);
        })
    });
  }

  async preparedNormalFormDataCollection(data: any): Promise<Array<FormularioLibre>> {
    return new Promise<Array<FormularioLibre>>((resolve, reject) => {
      let collection: Array<FormularioLibre> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          collection.push({
            idFormulario: data.rows.item(index).FormId,
            nombreFormulario: data.rows.item(index).FormName,
            asistenciaObligatoria: (data.rows.item(index).AssistanceRequired === 1 ? true : false),
            edicionAprobacion: (data.rows.item(index).ApprovalEdition === 1 ? true : false),
            idRolEdicionAprobacion: data.rows.item(index).ApprovalEditionRoleId,
            fechaFinEdicionAprobacion: data.rows.item(index).ApprovalEditionEndDate,
            activo: (data.rows.item(index).IsActive === 1 ? true : false),
            obligatorio: (data.rows.item(index).IsRequired === 1 ? true : false),
            publicado: (data.rows.item(index).IsPublished === 1 ? true : false),
            usCreacion: data.rows.item(index).UserCreationId,
            campos: []
          });
        }
      }

      resolve(collection);
    });
  }

  async preparedNormalFormFieldCollection(data: Array<FormularioLibre>, field: any): Promise<Array<FormularioLibre>> {
    return new Promise<Array<FormularioLibre>>((resolve, reject) => {
      const collection: Array<FormularioLibre> = data;
      if (field.rows.length > 0) {
        for (let index = 0; index < field.rows.length; index++) {
          const indexData = collection.findIndex(x => x.idFormulario === field.rows.item(index).FormId);

          if (indexData != -1) {
            collection[indexData].campos.push({
              idCampo: field.rows.item(index).FieldId,
              tipoCampo: field.rows.item(index).FieldType,
              nombreCampo: field.rows.item(index).FieldName,
              idControl: field.rows.item(index).ControlId,
              idTipoCampo: field.rows.item(index).FieldTypeId,
              tipoControl: field.rows.item(index).ControlTypeName,
              prefijo: field.rows.item(index).Prefix,
              obligatorio: (field.rows.item(index).IsRequired === 1 ? true : false),
              activo: (field.rows.item(index).IsActive === 1 ? true : false),
              orden: field.rows.item(index).Orden,
              reutilizable: (field.rows.item(index).Reusable === 1 ? true : false),
              referenteTema: (field.rows.item(index).RelatedTheme === 1 ? true : false),
              idCampoDependenciaPadre: (field.rows.item(index).FieldParentDependencyId != 0 ? field.rows.item(index).FieldParentDependencyId : null),
              opciones: [],
              imageUploadUrl: null,
              imageSendUrl: null,
              visible: (field.rows.item(index).FieldParentDependencyId != 0 ? false : true)
            });
          }
        }
      }
      resolve(collection);
    });
  }

  async preparedNormalFormOptionCollection(data: Array<FormularioLibre>, option: any): Promise<Array<FormularioLibre>> {
    return new Promise<Array<FormularioLibre>>((resolve, reject) => {
      const collection: Array<FormularioLibre> = data;
      if (option.rows.length > 0) {
        for (let index = 0; index < option.rows.length; index++) {
          const indexData = collection.findIndex(x => x.idFormulario === option.rows.item(index).FormId);

          if (indexData != -1) {
            const indexField = collection[indexData].campos.findIndex(x => x.idCampo === option.rows.item(index).FieldId);

            if (indexField != -1) {
              collection[indexData].campos[indexField].opciones.push({
                idValor: option.rows.item(index).ValueId,
                valor: option.rows.item(index).Value,
                idCampoDependenciaHijo: option.rows.item(index).FieldChildDependencyId
              });
            }
          }
        }
      }
      resolve(collection);
    });
  }

  async createNormalFormAssistanceTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS NORMALFORM_ASSISTANCE (' +
      'NormalFormLAssistanceDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', ReportFormId INTEGER NOT NULL' +
      ', AssistanceTypeId INTEGER NOT NULL' +
      ', CheckInDate TEXT NOT NULL' +
      ', Latitude TEXT NOT NULL' +
      ', Longitude TEXT NOT NULL' +
      ', GoogleAddress TEXT NOT NULL' +
      ', Observation TEXT' +
      ', Photo TEXT' +
      ', BatteryLevel INTEGER' +
      ', FakeLocation TEXT' +
      ', IsAutomatic INTEGER' +
      ', UserCreationId INTEGER' +
      ')', [])
      .then(() => result = true)
      .catch(error => {
        result = false;
        console.log('ERROR CREATE TABLE NORMALFORM_ASSISTANCE', error);
      });
    return result;
  }

  async createNormalFormDataAnswerHeadTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS NORMALFORM_ANSWER_HEAD (' +
      'NormalFormAnswerHeadDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', ReportFormId INTEGER NOT NULL' +
      ', FormId INTEGER NOT NULL' +
      ', UserId INTEGER NOT NULL' +
      ', SalespointId INTEGER' +
      ', ReportDate TEXT NOT NULL' +
      ', BatteryLevel INTEGER' +
      ', IsAutomatic INTEGER' +
      ', UserCreationId INTEGER' +
      ', SalespointName TEXT' +
      ')', [])
      .then(() => result = true)
      .catch(error => {
        result = false;
        console.log('ERROR CREATE TABLE NORMALFORM_ANSWER_HEAD', error);
      });
    return result;
  }

  async createNormalFormDataAnswerDataTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS NORMALFORM_ANSWER_DATA (' +
      'NormalFormAnswerDataDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', ReportFormId INTEGER NOT NULL' +
      ', FormId INTEGER NOT NULL' +
      ', FieldId INTEGER NOT NULL' +
      ', Value TEXT NOT NULL' +
      ', FileSendValue TEXT' +
      ')', [])
      .then(() => result = true)
      .catch(error => {
        result = false;
        console.log('ERROR CREATE TABLE NORMALFORM_ANSWER_DATA', error);
      });
    return result;
  }

  async addNormalFormAssistanceAnswer(request: FormularioLibreRequest): Promise<boolean> {
    const headerAssistance = 'INSERT INTO NORMALFORM_ASSISTANCE (ReportFormId,AssistanceTypeId,CheckInDate,Latitude,Longitude,' +
      'GoogleAddress,Observation,Photo,BatteryLevel,FakeLocation,IsAutomatic,UserCreationId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM NORMALFORM_ASSISTANCE WHERE ReportFormId = ? AND AssistanceTypeId = ?)';
    const headerAnswerHead = 'INSERT INTO NORMALFORM_ANSWER_HEAD (ReportFormId,FormId,UserId,SalespointId,ReportDate,' +
      'BatteryLevel,IsAutomatic,UserCreationId,SalespointName)' +
      ' SELECT ?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM NORMALFORM_ANSWER_HEAD WHERE ReportFormId = ? AND FormId = ?)';
    const headerAnswerData = 'INSERT INTO NORMALFORM_ANSWER_DATA (ReportFormId,FormId,FieldId,Value,FileSendValue)' +
      ' SELECT ?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM NORMALFORM_ANSWER_DATA WHERE ReportFormId = ? AND FormId = ? AND FieldId = ?)';

    const valuesAssistance = request.dataInsertAsistenciasList.reduce((prev, curr) => {
      prev.push([curr.idReporteFormulario, curr.idTipoAsistencia, curr.fechaHoraCheckIn, curr.latitud, curr.longitud,
      curr.direccionGoogle, curr.observaciones, curr.foto, curr.nivelBateria, curr.ubicacionFalsa, (curr.esAutomatico ? 1 : 0),
      curr.usCreacion, curr.idReporteFormulario, curr.idTipoAsistencia]);
      return prev;
    }, ([] as Array<any>));

    const dataAnswers = request.dataInsertReporteFormulario;

    const valuesAnswerHead: Array<any> = [dataAnswers.idReporteFormulario, dataAnswers.idFormulario, dataAnswers.idUsuario, (dataAnswers.idPdv ? dataAnswers.idPdv : 0),
    dataAnswers.fechaReporte, dataAnswers.nivelBateria, (dataAnswers.esAutomatico ? 1 : 0), dataAnswers.usCreacion, (dataAnswers.salespointName ? dataAnswers.salespointName : ''),
    dataAnswers.idReporteFormulario, dataAnswers.idFormulario];

    const valuesAnswerData = dataAnswers.respuestas.reduce((prev, curr) => {
      prev.push([dataAnswers.idReporteFormulario, dataAnswers.idFormulario, curr.idCampo, curr.valor.toString(), (curr.valorFileSendUrl ? curr.valorFileSendUrl : ''),
      dataAnswers.idReporteFormulario, dataAnswers.idFormulario, curr.idCampo]);
      return prev;
    }, ([] as Array<any>));

    if (valuesAssistance.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        valuesAssistance.forEach((item) => {
          tx.executeSql(headerAssistance, item);
        })
      });
    }

    await this.databaseAppService.dbObject.transaction((tx) => {
      tx.executeSql(headerAnswerHead, valuesAnswerHead);
    });

    if (valuesAnswerData.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        valuesAnswerData.forEach((item) => {
          tx.executeSql(headerAnswerData, item);
        })
      });
    }

    return true;
  }

  async getNormalFormAssistanceAnswer(userId: number = null, normalFormId: number = null): Promise<Array<FormularioLibreRequest>> {
    let collection: Array<FormularioLibreRequest> = [];
    const sentenceAnswerHeadSQL: string = `SELECT * FROM NORMALFORM_ANSWER_HEAD${(userId ? (normalFormId ? ' WHERE UserId = ? AND FormId = ?' : ' WHERE UserId = ?') : '')}`;

    const valuesAnswerHead = (userId ? (normalFormId ? [userId, normalFormId] : [userId]) : []);

    return new Promise(async (resolve, reject) => {
      await this.databaseAppService.dbObject.executeSql(sentenceAnswerHeadSQL, valuesAnswerHead)
        .then(async (data) => {
          const answerHead = await this.preparedNormalFormAnswerHeadCollection(data);
          const reportIds: string = answerHead.map(x => x.idReporteFormulario).join(',');

          collection = answerHead.reduce((prev, curr) => {
            prev.push({
              dataInsertReporteFormulario: curr,
              dataInsertAsistenciasList: []
            });
            return prev;
          }, ([] as Array<FormularioLibreRequest>));

          await this.databaseAppService.dbObject.executeSql(`SELECT * FROM NORMALFORM_ANSWER_DATA WHERE ReportFormId IN (${reportIds})`, [])
            .then(async (data) => {
              collection = await this.preparedNormalFormAnswerDataCollection(collection, data);

              await this.databaseAppService.dbObject.executeSql(`SELECT * FROM NORMALFORM_ASSISTANCE WHERE ReportFormId IN(${reportIds})`, [])
                .then(async (assistance) => {
                  collection = await this.preparedNormalFormAssistanceCollection(collection, assistance);

                  resolve(collection);
                })
                .catch(error => {
                  console.log('ERROR SELECT TABLE NORMALFORM_ANSWER_HEAD', error)
                  resolve([]);
                });
            })
            .catch(error => {
              console.log('ERROR SELECT TABLE NORMALFORM_ANSWER_DATA', error)
              resolve([]);
            });
        })
        .catch(error => {
          console.log('ERROR SELECT TABLE NORMALFORM_ASSISTANCE', error)
          resolve([]);
        })
    });
  }

  preparedNormalFormAnswerHeadCollection(data: any): Promise<Array<DataInsertReporteFormulario>> {
    return new Promise<Array<DataInsertReporteFormulario>>((resolve, reject) => {
      let headCollection: Array<DataInsertReporteFormulario> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          headCollection.push({
            idReporteFormulario: data.rows.item(index).ReportFormId,
            idFormulario: data.rows.item(index).FormId,
            idUsuario: data.rows.item(index).UserId,
            idPdv: (data.rows.item(index).SalespointId !== 0 ? data.rows.item(index).SalespointId : null),
            fechaReporte: data.rows.item(index).ReportDate,
            nivelBateria: data.rows.item(index).BatteryLevel,
            esAutomatico: true,
            respuestas: [],
            usCreacion: data.rows.item(index).UserCreationId,
            salespointName: (data.rows.item(index).SalespointName != '' ? data.rows.item(index).SalespointName : null)
          });
        }
      }

      resolve(headCollection);
    });
  }

  preparedNormalFormAnswerDataCollection(collection: Array<FormularioLibreRequest>, data: any): Promise<Array<FormularioLibreRequest>> {
    return new Promise<Array<FormularioLibreRequest>>((resolve, reject) => {
      const collectionHead: Array<FormularioLibreRequest> = collection;

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          const indexHead = collectionHead.findIndex(x => x.dataInsertReporteFormulario.idReporteFormulario === data.rows.item(index).ReportFormId);

          if (indexHead != -1) {
            const valores = data.rows.item(index).Value.split(',');

            collectionHead[indexHead].dataInsertReporteFormulario.respuestas.push({
              idCampo: data.rows.item(index).FieldId,
              valor: (valores[0] === '' ? [] : valores),
              valorFileSendUrl: (data.rows.item(index).FileSendValue === '' ? null : data.rows.item(index).FileSendValue)
            });
          }
        }
      }

      resolve(collectionHead);
    });
  }

  preparedNormalFormAssistanceCollection(collection: Array<FormularioLibreRequest>, data: any): Promise<Array<FormularioLibreRequest>> {
    return new Promise<Array<FormularioLibreRequest>>((resolve, reject) => {
      const collectionHead: Array<FormularioLibreRequest> = collection;

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          const indexHead = collectionHead.findIndex(x => x.dataInsertReporteFormulario.idReporteFormulario === data.rows.item(index).ReportFormId);

          if (indexHead != -1) {
            collectionHead[indexHead].dataInsertAsistenciasList.push({
              idReporteFormulario: data.rows.item(index).ReportFormId,
              idTipoAsistencia: data.rows.item(index).AssistanceTypeId,
              fechaHoraCheckIn: data.rows.item(index).CheckInDate,
              latitud: data.rows.item(index).Latitude,
              longitud: data.rows.item(index).Longitude,
              direccionGoogle: data.rows.item(index).GoogleAddress,
              observaciones: data.rows.item(index).Observation,
              foto: data.rows.item(index).Photo,
              nivelBateria: data.rows.item(index).BatteryLevel,
              ubicacionFalsa: data.rows.item(index).FakeLocation,
              esAutomatico: true,
              usCreacion: data.rows.item(index).UserCreationId
            });
          }
        }
      }
      resolve(collectionHead);
    });
  }

  deleteNormalFormAssistanceAnswerSyncronized(reportFormId: Array<number>): Promise<boolean> {
    const ids: string = reportFormId.join(',');

    return new Promise(async (resolve, reject) => {
      await this.databaseAppService.dbObject.executeSql(`DELETE FROM NORMALFORM_ASSISTANCE WHERE ReportFormId IN (${ids})`, [])
        .then(async () => {
          await this.databaseAppService.dbObject.executeSql(`DELETE FROM NORMALFORM_ANSWER_HEAD WHERE ReportFormId IN (${ids})`, [])
            .then(async () => {
              await this.databaseAppService.dbObject.executeSql(`DELETE FROM NORMALFORM_ANSWER_DATA WHERE ReportFormId IN (${ids})`, [])
                .then(() => {
                  resolve(true);
                })
                .catch((error) => {
                  console.log('DELETE NORMALFORM_ANSWER_DATA ERROR', error);
                  resolve(false);
                });
            })
            .catch((error) => {
              console.log('DELETE NORMALFORM_ANSWER_HEAD ERROR', error);
              resolve(false);
            });
        })
        .catch((error) => {
          console.log('DELETE NORMALFORM_ASSISTANCE ERROR', error);
          resolve(false);
        });
    });
  }
}
