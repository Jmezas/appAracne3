import { Injectable } from '@angular/core';

import { HttpService } from '../http.service';
import { AuthServiceStore } from '../STORE/auth.store.service';
import { DeviceService } from '../UTILS/device.service';

import { TYPE_REQUEST } from '../../shared/constants/values.constants';
import { ImageChecklistRequest, ImageChecklistResponse } from '../../shared/models/checklist.interface';
import { AnswerImageDb, AnswerImageDbSyncResponse } from '../../shared/models/database-model/answer-db.interface';

import {
  FormularioImageResponse, FormularioRespuesta
} from '../../shared/models/formulario-jornada';
import { Respuesta, RespuestaImageResponse } from '../../shared/models/formulario';
import { FileTransferForm, FileWriteData, FileWritePathResponse } from '../../shared/models/filetransfer-form.interface';
import { IGenericUploadImage } from '../../shared/models/config.interface';

import {
  FileTransfer, FileUploadOptions,
  FileTransferObject
} from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private httpService: HttpService,
    private authServiceStore: AuthServiceStore,
    private file: File,
    private fileTransfer: FileTransfer,
    private http: HTTP,
    private deviceService: DeviceService
  ) { }

  sendImageChecklist(request: ImageChecklistRequest): Promise<ImageChecklistResponse> {
    const uriAracne2: string = this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_SEND_FILE);
    const dateNow = moment().format("YYYY_MM_DD_HHmmssSSS");
    const fileName: string = `${request.checklistId}_${dateNow}.jpg`;

    const options: FileUploadOptions = {
      fileName,
      headers: {
        'campaignName': request.campaignName,
        'actionPhoto': request.actionPath
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    return fileTransfer.upload(request.imagePath, uriAracne2, options)
      .then(data => {
        return {
          success: (data.response == "true" ? true : false),
          questionImagePartId: request.questionImagePartId,
          imagePath: fileName
        }
      })
      .catch(err => {
        return {
          success: false,
          questionImagePartId: request.questionImagePartId,
          imagePath: fileName
        }
      })
  }

  // Offline Sync to Online
  sendImageChecklistOfflineSync(request: AnswerImageDb): Promise<AnswerImageDbSyncResponse> {
    let response: AnswerImageDbSyncResponse = { success: false, questionPartId: request.questionPartId, imagePath: null, logChecklistDbId: request.logChecklistDbId, checklistId: request.checklistId };

    const uriAracne2: string = this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_SEND_FILE);
    const dateNow = moment().format("YYYY_MM_DD_HHmmssSSS");
    const fileName: string = `${request.checklistId}_${dateNow}.jpg`;

    const options: FileUploadOptions = {
      fileName,
      headers: {
        'campaignName': request.campaignName,
        'actionPhoto': ''
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    return fileTransfer.upload(request.imagePath, uriAracne2, options)
      .then(data => {
        response.success = true;
        response.imagePath = fileName;
        return response;
      })
      .catch(err => {
        return response;
      });
  }

  sendImageToServer(request: IGenericUploadImage) {
    let response = {};
    const uriAracne2: string = this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_SEND_FILE);
    const fileName: string = request.fileName;

    const options: FileUploadOptions = {
      fileName,
      headers: {
        'campaignName': request.campaignName,
        'actionPhoto': ''
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    return fileTransfer.upload(request.imagePath, uriAracne2, options)
      .then(data => {
        return {
          success: true,
          imagePath: fileName
        }
      })
      .catch(err => {
        return response;
      });
  }

  async getResultSaveImages(requestImageUpload: any[]): Promise<Array<any>> {
    let result: Array<any> = [];

    if (requestImageUpload.length > 0) {
      await Promise.all(requestImageUpload)
        .then((response: any) => {
          result = response;
        });

      return result;
    }

    return result;
  }

  async sendFileFormularioJornadaAracne3(clientId: string, entityOwner: string, answerObject: FormularioRespuesta): Promise<FormularioImageResponse> {
    const dateNow = moment().format("HHmmssSSS");
    const fileName: string = `${entityOwner}_${answerObject.idJornada}_${answerObject.idFormularioJornada}_${answerObject.idUsuario}_${answerObject.idCampo}_${dateNow}.jpg`;

    return await this.uploadFileAracne3(clientId, entityOwner, answerObject.valueFileSendUrl, fileName, answerObject);
  }

  async sendFileFormularioAracne3(clientId: string, entityOwner: string, answerObject: Respuesta): Promise<RespuestaImageResponse> {
    const dateNow = moment().format("HHmmssSSS");
    const fileName: string = `${entityOwner}_${answerObject.idCampo}_${dateNow}.jpg`;

    return await this.uploadFileAracne3(clientId, entityOwner, answerObject.valorFileSendUrl, fileName, answerObject);
  }

  async uploadFileAracne3(clientId: string, entityOwner: string, filePath: string, fileName: string, answerObject: any): Promise<any> {
    this.httpService.setUriAracne3(`api/File/${clientId}/aracne3mobile/${entityOwner}`);

    const body: FileTransferForm = {
      filePath: filePath,
      fileName: fileName,
      fileKey: 'files',
      dataMerged: answerObject
    }

    return new Promise((resolve, reject) => {
      const fileTransferSubs = this.httpService.post(body).subscribe(response => {
        fileTransferSubs?.unsubscribe();
        if (response != undefined && response != null && response.success != undefined) {
          resolve({
            success: response.success,
            idFileBlob: response.idFileBlob,
            respuesta: response.respuesta
          });
        } else {
          resolve({
            success: false,
            idFileBlob: null,
            respuesta: null
          });
        }
      })
    });
  }

  async downloadFileTemaAracne3(idDetalleTema: number, fileId: string): Promise<FileWriteData> {
    const token = await this.authServiceStore.getAuthToken();
    const uriAracne3: string = this.httpService.setUriAracne3(`api/File/${fileId}`);

    return new Promise((resolve, reject) => {
      this.http.sendRequest(uriAracne3, { method: 'get', responseType: 'arraybuffer', headers: { 'Authorization': `Bearer ${token}` } })
        .then(data => {
          const fileTema = new Blob([data.data], { type: 'image/jpeg' });
          resolve({ identifer: idDetalleTema, fileBlob: fileTema });
        })
        .catch(error => {
          resolve({ identifer: idDetalleTema, fileBlob: null });
        })
    });
  }

  async writeFiles(request: Array<FileWriteData>): Promise<Array<FileWritePathResponse>> {
    const writeFilesPromises = [];

    request.forEach(item => {
      writeFilesPromises.push(this.writeFilesPromises(item));
    });

    return new Promise(async (resolve, reject) => {
      await Promise.all(writeFilesPromises)
        .then((result: Array<FileWritePathResponse>) => {
          resolve(result);
        })
    })
  }

  async writeFilesPromises(file: FileWriteData): Promise<FileWritePathResponse> {
    return new Promise(async (resolve, reject) => {
      const pathCacheDirectory = (this.deviceService.typePlatformMobile() == 'ios' ? this.file.documentsDirectory : this.file.externalCacheDirectory);

      await this.file.writeFile(pathCacheDirectory, `${file.identifer}.jpg`, file.fileBlob, { replace: true })
        .then(_ => {
          resolve({
            identifer: file.identifer as number,
            filePath: `${pathCacheDirectory}${file.identifer}.jpg`
          });
        });
    })
  }

  writeLocalFile(request: { name: string, file: Blob }): Promise<{ name: string, filePath: string }> {
    return new Promise(async (resolve, reject) => {
      const pathCacheDirectory = (this.deviceService.typePlatformMobile() == 'ios' ? this.file.documentsDirectory : this.file.externalCacheDirectory);
      await this.file.writeFile(pathCacheDirectory, `${request.name}.jpg`, request.file, { replace: true })
        .then(_ => {
          resolve({
            name: request.name,
            filePath: `${pathCacheDirectory}${request.name}.jpg`
          });
        })
        .catch(e => {
          resolve({
            name: request.name,
            filePath: null
          });
        });
    })
  }
}
