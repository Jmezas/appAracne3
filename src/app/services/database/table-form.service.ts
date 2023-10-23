import { Injectable } from '@angular/core';

import { DatabaseAppService } from './database-app.service';
import {
  Formulario, DetalleTema, Campo, Opcion,
  FormularioRespuesta, FormularioJornada, DependencyThemeForm, FilterDependencyThemeForm
} from '../../shared/models/formulario-jornada';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TableFormService {
  resultOfTable: boolean = false;

  constructor(private databaseAppService: DatabaseAppService) { }

  // Tabla Formulario Lista
  async createFormListTable(): Promise<boolean> {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS FORM_LIST (' +
      'FormListDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', FormWorkDayId INTEGER NOT NULL' +
      ', SalespointId INTEGER NOT NULL' +
      ', WorkDayId INTEGER NOT NULL' +
      ', FormName TEXT NOT NULL' +
      ', FormThemeName TEXT' +
      ', Required INTEGER NOT NULL' +
      ', Active INTEGER NOT NULL' +
      ', Published INTEGER NOT NULL' +
      ', RemoteCompleted INTEGER' +
      ', RequiredIcon TEXT' +
      ', FormThemeIcon TEXT' +
      ', IsCompleted INTEGER' +
      ', SalespointName TEXT NOT NULL' +
      ', IsSynchronized INTEGER' +
      ', workDayUserId INTEGER' +
      ', WorkDayDate TEXT' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  // Tabla Formulario
  async createFormTable(): Promise<boolean> {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS FORM (' +
      'FormDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', FormWorkDayId INTEGER NOT NULL' +
      ', FormName TEXT NOT NULL' +
      ', FormThemeId INTEGER NOT NULL' +
      ', EditionApproval INTEGER' +
      ', EditionApprovalRolId INTEGER' +
      ', EndDateEditionApproval TEXT' +
      ', Active INTEGER NOT NULL' +
      ', Required INTEGER NOT NULL' +
      ', Published INTEGER NOT NULL' +
      ', CreatorUser INTEGER' +
      ', WorkDayId INTEGER NOT NULL' +
      ', SalespointId INTEGER NOT NULL' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  // Tabla Campos Detalle Tema
  async createFieldDetailThemeFormTable(): Promise<boolean> {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS FIELD_DETAIL_THEME_FORM (' +
      'FieldDetailThemeFormDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', FormWorkDayId INTEGER NOT NULL' +
      ', SuperCategoryId INTEGER' +
      ', CategoryId INTEGER' +
      ', MarkeId INTEGER' +
      ', ProductLineId INTEGER' +
      ', ProductId INTEGER' +
      ', DetailThemeId INTEGER NOT NULL' +
      ', DetailTheme TEXT NOT NULL' +
      ', ImageTheme TEXT' +
      ', IsSaveLoading INTEGER' +
      ', IsCompleted INTEGER' +
      ', WorkDayId INTEGER NOT NULL' +
      ', SalespointId INTEGER NOT NULL' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  // Tabla Campos
  async createFieldFormTable(): Promise<boolean> {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS FIELD_FORM (' +
      'FieldFormDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', FormWorkDayId INTEGER' +
      ', FieldId INTEGER NOT NULL' +
      ', FieldType TEXT NOT NULL' +
      ', FieldName TEXT NOT NULL' +
      ', ControlId TEXT NOT NULL' +
      ', FieldTypeId INTEGER NOT NULL' +
      ', ControlType TEXT NOT NULL' +
      ', Prefix TEXT' +
      ', Required INTEGER NOT NULL' +
      ', Active INTEGER NOT NULL' +
      ', Orden INTEGER NOT NULL' +
      ', Reusable INTEGER NOT NULL' +
      ', ReferenceTheme INTEGER NOT NULL' +
      ', ParentDependencyId INTEGER' +
      ', ImageUploadUrl TEXT' +
      ', DetailThemeId INTEGER' +
      ', Visible INTEGER' +
      ', WorkDayId INTEGER NOT NULL' +
      ', SalespointId INTEGER NOT NULL' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  // Tabla Opciones
  async createFieldOptionFormTable(): Promise<boolean> {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS FIELD_OPTION_FORM (' +
      'FieldOptionFormDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', FormWorkDayId INTEGER NOT NULL' +
      ', FieldId INTEGER NOT NULL' +
      ', DetailThemeId INTEGER' +
      ', ValueId INTEGER NOT NULL' +
      ', Value TEXT NOT NULL' +
      ', ChildDependencyId INTERGER' +
      ', WorkDayId INTEGER NOT NULL' +
      ', SalespointId INTEGER NOT NULL' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  // Tabla Respuesta
  async createAnswersFormTable(): Promise<boolean> {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS ANSWERS_FORM (' +
      'AnswerFormDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', FormWorkDayId INTEGER NOT NULL' +
      ', UserId INTEGER NOT NULL' +
      ', SalespointId INTEGER' +
      ', WorkdayId INTEGER' +
      ', ReportDate TEXT NOT NULL' +
      ', DetailThemeId INTEGER' +
      ', ControlId TEXT' +
      ', FieldId INTEGER' +
      ', Answers TEXT' +
      ', AnswerFileUrl TEXT' +
      ', AnswerFileSendUrl TEXT' +
      ', CreatorUser INTEGER' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  // Inserciones
  async addFormListCollection(request: Array<FormularioJornada>): Promise<boolean> {
    const dataFormInsert: Array<any> = [];
    const dataFormUpdate: Array<any> = [];

    const headerDataFormInsert = 'INSERT INTO FORM_LIST ' +
      '(FormWorkDayId,SalespointId,WorkDayId,FormName,FormThemeName,Required,Active,Published,RemoteCompleted' +
      ',RequiredIcon,FormThemeIcon,IsCompleted,SalespointName,IsSynchronized,workDayUserId,WorkDayDate,CampaignId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?' +
      ' WHERE NOT EXISTS(SELECT 1 FROM FORM_LIST WHERE FormWorkDayId = ? AND WorkDayId = ? AND SalespointId = ? AND CampaignId = ?)';

    const headerDataFormUpdate = 'UPDATE FORM_LIST SET FormName = ?, FormThemeName = ?, Required = ?, Active = ?, Published = ?' +
      ', RemoteCompleted = ?, RequiredIcon = ?, FormThemeIcon = ?' +
      ' WHERE FormWorkDayId = ? AND WorkDayId = ? AND SalespointId = ? AND CampaignId = ?';

    request.forEach(item => {
      dataFormInsert.push([item.idFormularioJornada, item.idPdv, item.idJornada, item.nombreFormulario, item.temaFormulario,
      (item.obligatorio ? 1 : 0), (item.activo ? 1 : 0), (item.publicado ? 1 : 0), (item.completado ? 1 : 0), item.obligatorioIcon,
      item.temaFormularioIcon, (item.isCompleted ? 1 : 0), item.salespointName, (item.isSynchronized ? 1 : 0), item.idUsuarioJornada,
      moment(item.fechaJornada).format('YYYY-MM-DDThh:mm:ss'), item.campaignId, item.idFormularioJornada, item.idJornada, item.idPdv, item.campaignId]);
    });

    request.forEach(item => {
      dataFormUpdate.push([item.nombreFormulario, item.temaFormulario, (item.obligatorio ? 1 : 0), (item.activo ? 1 : 0), (item.publicado ? 1 : 0),
      (item.completado ? 1 : 0), item.obligatorioIcon, item.temaFormularioIcon, item.idFormularioJornada, item.idJornada, item.idPdv, item.campaignId]);
    });

    if (dataFormInsert.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        dataFormInsert.forEach((item, i) => {
          tx.executeSql(headerDataFormInsert, item);
        });
      });
    }

    if (dataFormUpdate.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        dataFormUpdate.forEach((item, i) => {
          tx.executeSql(headerDataFormUpdate, item);
        });
      });
    }

    return true;
  }

  async addFormDetailCollection(request: Array<Formulario>): Promise<boolean> {
    const dataFormInsert: Array<any> = [];
    const dataFieldDetailFormInsert: Array<any> = [];
    const dataFieldFormInsert: Array<any> = [];
    const dataFieldOptionFormInsert: Array<any> = [];
    const dataFieldDetailFormUpdate: Array<any> = [];

    const headerDataFormInsert = 'INSERT INTO FORM (FormWorkDayId,FormName,FormThemeId,EditionApproval,EditionApprovalRolId' +
      ',EndDateEditionApproval,Active,Required,Published,CreatorUser,WorkDayId,SalespointId,CampaignId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?' +
      ' WHERE NOT EXISTS(SELECT 1 FROM FORM WHERE FormWorkDayId = ? AND WorkDayId = ? AND SalespointId = ? AND CampaignId = ?)';

    const headerDetailThemeFormInsert = 'INSERT INTO FIELD_DETAIL_THEME_FORM (FormWorkDayId,SuperCategoryId,CategoryId,MarkeId,ProductLineId,ProductId' +
      ',DetailThemeId,DetailTheme,ImageTheme,IsSaveLoading,IsCompleted,WorkDayId,SalespointId,CampaignId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?' +
      ' WHERE NOT EXISTS(SELECT 1 FROM FIELD_DETAIL_THEME_FORM WHERE FormWorkDayId = ? AND DetailThemeId = ? AND WorkDayId = ? AND SalespointId = ? AND CampaignId = ?)';

    const headerFildFormInsert = 'INSERT INTO FIELD_FORM (FormWorkDayId,FieldId,FieldType,FieldName,ControlId,FieldTypeId,ControlType' +
      ',Prefix,Required,Active,Orden,Reusable,ReferenceTheme,ParentDependencyId,ImageUploadUrl,DetailThemeId,Visible' +
      ',WorkDayId,SalespointId,CampaignId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?' +
      ' WHERE NOT EXISTS(SELECT 1 FROM FIELD_FORM WHERE FormWorkDayId = ? AND DetailThemeId = ? AND FieldId = ? AND WorkDayId = ? AND SalespointId = ? AND CampaignId = ?)';

    const headerOptionFormInsert = 'INSERT INTO FIELD_OPTION_FORM (FormWorkDayId,FieldId,DetailThemeId,ValueId,Value,ChildDependencyId,WorkDayId,SalespointId,CampaignId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?' +
      ' WHERE NOT EXISTS(SELECT 1 FROM FIELD_OPTION_FORM WHERE FormWorkDayId = ? AND DetailThemeId = ? AND FieldId = ? AND ValueId = ? AND WorkDayId = ? AND SalespointId = ? AND CampaignId = ?)';

    const headerDetailThemeFormUpdate = 'UPDATE FIELD_DETAIL_THEME_FORM SET DetailTheme = ?, ImageTheme = ?' +
      ' WHERE FormWorkDayId = ? AND DetailThemeId = ? AND WorkDayId = ? AND SalespointId = ? AND CampaignId = ?';

    request.forEach(form => {
      dataFormInsert.push([form.idFormularioJornada, form.nombreFormulario, form.idTemaFormulario, (form.edicionAprobacion ? 1 : 0),
      form.idRolEdicionAprobacion, moment(form.fechaFinEdicionAprobacion).format('YYYY-MM-DDThh:mm:ss'), (form.activo ? 1 : 0),
      (form.obligatorio ? 1 : 0), (form.publicado ? 1 : 0), form.usCreacion, form.idJornada, form.idPdv, form.campaignId,
      form.idFormularioJornada, form.idJornada, form.idPdv, form.campaignId]);

      form.detalleTema.forEach(detail => {
        dataFieldDetailFormInsert.push([detail.idFormularioJornada, detail.idSuperCategoria, detail.idCategoria, detail.idMarca, detail.idLineaProducto,
        detail.idProducto, detail.idDetalleTema, detail.detalleTema, detail.imagenTema, (detail.isSaveLoading ? 1 : 0), (detail.isCompleted ? 1 : 0),
        form.idJornada, form.idPdv, form.campaignId,
        form.idFormularioJornada, detail.idDetalleTema, form.idJornada, form.idPdv, form.campaignId]);

        dataFieldDetailFormUpdate.push([detail.detalleTema, detail.imagenTema,
        form.idFormularioJornada, detail.idDetalleTema, form.idJornada, form.idPdv, form.campaignId]);

        detail.campos.forEach(field => {
          dataFieldFormInsert.push([form.idFormularioJornada, field.idCampo, field.tipoCampo, field.nombreCampo, field.idControl,
          field.idTipoCampo, field.tipoControl, field.prefijo, (field.obligatorio ? 1 : 0), (field.activo ? 1 : 0), field.orden,
          (field.reutilizable ? 1 : 0), (field.referenteTema ? 1 : 0), (field.idCampoDependenciaPadre ? field.idCampoDependenciaPadre : 0),
          field.imageUploadUrl, detail.idDetalleTema, (field.visible ? 1 : 0), form.idJornada, form.idPdv, form.campaignId,
          form.idFormularioJornada, detail.idDetalleTema, field.idCampo, form.idJornada, form.idPdv, form.campaignId]);

          field.opciones.forEach((option, i) => {
            dataFieldOptionFormInsert.push([form.idFormularioJornada, field.idCampo, detail.idDetalleTema, option.idValor, option.valor,
            (option.idCampoDependenciaHijo != null ? option.idCampoDependenciaHijo : 0), form.idJornada, form.idPdv, form.campaignId,
            form.idFormularioJornada, detail.idDetalleTema, field.idCampo, option.idValor, form.idJornada, form.idPdv, form.campaignId]);
          });
        });
      });
    });

    if (dataFormInsert.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        dataFormInsert.forEach((item, i) => {
          tx.executeSql(headerDataFormInsert, item);
        });
      });
    }

    if (dataFieldDetailFormInsert.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        dataFieldDetailFormInsert.forEach((item, i) => {
          tx.executeSql(headerDetailThemeFormInsert, item);
        });
      });
    }

    if (dataFieldFormInsert.length > 0) {
      this.databaseAppService.dbObject.transaction((tx) => {
        dataFieldFormInsert.forEach((item, i) => {
          tx.executeSql(headerFildFormInsert, item);
        });
      });
    }

    if (dataFieldOptionFormInsert.length > 0) {
      this.databaseAppService.dbObject.transaction((tx) => {
        dataFieldOptionFormInsert.forEach((item, i) => {
          tx.executeSql(headerOptionFormInsert, item);
        });
      });
    }

    if (dataFieldDetailFormUpdate.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        dataFieldDetailFormUpdate.forEach(item => {
          tx.executeSql(headerDetailThemeFormUpdate, item);
        });
      });
    }

    return true;
  }

  async addAnswers(campaignId: number, answers: Array<FormularioRespuesta>): Promise<boolean> {
    const headerAnswerForm = 'INSERT INTO ANSWERS_FORM (FormWorkDayId,UserId,SalespointId,WorkdayId,ReportDate,DetailThemeId,ControlId,FieldId,Answers,AnswerFileUrl,AnswerFileSendUrl,CreatorUser,CampaignId)' +
      'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    const answersCompleted = answers.map(x => ({ idFormularioJornada: x.idFormularioJornada, idJornada: x.idJornada, idPdv: x.idPdv, idDetalleTema: x.idDetalleTema }));

    // Guardamos la respuesta del campo
    await this.databaseAppService.dbObject.transaction((tx) => {
      answers.forEach(item => {
        item.valor.forEach(value => {
          tx.executeSql(headerAnswerForm, [item.idFormularioJornada, item.idUsuario, item.idPdv, item.idJornada, item.fechaReporte, item.idDetalleTema, item.idControl,
          item.idCampo, value, (item.valueFileUploadUrl ? item.valueFileSendUrl : ''), (item.valueFileSendUrl ? item.valueFileSendUrl : ''), item.usCreacion, campaignId]);
        });
      });
    });

    // Actualizamos a visible los campos cuya respuesta no contenga null
    await this.databaseAppService.dbObject.transaction((tx1) => {
      answers.forEach(item1 => {
        if (item1.valor[0] != null) {
          tx1.executeSql(`UPDATE FIELD_FORM SET Visible = 1 WHERE FormWorkDayId = ? AND WorkDayId = ? AND SalespointId = ? AND FieldId = ? AND ControlId = ? AND DetailThemeId = ? AND CampaignId = ?`,
            [item1.idFormularioJornada, item1.idJornada, item1.idPdv, item1.idCampo, item1.idControl, item1.idDetalleTema, campaignId]);
        }
      });
    });

    // Actualizamos el campo detalle tema a completado
    await this.databaseAppService.dbObject.transaction((tx2) => {
      answersCompleted.forEach(item2 => {
        tx2.executeSql(`UPDATE FIELD_DETAIL_THEME_FORM SET IsCompleted = 1, IsSaveLoading = 0 WHERE FormWorkDayId = ? AND WorkDayId = ? AND SalespointId = ? AND DetailThemeId = ? AND CampaignId = ?`,
          [item2.idFormularioJornada, item2.idJornada, item2.idPdv, item2.idDetalleTema, campaignId]);
      });
    });

    return true;
  }

  // Consultas
  async getFormListCollection(campaignId: number, workDayId: number = null, salespointId: number = null, requestIds: Array<number> = []): Promise<Array<FormularioJornada>> {
    let response: Array<FormularioJornada> = [];

    const headerForm: string = `SELECT * FROM FORM_LIST WHERE CampaignId = ${campaignId}` +
      `${((workDayId && salespointId) ? ` AND WorkDayId = ${workDayId} AND SalespointId = ${salespointId}` : '')}` +
      `${(requestIds.length > 0 ? ` AND FormWorkDayId IN (${requestIds.join(',')})` : '')}`;

    return new Promise(async (resolve, reject) => {
      await this.databaseAppService.dbObject.executeSql(headerForm, [])
        .then(async (data) => {
          response = await this.preparedFormListOfSelect(data);
        })
        .catch(error1 => {
        });

      resolve(response);
    });
  }

  async getFormCollection(campaignId: number, workDayId: number, salespointId: number, requestIds: Array<number>): Promise<Array<Formulario>> {
    let response: Array<Formulario> = [];
    let detalleTema: Array<DetalleTema> = [];
    let campo: Array<Campo> = [];
    let opcion: Array<Opcion> = [];

    // Si no tienes ids de los formulario obtenemos por idJornada y idPdv
    const formWorkDayIdsQuery = (requestIds.length > 0 ? ` AND FormWorkDayId IN (${requestIds.join(',')})` : '');

    const headerForm = `SELECT * FROM FORM WHERE CampaignId = ${campaignId} AND WorkDayId = ${workDayId} AND SalespointId = ${salespointId}${formWorkDayIdsQuery}`;
    const headerFieldDetailTheme = `SELECT * FROM FIELD_DETAIL_THEME_FORM WHERE CampaignId = ${campaignId} AND WorkDayId = ${workDayId} AND SalespointId = ${salespointId}${formWorkDayIdsQuery}`;
    const headerFieldForm = `SELECT * FROM FIELD_FORM WHERE CampaignId = ${campaignId} AND WorkDayId = ${workDayId} AND SalespointId = ${salespointId}${formWorkDayIdsQuery}`;
    const headerFieldOptionForm = `SELECT * FROM FIELD_OPTION_FORM WHERE CampaignId = ${campaignId} AND WorkDayId = ${workDayId} AND SalespointId = ${salespointId}${formWorkDayIdsQuery}`;

    return new Promise(async (resolve, reject) => {
      // Obtiene el formulario
      await this.databaseAppService.dbObject.executeSql(headerForm, [])
        .then(async (data) => {
          response = await this.preparedFormOfSelect(data);
        })
        .catch(error1 => {
        });

      if (response.length > 0) {
        // Obtiene los campos referenciados a tema
        await this.databaseAppService.dbObject.executeSql(headerFieldDetailTheme, [])
          .then(async (fieldTheme) => {
            detalleTema = await this.preparedFieldThemeOfSelect(fieldTheme);
          })
          .catch(error3 => {
          });

        await this.databaseAppService.dbObject.executeSql(headerFieldForm, [])
          .then(async (field) => {
            campo = await this.preparedFieldOfSelect(field);
          })
          .catch(error2 => {
          });

        // Obtener las opciones
        await this.databaseAppService.dbObject.executeSql(headerFieldOptionForm, [])
          .then(async (option) => {
            opcion = await this.preparedFieldOptionOfSelect(option);
          })
          .catch(error4 => {
          });

        response.forEach(form => {
          form.detalleTema = detalleTema.filter(x => x.idFormularioJornada == form.idFormularioJornada);

          form.detalleTema.forEach(detalle => {
            detalle.campos = campo.filter(x => x.idFormularioJornada == detalle.idFormularioJornada && x.idDetalleTema == detalle.idDetalleTema);

            detalle.campos.forEach(campo => {
              campo.opciones = opcion.filter(x => x.idFormularioJornada == campo.idFormularioJornada && x.idDetalleTema == campo.idDetalleTema && x.idCampo == campo.idCampo);
            });
          });
        });
      }

      resolve(response);
    });
  }

  async getAnswersFormByUserCampaign(campaignId: number, userId: number): Promise<Array<FormularioRespuesta>> {
    let respuestas: Array<FormularioRespuesta> = [];
    const query = `SELECT * FROM ANSWERS_FORM WHERE CampaignId = ${campaignId} AND UserId = ${userId}`;

    return new Promise(async (resolve, reject) => {
      await this.databaseAppService.dbObject.executeSql(query, [])
        .then(async (data) => {
          respuestas = await this.preparedAnswerFormOfSelect(data);
        }).catch(error => {
        });

      resolve(respuestas);
    });
  }

  async getAnswersFormById(campaignId: number, workDayId: number, salespointId: number, workDayFormId: number): Promise<Array<FormularioRespuesta>> {
    let respuestas: Array<FormularioRespuesta> = [];

    return new Promise(async (resolve, reject) => {
      await this.databaseAppService.dbObject.executeSql(`SELECT * FROM ANSWERS_FORM` +
        ` WHERE FormWorkDayId = ${workDayFormId}` +
        ` AND SalespointId = ${salespointId}` +
        ` AND WorkdayId = ${workDayId}` +
        ` AND CampaignId = ${campaignId}`, [])
        .then(async (data) => {
          respuestas = await this.preparedAnswerFormOfSelect(data);
        }).catch(error => {
        });
      resolve(respuestas);
    });
  }

  // Prepara los objectos de retorno para las consultas
  preparedFormListOfSelect(data: any): Promise<Array<FormularioJornada>> {
    return new Promise<Array<FormularioJornada>>((resolve, reject) => {
      const formulario: Array<FormularioJornada> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          formulario.push({
            idFormularioJornada: data.rows.item(index).FormWorkDayId,
            idPdv: data.rows.item(index).SalespointId,
            idJornada: data.rows.item(index).WorkDayId,
            nombreFormulario: data.rows.item(index).FormName,
            temaFormulario: data.rows.item(index).FormThemeName,
            obligatorio: (data.rows.item(index).Required === 1 ? true : false),
            activo: (data.rows.item(index).Active === 1 ? true : false),
            publicado: (data.rows.item(index).Published === 1 ? true : false),
            completado: (data.rows.item(index).RemoteCompleted === 1 ? true : false),
            obligatorioIcon: data.rows.item(index).RequiredIcon,
            temaFormularioIcon: data.rows.item(index).FormThemeIcon,
            isCompleted: (data.rows.item(index).IsCompleted === 1 ? true : false),
            salespointName: data.rows.item(index).SalespointName,
            isSynchronized: (data.rows.item(index).IsSynchronized === 1 ? true : false),
            idUsuarioJornada: data.rows.item(index).workDayUserId,
            fechaJornada: data.rows.item(index).WorkDayDate,
            campaignId: data.rows.item(index).CampaignId
          });
        }
      }

      resolve(formulario);
    });
  }

  preparedFormOfSelect(data: any): Promise<Array<Formulario>> {
    return new Promise<Array<Formulario>>((resolve, reject) => {
      const formulario: Array<Formulario> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          formulario.push({
            idFormularioJornada: data.rows.item(index).FormWorkDayId,
            nombreFormulario: data.rows.item(index).FormName,
            idTemaFormulario: data.rows.item(index).FormThemeId,
            edicionAprobacion: (data.rows.item(index).EditionApproval == 1 ? true : false),
            idRolEdicionAprobacion: data.rows.item(index).EditionApprovalRolId,
            fechaFinEdicionAprobacion: data.rows.item(index).EndDateEditionApproval,
            activo: (data.rows.item(index).Active == 1 ? true : false),
            obligatorio: (data.rows.item(index).Required == 1 ? true : false),
            publicado: (data.rows.item(index).Published == 1 ? true : false),
            usCreacion: data.rows.item(index).CreatorUser,
            detalleTema: [],
            idJornada: data.rows.item(index).WorkDayId,
            idPdv: data.rows.item(index).SalespointId,
            campaignId: data.rows.item(index).CampaignId
          });
        }
      }

      resolve(formulario);
    });
  }

  preparedFieldThemeOfSelect(data: any): Promise<Array<DetalleTema>> {
    return new Promise((resolve, reject) => {
      const campoDetalle: Array<DetalleTema> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          campoDetalle.push({
            idFormularioJornada: data.rows.item(index).FormWorkDayId,
            idSuperCategoria: data.rows.item(index).SuperCategoryId,
            idCategoria: data.rows.item(index).CategoryId,
            idMarca: data.rows.item(index).MarkeId,
            idLineaProducto: data.rows.item(index).ProductLineId,
            idProducto: data.rows.item(index).ProductId,
            idDetalleTema: data.rows.item(index).DetailThemeId,
            detalleTema: data.rows.item(index).DetailTheme,
            imagenTema: data.rows.item(index).ImageTheme,
            campos: [],
            isSaveLoading: (data.rows.item(index).IsSaveLoading == 1 ? true : false),
            isCompleted: (data.rows.item(index).IsCompleted == 1 ? true : false)
          });
        }
      }

      resolve(campoDetalle);
    });
  }

  preparedFieldOfSelect(data: any): Promise<Array<Campo>> {
    return new Promise((resolve, reject) => {
      const campo: Array<Campo> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          campo.push({
            idCampo: data.rows.item(index).FieldId,
            tipoCampo: data.rows.item(index).FieldType,
            nombreCampo: data.rows.item(index).FieldName,
            idControl: data.rows.item(index).ControlId,
            idTipoCampo: data.rows.item(index).FieldTypeId,
            tipoControl: data.rows.item(index).ControlType,
            prefijo: data.rows.item(index).Prefix,
            obligatorio: (data.rows.item(index).Required == 1 ? true : false),
            activo: (data.rows.item(index).Active == 1 ? true : false),
            orden: data.rows.item(index).Orden,
            reutilizable: (data.rows.item(index).Reusable == 1 ? true : false),
            referenteTema: (data.rows.item(index).ReferenceTheme == 1 ? true : false),
            opciones: [],
            idCampoDependenciaPadre: (data.rows.item(index).ParentDependencyId != 0 ? data.rows.item(index).ParentDependencyId : null),
            imageUploadUrl: data.rows.item(index).ImageUploadUrl,
            idDetalleTema: data.rows.item(index).DetailThemeId,
            idFormularioJornada: data.rows.item(index).FormWorkDayId,
            visible: (data.rows.item(index).Visible == 1 ? true : false)
          });
        }
      }

      resolve(campo);
    });
  }

  preparedFieldOptionOfSelect(data: any): Promise<Array<Opcion>> {
    return new Promise((resolve, reject) => {
      const opciones: Array<Opcion> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          opciones.push({
            idCampo: data.rows.item(index).FieldId,
            idDetalleTema: data.rows.item(index).DetailThemeId,
            idFormularioJornada: data.rows.item(index).FormWorkDayId,
            idValor: data.rows.item(index).ValueId,
            valor: data.rows.item(index).Value,
            idCampoDependenciaHijo: (data.rows.item(index).ChildDependencyId != 0 ? data.rows.item(index).ChildDependencyId : null),
          });
        }
      }

      resolve(opciones);
    });
  }

  preparedAnswerFormOfSelect(data: any): Promise<Array<FormularioRespuesta>> {
    return new Promise((resolve, reject) => {
      const respuestas: Array<FormularioRespuesta> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          const isExists = respuestas.some(x =>
            x.idFormularioJornada == data.rows.item(index).FormWorkDayId &&
            x.idDetalleTema == data.rows.item(index).DetailThemeId &&
            x.idCampo == data.rows.item(index).FieldId);

          if (!isExists) {
            respuestas.push({
              idFormularioJornada: data.rows.item(index).FormWorkDayId,
              idUsuario: data.rows.item(index).UserId,
              idPdv: data.rows.item(index).SalespointId,
              idJornada: data.rows.item(index).WorkdayId,
              fechaReporte: data.rows.item(index).ReportDate,
              idDetalleTema: data.rows.item(index).DetailThemeId,
              idControl: data.rows.item(index).ControlId,
              idCampo: data.rows.item(index).FieldId,
              valor: [data.rows.item(index).Answers],
              valueFileUploadUrl: (data.rows.item(index).AnswerFileUrl != '' ? data.rows.item(index).AnswerFileUrl : null),
              valueFileSendUrl: (data.rows.item(index).AnswerFileSendUrl != '' ? data.rows.item(index).AnswerFileSendUrl : null),
              usCreacion: data.rows.item(index).CreatorUser
            });
          } else {
            const indexAnswer = respuestas.findIndex(x => x.idDetalleTema == data.rows.item(index).DetailThemeId && x.idCampo == data.rows.item(index).FieldId);
            respuestas[indexAnswer].valor.push(data.rows.item(index).Answers);
          }
        }
      }

      resolve(respuestas);
    });
  }

  async updateFormListCompleted(workDayId: number, salespointId: number, formId: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.databaseAppService.dbObject.executeSql(`UPDATE FORM_LIST SET IsCompleted = 1 WHERE WorkDayId = ${workDayId} AND SalespointId = ${salespointId} AND FormWorkDayId = ${formId}`, [])
        .then(() => resolve(true))
        .catch((error) => {
          resolve(false);
        });
    });
  }

  async updateFormListSyncronized(workDayId: number, salespointId: number, formId: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.databaseAppService.dbObject.executeSql(`UPDATE FORM_LIST SET IsSynchronized = 1 WHERE WorkDayId = ${workDayId} AND SalespointId = ${salespointId} AND FormWorkDayId = ${formId}`, [])
        .then(() => resolve(true))
        .catch((error) => {
          resolve(false);
        });
    });
  }

  async createDependencyFormTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS DEPENDENCY_FORM (' +
      'DependecyFormDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', DependencyId INTEGER NOT NULL' +
      ', Name TEXT NOT NULL' +
      ', Active INTEGER' +
      ', Type TEXT' +
      ', Parameter1 TEXT' +
      ', Value1 INTEGER' +
      ', Parameter2 TEXT' +
      ', Value2 INTEGER' +
      ', CampaignId INTEGER NOT NULL' +
      ', FormThemeId INTEGER NOT NULL' +
      ')', [])
      .then(() => result = true)
      .catch(error => {
        result = false;
        console.log('ERROR CREATE TABLE DEPENDENCY_FORM', error);
      });
    return result;
  }

  async addDependencyFormTable(request: Array<DependencyThemeForm>): Promise<boolean> {
    const headerInsert = 'INSERT INTO DEPENDENCY_FORM (DependencyId,Name,Active,Type,Parameter1,Value1,Parameter2,Value2,CampaignId,FormThemeId)' +
      ' SELECT ?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM DEPENDENCY_FORM WHERE DependencyId = ? AND Type = ? AND CampaignId = ? AND FormThemeId = ?)';

    const headerUpdate = 'UPDATE DEPENDENCY_FORM SET Name = ?, Active = ?, Parameter1 = ?, Value1 = ?, Parameter2 = ?, Value2 = ?' +
      ' WHERE DependencyId = ? AND Type = ? AND CampaignId = ? AND FormThemeId = ?';

    const valuesInsert = request.reduce((prev, curr) => {
      prev.push([curr.idTemaDependencia, curr.nombreTemaDependencia, (curr.activoTemaDependencia ? 1 : 0), curr.tipoTemaDependencia,
      curr.parametro1, curr.valor1, curr.parametro2, curr.valor2, curr.campaignId, curr.formThemeId,
      curr.idTemaDependencia, curr.tipoTemaDependencia, curr.campaignId, curr.formThemeId]);
      return prev;
    }, []);

    const valuesUpdate = request.reduce((prev, curr) => {
      prev.push([curr.nombreTemaDependencia, (curr.activoTemaDependencia ? 1 : 0), curr.parametro1, curr.valor1, curr.parametro2, curr.valor2,
      curr.idTemaDependencia, curr.tipoTemaDependencia, curr.campaignId, curr.formThemeId]);
      return prev;
    }, []);

    if (valuesInsert.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        valuesInsert.forEach((item) => {
          tx.executeSql(headerInsert, item);
        })
      });
    }

    if (valuesUpdate.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        valuesUpdate.forEach((item) => {
          tx.executeSql(headerUpdate, item);
        })
      });
    }

    return true;
  }

  async getDependencyFormCollection(campaignId: number): Promise<Array<DependencyThemeForm>> {
    let response: Array<DependencyThemeForm> = [];
    const sentenceSQL: string = 'SELECT * FROM DEPENDENCY_FORM WHERE CampaignId = ?';
    return new Promise(async (resolve, reject) => {
      await this.databaseAppService.dbObject.executeSql(sentenceSQL, [campaignId])
        .then(async (data) => {
          response = await this.preparedDependencyFormCollection(data);
        })
        .catch(error => console.log('ERROR SELECT TABLE DEPENDENCY_FORM', error))

      resolve(response);
    });
  }

  async preparedDependencyFormCollection(data: any): Promise<Array<DependencyThemeForm>> {
    return new Promise<Array<DependencyThemeForm>>((resolve, reject) => {
      let collection: Array<DependencyThemeForm> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          collection.push({
            idTemaDependencia: data.rows.item(index).DependencyId,
            nombreTemaDependencia: data.rows.item(index).Name,
            activoTemaDependencia: (data.rows.item(index).Active === 1 ? true : false),
            tipoTemaDependencia: data.rows.item(index).Type,
            parametro1: data.rows.item(index).Parameter1,
            valor1: data.rows.item(index).Value1,
            parametro2: data.rows.item(index).Parameter2,
            valor2: data.rows.item(index).Value2,
            campaignId: data.rows.item(index).CampaignId,
            formThemeId: data.rows.item(index).FormThemeId
          });
        }
      }

      resolve(collection);
    });
  }

  async createDependencyFormApplyTable(): Promise<boolean> {
    let result = false;
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS DEPENDENCY_APPLY_FORM (' +
      'DependecyApplyFormDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', WorkDayId INTEGER NOT NULL' +
      ', SalespointId INTEGER NOT NULL' +
      ', FormWorkDayId INTEGER NOT NULL' +
      ', Identifier TEXT NOT NULL' +
      ', Title TEXT' +
      ', Subtitle TEXT' +
      ', ValueSelected INTEGER' +
      ')', [])
      .then(() => result = true)
      .catch(error => {
        result = false;
        console.log('ERROR CREATE TABLE DEPENDENCY_APPLY_FORM', error);
      });
    return result;
  }

  async addDependencyFormApplyTable(workDayId: number, salespointId: number, formWorkDayId: number, request: Array<FilterDependencyThemeForm>): Promise<boolean> {
    const headerInsert = 'INSERT INTO DEPENDENCY_APPLY_FORM (WorkDayId,SalespointId,FormWorkDayId,Identifier,Title,Subtitle,ValueSelected)' +
      ' SELECT ?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM DEPENDENCY_APPLY_FORM WHERE WorkDayId = ? AND SalespointId = ? AND FormWorkDayId = ? AND Identifier = ?)';

    const headerUpdate = 'UPDATE DEPENDENCY_APPLY_FORM SET ValueSelected = ? WHERE WorkDayId = ? AND SalespointId = ? AND FormWorkDayId = ? AND Identifier = ?';

    const valuesInsert = request.reduce((prev, curr) => {
      prev.push([workDayId, salespointId, formWorkDayId, curr.identifier, curr.title, curr.subtitle, (curr.valueSelected ? curr.valueSelected : 0), workDayId, salespointId, formWorkDayId, curr.identifier]);
      return prev;
    }, []);

    const valuesUpdate = request.reduce((prev, curr) => {
      prev.push([(curr.valueSelected ? curr.valueSelected : 0), workDayId, salespointId, formWorkDayId, curr.identifier]);
      return prev;
    }, []);

    if (valuesInsert.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        valuesInsert.forEach((item) => {
          tx.executeSql(headerInsert, item);
        })
      });
    }

    if (valuesUpdate.length > 0) {
      await this.databaseAppService.dbObject.transaction((tx) => {
        valuesUpdate.forEach((item) => {
          tx.executeSql(headerUpdate, item);
        })
      });
    }

    return true;
  }

  async getDependencyFormApplyCollection(workDayId: number, salespointId: number, formWorkDayId: number): Promise<Array<FilterDependencyThemeForm>> {
    let response: Array<FilterDependencyThemeForm> = [];
    const sentenceSQL: string = 'SELECT * FROM DEPENDENCY_APPLY_FORM WHERE WorkDayId = ? AND SalespointId = ? AND FormWorkDayId = ?';
    return new Promise(async (resolve, reject) => {
      await this.databaseAppService.dbObject.executeSql(sentenceSQL, [workDayId, salespointId, formWorkDayId])
        .then(async (data) => {
          response = await this.preparedDependencyFormApplyCollection(data);
        })
        .catch(error => console.log('ERROR SELECT TABLE DEPENDENCY_APPLY_FORM', error))

      resolve(response);
    });
  }

  async preparedDependencyFormApplyCollection(data: any): Promise<Array<FilterDependencyThemeForm>> {
    return new Promise<Array<FilterDependencyThemeForm>>((resolve, reject) => {
      let collection: Array<FilterDependencyThemeForm> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          collection.push({
            identifier: data.rows.item(index).Identifier,
            title: data.rows.item(index).Title,
            subtitle: data.rows.item(index).Subtitle,
            options: [],
            valueSelected: (data.rows.item(index).ValueSelected === 0 ? null : data.rows.item(index).ValueSelected)
          });
        }
      }

      resolve(collection);
    });
  }
}
