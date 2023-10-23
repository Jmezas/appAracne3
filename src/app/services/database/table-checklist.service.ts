import { Injectable } from '@angular/core';

import { DatabaseAppService } from './database-app.service';

import { ChecklistCollection } from '../../shared/models/checklist.interface';

@Injectable({
  providedIn: 'root'
})
export class TableChecklistService {
  resultOfTable: boolean = false;

  constructor(private databaseAppService: DatabaseAppService) { }

  async createTable(): Promise<boolean> {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS CHECKLIST (' +
      'ChecklistDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', ChecklistId INTEGER NOT NULL' +
      ', CampaignId INTEGER NOT NULL' +
      ', ChecklistTitle TEXT NOT NULL' +
      ', QuestionCount INTEGER' +
      ', Introduction TEXT' +
      ', Farewell TEXT' +
      ', CreationDate TEXT' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  async addChecklist(request: Array<ChecklistCollection>) {
    request.forEach((item, i) => {
      const data = [item.IdEncuesta, item.IdCampaña, item.TituloChecklist, item.NroPreguntas, item.Introduccion, item.Despedida, item.FechaCreacion, item.IdEncuesta, item.IdCampaña];
      this.databaseAppService.dbObject.executeSql('INSERT INTO CHECKLIST (ChecklistId, CampaignId, ChecklistTitle, QuestionCount, Introduction, Farewell, CreationDate) ' +
        'SELECT ?,?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM CHECKLIST WHERE ChecklistId = ? AND CampaignId = ?)', data);
    });
  }

  async getChecklist(): Promise<Array<ChecklistCollection>> {
    return await this.databaseAppService.dbObject.executeSql('SELECT * FROM CHECKLIST', [])
      .then(data => this.preparedDataOfSelect(data))
      .catch(error => {
        return [];
      });
  }

  async getChecklistById(checklistId: number): Promise<Array<ChecklistCollection>> {
    return await this.databaseAppService.dbObject.executeSql(`SELECT * FROM CHECKLIST WHERE ChecklistId = ${checklistId}`, [])
      .then(data => this.preparedDataOfSelect(data))
      .catch(error => {
        return [];
      })
  }

  preparedDataOfSelect(data: any): Promise<Array<ChecklistCollection>> {
    return new Promise<Array<ChecklistCollection>>((resolve, reject) => {
      let checklistCollection: ChecklistCollection[] = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          checklistCollection.push({
            IdEncuesta: data.rows.item(index).ChecklistId,
            IdCampaña: data.rows.item(index).CampaignId,
            TituloChecklist: data.rows.item(index).ChecklistTitle,
            NroPreguntas: data.rows.item(index).QuestionCount,
            Introduccion: data.rows.item(index).Introduction,
            Despedida: data.rows.item(index).Farewell,
            FechaCreacion: data.rows.item(index).CreationDate
          });
        }
      }

      resolve(checklistCollection);
    });
  }
}
