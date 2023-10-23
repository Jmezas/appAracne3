import { Injectable } from '@angular/core';

import { DatabaseAppService } from './database-app.service';
import { LogChecklistRequest, LogChecklistResponse } from '../../shared/models/checklist.interface';

import * as moment from 'moment';
import { LogChecklistDb } from '../../shared/models/database-model/log-checklist-db.interface';

@Injectable({
  providedIn: 'root'
})
export class TableLogChecklistService {
  resultOfTable: boolean = false;

  constructor(private databaseAppService: DatabaseAppService) { }

  async createTable(): Promise<boolean> {
    await this.databaseAppService.dbObject.executeSql('CREATE TABLE IF NOT EXISTS LOG_CHECKLIST (' +
      'LogChecklistDbId INTEGER PRIMARY KEY AUTOINCREMENT' +
      ', ChecklistId INTEGER NOT NULL' +
      ', UserId INTEGER' +
      ', AccessCounter INTEGER' +
      ', LastAccessDate TEXT' +
      ', Date TEXT' +
      ', CompletedPercent INTEGER' +
      ', Score INTEGER' +
      ', RecordDate TEXT' +
      ', UserSelectionId INTEGER' +
      ', SalespointSelectionId INTEGER' +
      ', Timing TEXT' +
      ')', [])
      .then(() => this.resultOfTable = true)
      .catch((error) => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  async addLogChecklist(log: LogChecklistRequest): Promise<boolean> {
    const data = [log.checklistId, log.userId, log.accessCounter, log.lastAccessDate, log.date, log.completePercent, log.notes, log.recordDate, log.userSelection, log.salespointSelection]
    await this.databaseAppService.dbObject.executeSql('INSERT INTO LOG_CHECKLIST (ChecklistId,UserId,AccessCounter,LastAccessDate,Date,CompletedPercent,Score,RecordDate,UserSelectionId,SalespointSelectionId)' +
      `VALUES (?,?,?,?,?,?,?,?,?,?)`, data)
      .then(() => this.resultOfTable = true)
      .catch((error) => {
        this.resultOfTable = false;
        return;
      });

    return this.resultOfTable;
  }

  async getLogChecklistCollection(): Promise<Array<LogChecklistDb>> {
    return this.databaseAppService.dbObject.executeSql('SELECT * FROM LOG_CHECKLIST', [])
      .then(data => this.preparedDataOfSelect(data))
      .catch((error) => {
        return []
      });
  }

  // Devuelve el log último del día que no esta asociado a un checklist guardado
  async getLastLogChecklistByChecklistOfDay(checklistId: number, userId: number): Promise<Array<LogChecklistDb>> {
    const today = moment().format("YYYY-MM-DD");

    const data = [checklistId, userId, today];
    return this.databaseAppService.dbObject.executeSql('SELECT l.* FROM LOG_CHECKLIST l' +
      ' LEFT JOIN ANSWER r' +
      ' ON l.LogChecklistDbId = r.LogChecklistDbId' +
      ' WHERE l.ChecklistId = ? AND l.UserId = ? AND SUBSTR(l.RecordDate,1,10) = ?' +
      ' AND r.LogChecklistDbId IS NULL' +
      ' ORDER BY l.LogChecklistDbId DESC LIMIT 1',
      data)
      .then(data => this.preparedDataOfSelect(data))
      .catch(error => {
        return [];
      });
  }

  preparedDataOfSelect(data: any): Promise<Array<LogChecklistDb>> {
    return new Promise<LogChecklistDb[]>((resolve, reject) => {
      let log_encuestas: LogChecklistDb[] = [];

      if (data.rows.length > 0) {
        for (let index = 0; index < data.rows.length; index++) {
          log_encuestas.push({
            logChecklistDbId: data.rows.item(index).LogChecklistDbId,
            checklistId: data.rows.item(index).ChecklistId,
            userId: data.rows.item(index).UserId,
            accessCounter: data.rows.item(index).AccessCounter,
            lastAccessDate: data.rows.item(index).LastAccessDate,
            date: data.rows.item(index).Date,
            completedPercent: data.rows.item(index).CompletedPercent,
            score: data.rows.item(index).Score != '' ? data.rows.item(index).Score : null,
            recordDate: data.rows.item(index).RecordDate,
            userSelectionId: data.rows.item(index).UserSelectionId,
            salespointSelectionId: data.rows.item(index).SalespointSelectionId != '' ? data.rows.item(index).SalespointSelectionId : null,
            timing: data.rows.item(index).Timing
          });
        }
      }

      resolve(log_encuestas);
    });
  }

  async updateLogChecklist(request: LogChecklistDb): Promise<boolean> {
    const data = [request.completedPercent, request.score, request.timing, request.recordDate]
    await this.databaseAppService.dbObject.executeSql('UPDATE LOG_CHECKLIST' +
      ` SET CompletedPercent = ?, Score = ?, Timing = ?, RecordDate = ?` +
      ` WHERE LogChecklistDbId = ${request.logChecklistDbId}`, data)
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }

  async deleteLogChecklist(logChecklistDbId: number[]): Promise<boolean> {
    const ids: string = logChecklistDbId.join(','); 
    await this.databaseAppService.dbObject.executeSql(`DELETE FROM LOG_CHECKLIST WHERE LogChecklistDbId IN (${ids})`, [])
      .then(() => this.resultOfTable = true)
      .catch(error => {
        this.resultOfTable = false;
      });

    return this.resultOfTable;
  }
}
