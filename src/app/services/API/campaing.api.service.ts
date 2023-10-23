import { Injectable } from '@angular/core';

import { HttpService } from '../http.service';
import { IResponseCampaignsAracne } from '../../shared/models/campaing.interface'; 

import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CampaingServiceAPI {

  constructor(
    private httpService: HttpService
  ) { }

  /**
   * @description[API]: GET all CAMPAINGS by user
   * @params (idUser) 
   * @returns: Observable
   */
  public apiGetEmployeeCampaingsAracne(idUser: string): Observable<Array<IResponseCampaignsAracne>> {
    this.httpService.setUriAracne3(`employee/campaign/${idUser}`);

    return this.httpService.getWithParams(null).pipe(
      map((response: Array<IResponseCampaignsAracne>) => response)
    );
  }
}
