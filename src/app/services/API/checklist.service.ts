import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { HttpService } from '../http.service';
import { TYPE_REQUEST } from '../../shared/constants/values.constants';

import {
  AnswerChecklistRequest,
  ChecklistResponse,
  ChecklistCollection, LogChecklistRequest,
  LogChecklistResponse, QuestionAnswersChecklist, ChecklistHistory
} from '../../shared/models/checklist.interface';

import { Observable, of } from 'rxjs';
import { catchError, first, map, mergeMap } from 'rxjs/operators';

import { LogChecklistDb, LogChecklistDbSyncResponse } from '../../shared/models/database-model/log-checklist-db.interface';
import { AnswerDbSyncRequest, AnswerDbSyncResponse } from '../../shared/models/database-model/answer-db.interface';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  constructor(private httpService: HttpService) { }

  // Checklist Fija
  getChecklistFijaCollection(campaignId: number, userId: number): Observable<Array<ChecklistCollection>> {
    const request = {
      "formatValues": "int,int",
      "procedureName": environment.DB.PROCEDURES.GET_FIXED_CHECKLISTS,
      "values": `${campaignId},${userId}`,
      "parameters": "IdCampaña,IdUsuario",
      "sqlName": environment.DB.SQL_NAME.CHECKLIST_ARACNE2
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request).pipe(
      map(response => {
        const result: Array<ChecklistCollection> = response.map(x => ({ ...x, TituloChecklist: x['Título CheckList'], NroPreguntas: x['Nº Preguntas'] }));
        return result;
      }));
  }

  getQuestionsChecklistFija(checklistId: number, campaignId: number, userId: number, logChecklistId: number): Observable<Array<QuestionAnswersChecklist>> {
    const request = {
      "formatValues": "int,int,int,int",
      "procedureName": environment.DB.PROCEDURES.GET_QUESTION_FIXED_CHECKLISTS,
      "values": `${checklistId},${campaignId},${userId},${logChecklistId}`,
      "parameters": "IdEncuesta,IdCampania,IdUsuario,idLogEncuestaUsuario",
      "sqlName": environment.DB.SQL_NAME.CHECKLIST_ARACNE2
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request)
      .pipe(
        mergeMap(response => this.getQuestionValuesChecklist(response)),
        catchError(error => [])
      )
  }

  // Checklist Normal
  getChecklistCollection(campaignId: number, userId: number): Observable<Array<ChecklistCollection>> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
      .set('query', 'SELECT * FROM View_Encuestas_Campañas'
        + ` WHERE IdCampaña = ${campaignId} AND IdUsuario = ${userId} AND Activo = 1 AND CheckListFijo = 0`
        + ' ORDER BY TituloCheckList ASC')
      .set('sqlName', environment.DB.SQL_NAME.CHECKLIST_ARACNE2)

    return this.httpService.getWithParams(params)
      .pipe(
        map((result: Array<ChecklistCollection>) => result),
        catchError(error => [])
      );
  }

  getChecklistHistory(userId: number, campaignId: number): Observable<Array<ChecklistHistory>> {
    const request = {
      "formatValues": "int,int",
      "procedureName": environment.DB.PROCEDURES.GET_CHECKLIST_HISTORIAL,
      "values": `${campaignId},${userId}`,
      "parameters": "IdCampania,IdUsuario",
      "sqlName": environment.DB.SQL_NAME.CHECKLIST_ARACNE2
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request);
  }

  getQuestionChecklist(checklistId: number): Observable<Array<QuestionAnswersChecklist>> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
      .set('query', `SELECT * FROM View_Preguntas_Encuestas WHERE Activo = 1 AND IdEncuesta = ${checklistId} ORDER BY OrdenBloque, Orden`)
      .set('sqlName', environment.DB.SQL_NAME.CHECKLIST_ARACNE2);

    return this.httpService.getWithParams(params)
      .pipe(
        mergeMap(response => this.getQuestionValuesChecklist(response)),
        catchError(error => [])
      )
  }

  getQuestionWithAnswersChecklist(checklistId: number, salespointId: number): Observable<Array<QuestionAnswersChecklist>> {
    const request = {
      "formatValues": "varchar,varchar",
      "procedureName": environment.DB.PROCEDURES.GET_QUESTION_ANSWER_CHECKLIST,
      "values": `${checklistId},${salespointId}`,
      "parameters": "IdEncuesta,IdPV",
      "sqlName": environment.DB.SQL_NAME.CHECKLIST_ARACNE2
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request)
      .pipe(
        mergeMap(response => this.getQuestionValuesChecklist(response)),
        catchError(error => [])
      )
  }

  getQuestionsChecklistByIds(checklistIds: number[]): Observable<Array<QuestionAnswersChecklist>> {
    const prevParams = checklistIds.reduce((prev, accr) => { return prev + `${accr};` }, '');
    const values = prevParams.slice(0, -1);
    const request = {
      "formatValues": "varchar",
      "procedureName": environment.DB.PROCEDURES.GET_QUESTIONS_ANSWER_CHECKLIST_IDS,
      "values": values,
      "parameters": 'EncuestaIds',
      "sqlName": environment.DB.SQL_NAME.CHECKLIST_ARACNE2
    }

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request)
      .pipe(
        mergeMap(response => this.getQuestionValuesChecklist(response)),
        catchError(error => [])
      )
  }

  getQuestionValuesChecklist(questions: any): Observable<Array<QuestionAnswersChecklist>> {
    const response: Array<QuestionAnswersChecklist> = questions.map(x => ({ ...x, TipoPregunta: x['Tipo Pregunta'], TituloBloque: x['Titulo Bloque'], IdCampania: x['IdCampaña'], Campania: x['Campaña'] }));
    const questionIDs = questions.map((x) => x.IdPregunta).join(',');

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
      .set('query', `SELECT * FROM Trans_Valores_Preguntas WHERE Activo = 1 AND IdPregunta IN (${questionIDs.toString()})`)
      .set('sqlName', environment.DB.SQL_NAME.CHECKLIST_ARACNE2)

    return this.httpService.getWithParams(params)
      .pipe(
        map(result => {
          if (result.length > 0) {
            return response.map(x => ({ ...x, QuestionValues: result.filter(y => x.IdPregunta == y.IdPregunta).map(y => ({ ...y, Selection: false })) }))
          } else {
            return response;
          }
        }),
        catchError(error => [])
      )
  }

  // Save Checklist 
  postAnswerChecklist(answers: AnswerChecklistRequest, isFixed: boolean = false): Observable<ChecklistResponse> {
    const result: ChecklistResponse = { success: true };
    const resultError: ChecklistResponse = { success: false };

    let assistance = (isFixed ? `,${answers.assistanceId}` : '');
    let values = (answers.filePhotoPath != null ?
      `${answers.questionId},${answers.logUserChecklistId},${answers.answer},${answers.markvalue},${answers.userId},${answers.filePhotoPath},${answers.campaignId}${assistance}` :
      `${answers.questionId},${answers.logUserChecklistId},${answers.answer},${answers.markvalue},${answers.userId},'',${answers.campaignId}${assistance}`);
    let formatValues = (isFixed ? 'int,int,varchar,varchar,int,varchar,int,int' : 'int,int,varchar,varchar,int,varchar,int');
    let parameters = (isFixed ? 'IdPregunta,IdLogEncuestaUsuario,Respuestas,ValorPonderacion,IdUsuario,RespuestaImagen,IdCampania,IdAsistenciaLaboral' :
      'IdPregunta,IdLogEncuestaUsuario,Respuestas,ValorPonderacion,IdUsuario,RespuestaImagen,IdCampania');

    const request = {
      "formatValues": formatValues,
      "procedureName": environment.DB.PROCEDURES.POST_SAVE_ANSWER_FIXED_CHECKLIST,
      "values": values,
      "parameters": parameters,
      "sqlName": environment.DB.SQL_NAME.CHECKLIST_ARACNE2
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request)
      .pipe(
        map(response => result),
        catchError(error => of(resultError))
      )
  }

  // Log Checklist
  postLogUserChecklist(logChecklist: LogChecklistRequest): Observable<LogChecklistResponse> {
    const { checklistId, userId, accessCounter, lastAccessDate, date, completePercent, notes, recordDate, userSelection, salespointSelection, timing } = logChecklist;

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_POST);
    const body = {
      query: `INSERT INTO Log_Encuestas_Usuarios`
        + ` (IdEncuesta,IdUsuario,ContadorAccesos,FechaUltimoAcceso,Fecha,PorcentajeRealizacion,Nota,FechaGrabacion,IdUsuarioSeleccion,IDPVSeleccion,Tiempo)`
        + ` VALUES ('${checklistId}','${userId}','${accessCounter}','${lastAccessDate}','${date}',${completePercent},'${notes}','${recordDate}','${userSelection}','${salespointSelection}', ${(timing != undefined && timing != null) ? timing : null})`,
      sqlName: environment.DB.SQL_NAME.CHECKLIST_ARACNE2
    };

    return this.httpService.post(body)
      .pipe(
        mergeMap(() => this.getLogChecklist(userId, userSelection, salespointSelection)),
        catchError(error => null)
      );
  }

  getLogChecklist(userId: number, userSelection: number, salespointSelection: number): Observable<LogChecklistResponse> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = new HttpParams()
      .set('query', 'SELECT TOP (1) * FROM Log_Encuestas_Usuarios'
        + ` WHERE IdUsuario = ${userId}`
        + (userSelection != null ? ` AND IdUsuarioSeleccion = ${userSelection}` : '')
        + (salespointSelection != null ? ` AND IDPVSeleccion = ${salespointSelection}` : '')
        + ' ORDER BY FechaUltimoAcceso DESC')
      .set('sqlName', environment.DB.SQL_NAME.CHECKLIST_ARACNE2)

    return this.httpService.getWithParams(params)
      .pipe(
        map((result: LogChecklistResponse) => result[0]),
        catchError(error => null)
      );
  }

  putLogUserChecklist(log: LogChecklistResponse): Observable<ChecklistResponse> {
    const result: ChecklistResponse = { success: true };
    const resultError: ChecklistResponse = { success: false };

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_POST);
    const body = {
      query: `UPDATE Log_Encuestas_Usuarios`
        + ` SET PorcentajeRealizacion = ${log.PorcentajeRealizacion},`
        + ` Nota = ${log.Nota},`
        + ` Tiempo = ${log.Tiempo},`
        + ` FechaGrabacion = '${log.FechaGrabacion}'`
        + ` WHERE IdLogEncuestaUsuario = ${log.IdLogEncuestaUsuario}`,
      sqlName: environment.DB.SQL_NAME.CHECKLIST_ARACNE2
    };

    return this.httpService.post(body)
      .pipe(
        map(response => result),
        catchError(error => of(resultError))
      )
  }

  // Offline Sync to Online
  postLogUserChecklistOfflineSync(logChecklist: LogChecklistDb): Promise<LogChecklistDbSyncResponse> {
    const { checklistId, userId, accessCounter, lastAccessDate, date, completedPercent, score, recordDate, userSelectionId, salespointSelectionId, timing } = logChecklist;

    let resultSuccess: LogChecklistDbSyncResponse = { success: true, logChecklistDbId: logChecklist.logChecklistDbId };
    const resultError: LogChecklistDbSyncResponse = { success: false, logChecklistDbId: logChecklist.logChecklistDbId, logChecklistId: null };

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_POST);
    const body = {
      query: `INSERT INTO Log_Encuestas_Usuarios`
        + ` (IdEncuesta, IdUsuario, ContadorAccesos, FechaUltimoAcceso, Fecha, PorcentajeRealizacion, Nota, FechaGrabacion, IdUsuarioSeleccion, IDPVSeleccion, Tiempo)`
        + ` VALUES ('${checklistId}', '${userId}', '${accessCounter}', '${lastAccessDate}', '${date}', ${completedPercent}, ${(score != undefined && score != null) ? score : null},`
        + ` '${recordDate}', ${userSelectionId}, ${salespointSelectionId}, ${(timing != undefined && timing != null) ? timing : null})`,
      sqlName: environment.DB.SQL_NAME.CHECKLIST_ARACNE2
    };

    return new Promise(async (resolve, reject) => {
      await this.httpService.postPromise(body)
        .then(async () => {
          await this.getLogChecklistOfflineSync(logChecklist)
            .then(result => {
              resultSuccess.logChecklistId = result[0].IdLogEncuestaUsuario;
              resolve(resultSuccess);
            });
        })
        .catch(error => {
          resolve(resultError);
        });
    });
  }

  getLogChecklistOfflineSync(logChecklist: LogChecklistDb): Promise<Array<LogChecklistResponse>> {
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
    const params = {
      'query': `SELECT TOP (1) * FROM Log_Encuestas_Usuarios` +
        ` WHERE IdUsuario = ${logChecklist.userId} AND IdUsuarioSeleccion = ${logChecklist.userSelectionId}` +
        ` AND IDPVSeleccion = ${logChecklist.salespointSelectionId} AND FechaGrabacion = '${logChecklist.recordDate}'`,
      'sqlName': environment.DB.SQL_NAME.CHECKLIST_ARACNE2
    }

    return this.httpService.getWithParamsPromise(params)
      .then((result: LogChecklistResponse[]) => result)
      .catch(error => {
        return [];
      });
  }

  postAnswerChecklistOfflineSync(answers: AnswerDbSyncRequest): Observable<AnswerDbSyncResponse> {
    const result: ChecklistResponse = { success: true };
    const resultError: ChecklistResponse = { success: false };

    const request = {
      "formatValues": 'int,int,varchar,varchar,int,varchar,int',
      "procedureName": environment.DB.PROCEDURES.POST_SAVE_ANSWER_FIXED_CHECKLIST,
      "values": `${answers.questionId},${answers.logChecklistId},${answers.answer},${answers.weightingValue},${answers.userId},${(answers.answerImage != null ? answers.answerImage : '')},${answers.campaignId}`,
      "parameters": 'IdPregunta,IdLogEncuestaUsuario,Respuestas,ValorPonderacion,IdUsuario,RespuestaImagen,IdCampania',
      "sqlName": environment.DB.SQL_NAME.CHECKLIST_ARACNE2
    }
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);
    return this.httpService.post(request)
      .pipe(
        map(response => result),
        catchError(error => of(resultError))
      )
  }
}
