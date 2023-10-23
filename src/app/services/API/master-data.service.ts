import { Injectable } from '@angular/core';

import { HttpService } from '../http.service';

import { MasterdataRequest } from '../../shared/models/masterData.interface';

import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  constructor(private httpService: HttpService) { }

  getMasterDataByRequestType(requestType: string) {
    this.httpService.setUriAracne3('apimdm/masterTable');

    const body = environment.DB.MASTER_DATA_BODY[requestType];

    return this.httpService.post(body).pipe(
      map((response: Array<any>) => response)
    )
  }

  getMasterDataByDynamicRequestType(body: MasterdataRequest) {
    this.httpService.setUriAracne3apimdm('apimdm/masterTable');

    return this.httpService.post(body).pipe(
      map((response: Array<any>) => response)
    )
  }
}
