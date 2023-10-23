import { Injectable } from '@angular/core';
import { SyncStatus } from 'src/app/shared/constants/strings.constan';
import { TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { IGenericUploadImage } from 'src/app/shared/models/config.interface';
import { ExhibicionDBModel } from 'src/app/shared/models/Exhibicion.interface';
import { IRequestAracne2 } from 'src/app/shared/models/http.interface';
import { environment } from 'src/environments/environment';
import { ExhibicionDao } from '../DAO/Exhibicion.dao';
import { DatabaseAppService } from '../database/database-app.service';
import { HttpService } from '../http.service';
import { FileUploadService } from './file-upload.service';

@Injectable({
  providedIn: 'root',
})
export class ExhibitionApiService {
  constructor(
	private httpService: HttpService,
	private databaseAppService: DatabaseAppService,
	private exhibicionDao: ExhibicionDao,
	private fileUploadService: FileUploadService
	) {}

	async uploadExhibitionPhotos(lsImages: Array<IGenericUploadImage>) {
		let fileUploadPromises = [];
		lsImages.forEach(item => {
			fileUploadPromises.push(this.fileUploadService.sendImageToServer(item))
		})
		
		if (fileUploadPromises.length > 0) {
			console.log("FILE UPLOAD IMAGES : ", fileUploadPromises);
			const resultSaveImage = await this.fileUploadService.getResultSaveImages(fileUploadPromises);
			console.log("RESULT SAVE IMAGES :", resultSaveImage);
		}
	}

	getFamiliasExhibicionApi(campaignId: string, businessLineName: string) {	//ApiFamiliaExhibicion
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
		const params = {
			"query": `SELECT * FROM ${environment.DB.TABLES.TM_TipoFamiliaFoto} WHERE Activo = 1 AND IdCampaña = '${campaignId}'`,
			"sqlName": businessLineName
		}
		return this.httpService.post(params)
	}

	getSubFamiliasExhibicionApi(familyId: string, businessLineName: string) {	//ApiSubFamiliaExhibicion
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
		const params = {
			"query": `SELECT * FROM ${environment.DB.TABLES.TM_TipoSubFamiliaFotoo} WHERE Activo = 1 AND IdTipoFamiliaFoto = '${familyId}'`,
			"sqlName": businessLineName
		}
		return this.httpService.post(params)
	}


	getCategoriasExhibicionApi(subfamilyId: string, businessLineName: string) {	//ApiCategoriaExhibicion
    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
		const params = {
			"query": `SELECT * FROM ${environment.DB.TABLES.TM_TipoCategoriaFoto} WHERE Activo = 1 AND IdTipoSubFamiliaFoto = '${subfamilyId}'`,
			"sqlName": businessLineName
		}
		return this.httpService.post(params)
	}

	getExhibitionsApi( idJornada: string, businessLineName: string) { //ApiExhibicion
		this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
		const params: IRequestAracne2 = {
			"query": `SELECT * FROM ${environment.DB.TABLES.VIEW_EXHIBITIONS} WHERE IdJornada = '${idJornada}'`,
			"sqlName": businessLineName
		}
		console.log("PARAMS GET EXHIBITION : ", params)
		return this.httpService.post(params)
	}

	deleteExhibition(idExhibicion: string, businessLineName: string) {
		this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_POST);
		const payload = {
		  query: `DELETE FROM ${environment.DB.TABLES.TRANS_EXHIBITIONS} WHERE IdFoto = '${idExhibicion}'`,
		  sqlName: businessLineName,
		};
		console.log('PAYLOAD DELETE EXHIBITION: ', payload);
		return this.httpService.post(payload);
	}

	/** DB LOCAL  */

	async crearExhibicion(exhibicionDB: ExhibicionDBModel) {
		return await this.exhibicionDao.insert(exhibicionDB , this.databaseAppService.dbObject);
	}

	getExhibicionesOffline(status: SyncStatus) {
		return this.exhibicionDao.getExhibicionsByStatus(status, this.databaseAppService.dbObject)
	}

	deleteLocalExhibition(exhibicionLocalId: number) {
		return this.exhibicionDao.deleteLocalExhibicion(exhibicionLocalId, this.databaseAppService.dbObject)
	}
}
