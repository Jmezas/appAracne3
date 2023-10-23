import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { IVersionResponse } from 'src/app/shared/models/config.interface';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private httpService: HttpService, private platform: Platform) {}

  getRemoteLastVersion(): Observable<Array<IVersionResponse>> {
    const ids = (this.platform.is('android') ? '4,7' : '6,9');
    this.httpService.setUriAracne3(`api/getListVersionApps/${ids}`);
    return this.httpService.getWithParams(null).pipe(
      map((response: Array<IVersionResponse>) => {
        console.log('response', response);
        if (response && response.length > 0) {
          return response;
        }
        return [];
      }),
      catchError((error) => of([]))
    );
  }

  registerLogAuditoria() {
    const payload = {
      query:
        "SELECT IdUsuario, Contador_Acceso FROM Log_Auditoria_Accesos WITH(NOLOCK)  WHERE IdUsuario = '5706'",
      sqlName: 'SQLDATA_ARACNE2',
    };
  }
}
