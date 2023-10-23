import { Injectable } from '@angular/core';

import { CampaingService } from '../STORE/campaing.store.service';
import { TableFormService } from './table-form.service';
import { FormularioJornadasService } from '../API/formulario-jornadas.service';
import { FileUploadService } from '../API/file-upload.service';
import { BatterryService } from '../batterry.service';

import { FormsInsertResponse, FormularioImageResponse, FormularioRequest, FormularioRespuesta } from '../../shared/models/formulario-jornada';

import { forkJoin, Observable } from 'rxjs';
import * as moment from 'moment';
moment.locale('es');

@Injectable({
  providedIn: 'root'
})
export class DatabaseFormSyncService {

  constructor(
    private campaignService: CampaingService,
    private formularioService: FormularioJornadasService,
    private tableFormService: TableFormService,
    private fileUploadService: FileUploadService,
    private batteryService: BatterryService
  ) { }

  // Sincroniza los Formularios Jornadas por IdJornada, IdPdv, IdFormularioJornada y si fue automatico (Dentro de la Jornada) 
  async syncWorkDayFormById(isExpired: boolean, workDayId: number, salespointId: number, workDayFormId: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const fileUploadPromises = [];
      const updateAnswers: Array<Promise<any>> = [];
      const activeCampaign = await this.campaignService.getActiveCampaing();

      const answerFormSQL = await this.tableFormService.getAnswersFormById(activeCampaign.idCampania, workDayId, salespointId, workDayFormId);

      if (isExpired) {
        answerFormSQL.forEach(item => {
          if (item.valueFileSendUrl !== null) {
            fileUploadPromises.push(this.fileUploadService.sendFileFormularioJornadaAracne3(activeCampaign.bbddCampania.replace(/_/g, ''), 'formularioJornada', item));
          }
        });
      }

      if (fileUploadPromises.length > 0) {
        const resultfileUpload = await this.saveFileFormularioJornadaAracne3(fileUploadPromises);

        if (resultfileUpload.length === 0 || resultfileUpload.some(x => x.success === false)) {
          return resolve(false);
        }

        // agregamos el id de la carga del archivo al objeto de tipo imagen
        resultfileUpload.forEach(item => {
          const answerIndex = answerFormSQL.findIndex(x => x.idCampo === item.respuesta.idCampo && x.idControl === item.respuesta.idControl);
          answerFormSQL[answerIndex].valor = [item.idFileBlob];
        });
      }

      const objectRequest = await this.preparedObjectFormAnswers(answerFormSQL, isExpired);

      if (objectRequest.length === 0) {
        return resolve(true);
      }

      const observablesRegister = this.preparedBatchSyncForms(objectRequest);

      const registerFormSubs = forkJoin(observablesRegister).subscribe(async (result) => {
        const resultError = result.filter(x => !x || x.statusCode !== 200);
        const resultSuccess = result.filter(y => y && y.statusCode === 200);

        if (resultSuccess.length > 0) {
          resultSuccess.forEach(item => {
            const { idJornada, idPdv, idFormularioJornada } = item.responseReporteFormularioJornada;
            updateAnswers.push(this.tableFormService.updateFormListCompleted(idJornada, idPdv, idFormularioJornada));
            updateAnswers.push(this.tableFormService.updateFormListSyncronized(idJornada, idPdv, idFormularioJornada));
          });

          await Promise.all(updateAnswers);
        }

        setTimeout(() => { registerFormSubs?.unsubscribe(); }, 500);

        if (resultError.length > 0) {
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }

  async preparedObjectFormAnswers(answers: Array<FormularioRespuesta>, isExpired: boolean): Promise<Array<FormularioRequest>> {
    const batteryLevel = await this.batteryService.getBatterryStatus();
    const batteryLevelValue = (batteryLevel < 1 ? parseInt((batteryLevel * 100).toFixed(0)) : batteryLevel);
    let objectRequest: Array<FormularioRequest> = [];

    return new Promise((resolve, reject) => {
      answers.forEach((item, index, array) => {
        let workDayFormId = item.idFormularioJornada;

        if (!objectRequest.some(x => x.idFormularioJornada == workDayFormId)) {
          objectRequest.push({
            idFormularioJornada: item.idFormularioJornada,
            idUsuario: item.idUsuario,
            idPdv: item.idPdv,
            idJornada: item.idJornada,
            fechaReporte: moment(item.fechaReporte).format('YYYY-MM-DDTHH:mm:ss'),
            nivelBateria: (batteryLevel ? batteryLevelValue : null),
            esAutomatico: isExpired,
            detallesTema: array.filter(x => x.idFormularioJornada == workDayFormId && x.idDetalleTema != 999).reduce((prev, curr, i, array2) => {
              if (!prev.some(x => x.idDetalleTema == curr.idDetalleTema)) {
                prev.push({
                  idDetalleTema: curr.idDetalleTema,
                  respuestas: array2.filter(x => x.idDetalleTema == curr.idDetalleTema).map(y => ({ idCampo: y.idCampo, valor: (y.valor.some(z => z == null || z == "null") ? [] : y.valor) }))
                });
              }

              return prev;
            }, []),
            respuestas: array.filter(x => x.idFormularioJornada == workDayFormId && x.idDetalleTema == 999).map(y => ({ idCampo: y.idCampo, valor: (y.valor.some(z => z == null || z == "null") ? [] : y.valor) })),
            usCreacion: item.usCreacion
          });
        }
      });

      resolve(objectRequest);
    });
  }

  async saveFileFormularioJornadaAracne3(requestFileUpload: Array<any>): Promise<Array<FormularioImageResponse>> {
    let result: Array<FormularioImageResponse> = [];

    if (requestFileUpload.length > 0) {
      await Promise.all(requestFileUpload)
        .then((response: Array<FormularioImageResponse>) => {
          result = response;
        })
        .catch(error => console.log('SaveFileFormularioJornadaAracne3 Error', error));

      return result;
    }

    return result;
  }

  preparedBatchSyncForms(requestForms: Array<FormularioRequest>): Observable<FormsInsertResponse>[] {
    return requestForms.map(request => {
      return this.formularioService.postCrearReporteFormularioJornada(request);
    });
  }
}
