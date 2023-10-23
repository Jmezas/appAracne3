import { Injectable } from '@angular/core';

import { DatabaseAppService } from './database-app.service';

import { AnswerDb, AnswerImageDb } from '../../shared/models/database-model/answer-db.interface';

@Injectable({
  providedIn: 'root'
})
export class TableAnswerService {
  resultOfTable: boolean = false;

  constructor(private databaseAppService: DatabaseAppService) { }

  async createTableAnswer(): Promise<boolean> {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS ANSWER (' +
      'AnswerDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', LogChecklistDbId INTEGER' +
      ', ChecklistId INTEGER' +
      ', QuestionId INTEGER NOT NULL' +
      ', Answer TEXT' +
      ', WeightingValue INTEGER' +
      ', AnswerImage TEXT' +
      ', UserId INTEGER' +
      ', CampaignId INTEGER' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false
      });

    return this.resultOfTable;
  }

  async addAnswers(request: AnswerDb): Promise<boolean> {
    const data = [request.logChecklistDbId, request.checklistId, request.questionId, request.answer, request.weightingValue, request.answerImage, request.userId, request.campaignId];
    await this.databaseAppService.dbObject.executeSql('INSERT INTO ANSWER (LogChecklistDbId, ChecklistId, QuestionId, Answer, WeightingValue, AnswerImage, UserId, CampaignId) VALUES (?,?,?,?,?,?,?,?)', data)
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  async getAnswerCollection(): Promise<Array<AnswerDb>> {
    let response: Array<AnswerDb> = [];

    await this.databaseAppService.dbObject.executeSql('SELECT * FROM ANSWER', [])
      .then(async (data) => { 
        response = await this.preparedDataOfSelect(data) 
      })
      .catch(error => {
      });

    return response;
  }

  async getAnswersByLogDbId(logChecklistDbId: number): Promise<Array<AnswerDb>> {
    let response: Array<AnswerDb> = [];
    const data = [logChecklistDbId];

    await this.databaseAppService.dbObject.executeSql('SELECT * FROM ANSWER WHERE LogChecklistDbId = ?', data)
      .then(async (data) => { 
        response = await this.preparedDataOfSelect(data) 
      })
      .catch(error => {
      });

    return response;
  }

  preparedDataOfSelect(data: any): Promise<Array<AnswerDb>> {
    return new Promise<Array<AnswerDb>>((resolve, reject) => {
      let answerCollection: AnswerDb[] = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          answerCollection.push({
            answerDbId: data.rows.item(index).AnswerDbId,
            logChecklistDbId: data.rows.item(index).LogChecklistDbId,
            checklistId: data.rows.item(index).ChecklistId,
            questionId: data.rows.item(index).QuestionId,
            answer: data.rows.item(index).Answer,
            weightingValue: data.rows.item(index).WeightingValue,
            answerImage: data.rows.item(index).AnswerImage,
            userId: data.rows.item(index).UserId,
            campaignId: data.rows.item(index).CampaignId
          });
        }
      }

      resolve(answerCollection);
    });
  }

  async deleteAnswerByLogChecklistIds(logChecklistDbId: number[]): Promise<boolean> {
    const ids: string = logChecklistDbId.join(','); 
    await this.databaseAppService.dbObject.executeSql(`DELETE FROM ANSWER WHERE LogChecklistDbId IN (${ids})`, [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  } 

  async createTableAnswerImage(): Promise<boolean> {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS ANSWER_IMAGE (' +
      'AnswerImageDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', LogChecklistDbId INTEGER' +
      ', ChecklistId INTEGER' +
      ', QuestionPartId TEXT' +
      ', CampaignName TEXT' +
      ', ImagePath TEXT' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  async addAnswerImages(request: AnswerImageDb[]) {
    request.forEach((item, i) => {
      const data = [item.logChecklistDbId, item.checklistId, item.questionPartId, item.campaignName, item.imagePath];
      this.databaseAppService.dbObject.executeSql('INSERT INTO ANSWER_IMAGE (LogChecklistDbId, ChecklistId, QuestionPartId, CampaignName, ImagePath) VALUES (?,?,?,?,?)', data);
    });
  }

  async getAnswerImageCollection(): Promise<Array<AnswerImageDb>> {
    let response: Array<AnswerImageDb> = [];

    await this.databaseAppService.dbObject.executeSql('SELECT * FROM ANSWER_IMAGE', [])
      .then(data => {
        if (data.rows.length > 0) {
          for (let index = 0; index < data.rows.length; index++) {
            response.push({
              answerImageDbId: data.rows.item(index).AnswerImageDbId,
              logChecklistDbId: data.rows.item(index).LogChecklistDbId,
              checklistId: data.rows.item(index).ChecklistId,
              questionPartId: data.rows.item(index).QuestionPartId,
              campaignName: data.rows.item(index).CampaignName,
              imagePath: data.rows.item(index).ImagePath
            });
          }
        }
      })
      .catch(error => {
      });

    return response;
  }

  async deleteAnswerImagesByLogChecklistIds(logChecklistDbId: number[]): Promise<boolean> {
    const ids: string = logChecklistDbId.join(','); 
    await this.databaseAppService.dbObject.executeSql(`DELETE FROM ANSWER_IMAGE WHERE LogChecklistDbId IN (${ids})`, [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }
}
