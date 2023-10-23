import { Injectable } from '@angular/core';

import { HttpService } from '../http.service';

import { MenuApp } from '../../shared/models/menu.interface'; 

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpService: HttpService) { }

  getAllModulesByCampaignRol(activeCampaignId: number, activeRolId: number): Observable<Array<MenuApp>> {
    this.httpService.setUriAracne3(`employee/menuAppMobile/${activeCampaignId}/${activeRolId}`);

    return this.httpService.getWithParams(null).pipe(
      map((result: Array<MenuApp>) => result)
    );
  }
}
