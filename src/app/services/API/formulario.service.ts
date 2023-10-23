import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';

import { FormularioNormal, FormularioLibre, FormularioLibreRequest, FormularioLibreResponse } from '../../shared/models/formulario';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormKpi } from '../../shared/models/formKpi.interface';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  constructor(private httpService: HttpService) { }

  getFormulariosByRole(roleId: number): Observable<Array<FormularioNormal>> {
    this.httpService.setUriAracne3(`apiForms/formularios/getFormulariosByIdRol/${roleId}`);

    return this.httpService.getWithParams(null).pipe(
      map((response: FormularioNormal[]) => response)
    );
  }

  getFormularioById(idFormulario: number): Observable<Array<FormularioLibre>> {
    this.httpService.setUriAracne3(`apiForms/formularios/formulario/${idFormulario}`);

    return this.httpService.getWithParams(null).pipe(
      map((response: Array<FormularioLibre>) => {
        if (response && response.length > 0) {
          const result = response.map(x => ({
            ...x,
            campos: x.campos.map(y => ({
              ...y,
              visible: (y.idCampoDependenciaPadre != null ? false : true)
            }))
          }));
          return result;
        }
        return [];
      })
    );
  }

  postCrearReporteFormulario(request: FormularioLibreRequest): Observable<FormularioLibreResponse> {
    this.httpService.setUriAracne3(`apiForms/reporteFormulario/createReporteFormularioAsistencia`);

    return this.httpService.post(request).pipe(
      map((response: FormularioLibreResponse) => response),
      catchError(error => {
        return of(null);
      })
    );
  }

  getKpisFormularios(salespointId: number, userId: number, date: string) {
    this.httpService.setUriAracne3(`apiForms/KPIs/getKpisFormularios/${salespointId}/${userId}/${date}`); 

    return this.httpService.getWithParams(null).pipe(
      map((response: Array<FormKpi>) => response)
    );
  }
}
