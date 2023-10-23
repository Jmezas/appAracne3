import { Injectable } from '@angular/core';

import { TableNormalFormService } from './table-normal-form.service';
import { FormularioService } from '../API/formulario.service';
import { FileUploadService } from '../API/file-upload.service';
import { CampaingService } from '../STORE/campaing.store.service';
import { RespuestaImageResponse } from '../../shared/models/formulario';

@Injectable({
  providedIn: 'root'
})
export class DatabaseNormalFormSyncService {

  constructor(
    private tableNormalFormService: TableNormalFormService,
    private campaignService: CampaingService,
    private formularioService: FormularioService,
    private fileUploadService: FileUploadService
  ) { }

  async syncNormalFormById(userId: number, reportFormId: number, normalFormId: number): Promise<boolean> {
    const fileUploadPromises = [];
    const activeCampaign = await this.campaignService.getActiveCampaing();
    const answersFormSQL = await this.tableNormalFormService.getNormalFormAssistanceAnswer(userId, normalFormId);
    const requestAnswerForm = answersFormSQL.filter(x => x.dataInsertReporteFormulario.idReporteFormulario === reportFormId);

    return new Promise(async (resolve, reject) => {
      if (requestAnswerForm.length === 0) {
        setTimeout(() => { postReporteSubs?.unsubscribe(); }, 250);
        return resolve(false);
      }

      requestAnswerForm[0].dataInsertReporteFormulario.idReporteFormulario = 0;

      if (requestAnswerForm[0].dataInsertAsistenciasList.length > 0) {
        requestAnswerForm[0].dataInsertAsistenciasList = requestAnswerForm[0].dataInsertAsistenciasList.map(x => ({ ...x, idReporteFormulario: 0 }));
      }

      requestAnswerForm[0].dataInsertReporteFormulario.respuestas.forEach(item => {
        if (item.valorFileSendUrl !== null) {
          fileUploadPromises.push(this.fileUploadService.sendFileFormularioAracne3(activeCampaign.bbddCampania.replace(/_/g, ''), 'formulario', item));
        }
      });

      if (fileUploadPromises.length > 0) {
        const resultFileUpload = await this.syncFileFormularioNormalAracne3(fileUploadPromises);

        if (resultFileUpload.some(x => x.success == false)) {
          return resolve(false);
        }

        requestAnswerForm[0].dataInsertReporteFormulario.respuestas.forEach(item => {
          if (item.valorFileSendUrl != null) {
            const valueIdFile = resultFileUpload.filter(x => x.respuesta.idCampo == item.idCampo)[0].idFileBlob;
            item.valor = [valueIdFile];
          }
        });
      }

      if (requestAnswerForm[0].dataInsertReporteFormulario.idPdv === null) {
        Reflect.deleteProperty(requestAnswerForm[0].dataInsertReporteFormulario, 'idPdv'); 
      }

      const postReporteSubs = this.formularioService.postCrearReporteFormulario(requestAnswerForm[0]).subscribe(async (response) => {
        setTimeout(() => { postReporteSubs?.unsubscribe(); }, 250);

        if (response && response.statusCode == 200) {
          await this.tableNormalFormService.deleteNormalFormAssistanceAnswerSyncronized([reportFormId]);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async syncFileFormularioNormalAracne3(requestFileUpload: Array<any>): Promise<Array<RespuestaImageResponse>> {
    let result: Array<RespuestaImageResponse> = [];

    if (requestFileUpload.length > 0) {
      await Promise.all(requestFileUpload)
        .then((response: Array<RespuestaImageResponse>) => {
          result = response;
        });

      return result;
    }

    return result;
  }
}
