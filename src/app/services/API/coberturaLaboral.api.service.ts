import { Injectable } from '@angular/core';
import { TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { IRequestAracne2_PA } from 'src/app/shared/models/http.interface';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class CoberturaLaboralService {
  constructor(private httpService: HttpService) {}

  getCoberturaLaboral(userId: string, campaingId: string, date: string) {
    const payload: IRequestAracne2_PA = {
      formatValues: 'varchar,varchar,varchar',
      procedureName: 'PA_GetCoberturaLaboral_ApMob',
      values: `${userId},${campaingId},${date}`,
      parameters: 'IdUsuario,IdCampaign,Date',
      sqlName: environment.DB.SQL_NAME.PROMOTORIA,
    };

    this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_EXECUTE);

    return this.httpService.post(payload).pipe();
    // return this.httpService.getMock('assets/mocks/responses/coberturalaboral.response.mock.json');
  }
}
