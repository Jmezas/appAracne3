import { Injectable } from '@angular/core';

import { DatabaseAppService } from './database-app.service';
import { QuestionAnswersChecklist, QuestionChecklistValue } from '../../shared/models/checklist.interface';

@Injectable({
  providedIn: 'root'
})
export class TableQuestionService {
  resultOfTable: boolean = false;

  constructor(private databaseAppService: DatabaseAppService) { }

  async createTableQuestion() {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS QUESTION (' +
      'QuestionDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', QuestionId INTEGER' +
      ', ChecklistId INTEGER' +
      ', QuestionType INTERGER' +
      ', BlockTitle TEXT' +
      ', Question TEXT' +
      ', QuestionOrder INTEGER' +
      ', Required INTEGER' +
      ', Active INTEGER' +
      ', QuestionTypeId INTEGER' +
      ', BlockChecklistId INTEGER' +
      ', BlockDescription TEXT' +
      ', Image TEXT' +
      ', ImagePath TEXT' +
      ', CampaignId INTEGER' +
      ', Campaign TEXT' +
      ', BlockOrder INTEGER' +
      ', ImageAnswerCount INTEGER' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  async addQuestions(request: QuestionAnswersChecklist[]) {
    request.forEach((item, i) => {
      const data = [item.IdPregunta, item.IdEncuesta, item.TipoPregunta, item.TituloBloque, item.Pregunta, item.Orden, (item.Obligatoria ? 1 : 0), (item.Activo ? 1 : 0),
      item.IdTipoPregunta, item.IdBloqueEncuesta, item.DescripcionBloque, item.Imagen, item.RutaImagen, item.IdCampania, item.Campania, item.OrdenBloque, item.CantImgRespuesta, 
      item.IdEncuesta, item.IdPregunta];

      this.databaseAppService.dbObject.executeSql('INSERT INTO QUESTION (QuestionId, ChecklistId, QuestionType, BlockTitle, Question, QuestionOrder, Required, Active' +
        ', QuestionTypeId, BlockChecklistId, BlockDescription, Image, ImagePath, CampaignId, Campaign, BlockOrder, ImageAnswerCount) ' +
        'SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM QUESTION WHERE ChecklistId = ? AND QuestionId = ?)', data);
    });
  }

  async getQuestionCollection(): Promise<Array<QuestionAnswersChecklist>> {
    return await this.databaseAppService.dbObject.executeSql('SELECT * FROM QUESTION', [])
      .then(data => this.preparedQuestionCollection(data))
      .catch(error => {
        return [];
      });
  }

  async getQuestionCollectionById(checklistId: number): Promise<Array<QuestionAnswersChecklist>> {
    return await this.databaseAppService.dbObject.executeSql(`SELECT * FROM QUESTION WHERE ChecklistId = ${checklistId}`, [])
      .then(data => this.preparedQuestionCollection(data))
      .catch(error => {
        return [];
      });
  }

  async preparedQuestionCollection(data: any): Promise<Array<QuestionAnswersChecklist>> {
    return new Promise((resolve, reject) => {
      let preguntasCollection: Array<QuestionAnswersChecklist> = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          preguntasCollection.push({
            IdPregunta: data.rows.item(index).QuestionId,
            IdEncuesta: data.rows.item(index).ChecklistId,
            TipoPregunta: data.rows.item(index).QuestionType,
            TituloBloque: data.rows.item(index).BlockTitle,
            Pregunta: data.rows.item(index).Question,
            Orden: data.rows.item(index).QuestionOrder,
            Obligatoria: (data.rows.item(index).Required == 1 ? true : false),
            Activo: (data.rows.item(index).Active == 1 ? true : false),
            IdTipoPregunta: data.rows.item(index).QuestionTypeId,
            IdBloqueEncuesta: data.rows.item(index).BlockChecklistId,
            DescripcionBloque: data.rows.item(index).BlockDescription,
            Imagen: data.rows.item(index).Image,
            RutaImagen: data.rows.item(index).ImagePath,
            IdCampania: data.rows.item(index).CampaignId,
            Campania: data.rows.item(index).Campaign,
            OrdenBloque: data.rows.item(index).BlockOrder,
            CantImgRespuesta: data.rows.item(index).ImageAnswerCount
          });
        }
      }

      resolve(preguntasCollection);
    });
  }

  async createTableQuestionOption() {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS QUESTIONS_OPTIONS (' +
      'QuestionOptionDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', QuestionOptionId INTEGER' +
      ', QuestionId INTEGER' +
      ', Value TEXT' +
      ', WeightingValue INTEGER' +
      ', Active INTEGER' +
      ', Selection INTEGER' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  async addQuestionOptions(request: QuestionChecklistValue[]) {
    request.forEach((item, i) => {
      const data = [item.IdValorPregunta, item.IdPregunta, item.Valor, item.PonderacionValor, (item.Activo ? 1 : 0), (item.Seleccion ? 1 : 0), item.IdPregunta, item.IdValorPregunta];
      this.databaseAppService.dbObject.executeSql('INSERT INTO QUESTIONS_OPTIONS (QuestionOptionId, QuestionId, Value, WeightingValue, Active, Selection) ' + 
      'SELECT ?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM QUESTIONS_OPTIONS WHERE QuestionId = ? AND QuestionOptionId = ?)', data);
    });
  }

  async getQuestionOptionsByIdCollection(questionIds: number[]): Promise<Array<QuestionChecklistValue>> {
    let resultCollection: Array<QuestionChecklistValue> = [];
    
    // await this.databaseAppService.dbObject.executeSql(`SELECT * FROM QUESTIONS_OPTIONS WHERE IdPregunta IN (${'?,'.repeat(questionIds.length).slice(0,-1)})`, questionIds)
    await this.databaseAppService.dbObject.executeSql('SELECT * FROM QUESTIONS_OPTIONS', [])
      .then(result => {
        if (result.rows.length > 0) {
          for (let index = 0; index < result.rows.length; index++) {
            resultCollection.push({
              IdValorPregunta: result.rows.item(index).QuestionOptionId,
              IdPregunta: result.rows.item(index).QuestionId,
              Valor: result.rows.item(index).Value,
              PonderacionValor: result.rows.item(index).WeightingValue,
              Activo: result.rows.item(index).Active,
              Seleccion: (result.rows.item(index).Selection == 1 ? true : false)
            });
          }
        }
      })
      .catch(error => {
        return [];
      });

    return resultCollection;
  }
}
