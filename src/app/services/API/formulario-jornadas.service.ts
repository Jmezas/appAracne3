import { Injectable } from '@angular/core';

import { HttpService } from '../http.service';

import {
  CancelarJornadas,
  DependencyThemeForm,
  DependencyThemeFormRequest,
  FormsInsertResponse, Formulario, FormularioJornada,
  FormularioRequest, FormularioResponse
} from '../../shared/models/formulario-jornada';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormularioJornadasService {

  constructor(private httpService: HttpService) { }

  getListaFormulariosJornada(salespointId: number, roleId: number, workdayId: number): Observable<Array<FormularioJornada>> {
    this.httpService.setUriAracne3(`apiForms/reporteFormularioJornada/getEstadoFormulariosJornadas/${salespointId}/${roleId}/${workdayId}`);

    return this.httpService.getWithParams(null).pipe(
      map((response: FormularioJornada[]) => response)
    );
  }

  getCamposFormularioJornada(idFormulario: number): Observable<Formulario> {
    let result: Formulario = null;

    this.httpService.setUriAracne3(`apiForms/formulariosJornadas/formularioJornadaApp/${idFormulario}`);

    return this.httpService.getWithParams(null).pipe(
      map((response: FormularioResponse[]) => {
        if (response && response.length > 0) {
          result = {
            idFormularioJornada: response[0].idFormularioJornada,
            nombreFormulario: response[0].nombreFormulario,
            idTemaFormulario: response[0].idTemaFormulario,
            edicionAprobacion: response[0].edicionAprobacion,
            idRolEdicionAprobacion: response[0].idRolEdicionAprobacion,
            fechaFinEdicionAprobacion: response[0].fechaFinEdicionAprobacion,
            activo: response[0].activo,
            obligatorio: response[0].obligatorio,
            publicado: response[0].publicado,
            usCreacion: response[0].usCreacion,
            detalleTema: []
          };

          if (response.some(x => x.camposDetalleTema.length > 0)) {
            response[0].camposDetalleTema.forEach(item => {
              result.detalleTema.push({
                idFormularioJornada: response[0].idFormularioJornada,
                idSuperCategoria: item.idSuperCategoria,
                idCategoria: item.idCategoria,
                idMarca: item.idMarca,
                idLineaProducto: item.idLineaProducto,
                idProducto: item.idProducto,
                idDetalleTema: item.idDetalleTema,
                detalleTema: item.detalleTema,
                imagenTema: item.imagenTema,
                campos: item.campos.map(x => ({
                  idCampo: x.idCampo,
                  tipoCampo: x.tipoCampo,
                  nombreCampo: x.nombreCampo,
                  idControl: x.idControl,
                  idTipoCampo: x.idTipoCampo,
                  tipoControl: x.tipoControl,
                  prefijo: x.prefijo,
                  obligatorio: x.obligatorio,
                  activo: x.activo,
                  orden: x.orden,
                  reutilizable: x.reutilizable,
                  referenteTema: x.referenteTema,
                  idCampoDependenciaPadre: x.idCampoDependenciaPadre,
                  opciones: x.opciones.map(o => ({
                    ...o,
                    idCampo: x.idCampo,
                    idDetalleTema: item.idDetalleTema,
                    idFormularioJornada: response[0].idFormularioJornada
                  })),
                  imageUploadUrl: 'assets/svg/image_icon.svg',
                  idDetalleTema: item.idDetalleTema,
                  idFormularioJornada: response[0].idFormularioJornada,
                  visible: (x.idCampoDependenciaPadre != null ? false : true)
                })),
                isSaveLoading: false,
                isCompleted: false
              });
            });
          }

          if (response.some(x => x.campos.length > 0) && response[0].campos.some(y => !y.referenteTema)) {
            result.detalleTema.push({
              idFormularioJornada: response[0].idFormularioJornada,
              idSuperCategoria: 0,
              idCategoria: 0,
              idMarca: 0,
              idLineaProducto: 0,
              idProducto: 0,
              idDetalleTema: 999,
              detalleTema: 'Cuestionario',
              imagenTema: null,
              campos: response[0].campos.filter(x => !x.referenteTema).map(y => ({
                idCampo: y.idCampo,
                tipoCampo: y.tipoCampo,
                nombreCampo: y.nombreCampo,
                idControl: y.idControl,
                idTipoCampo: y.idTipoCampo,
                tipoControl: y.tipoControl,
                prefijo: y.prefijo,
                obligatorio: y.obligatorio,
                activo: y.activo,
                orden: y.orden,
                reutilizable: y.reutilizable,
                referenteTema: y.referenteTema,
                idCampoDependenciaPadre: y.idCampoDependenciaPadre,
                opciones: y.opciones.map(o => ({
                  ...o,
                  idCampo: y.idCampo,
                  idDetalleTema: 999,
                  idFormularioJornada: response[0].idFormularioJornada
                })),
                imageUploadUrl: 'assets/svg/image_icon.svg',
                idDetalleTema: 999,
                idFormularioJornada: response[0].idFormularioJornada,
                visible: (y.idCampoDependenciaPadre != null ? false : true)
              })),
              isCompleted: false
            });
          }
        }

        return result;
      })
    );
  }

  postCrearReporteFormularioJornada(request: FormularioRequest): Observable<FormsInsertResponse> {
    this.httpService.setUriAracne3('apiForms/reporteFormularioJornada/createReporteFormularioJornada');

    return this.httpService.post(request).pipe(
      map((response: FormsInsertResponse) => response),
      catchError(error => of(null))
    );
  }

  getListaTemaDependencia(idTemaFormulario: number, request: DependencyThemeFormRequest): Observable<Array<DependencyThemeForm>> {
    this.httpService.setUriAracne3(`apiForms/formulariosJornadas/getListTemaDependencias/${idTemaFormulario}`);

    return this.httpService.post(request).pipe(
      map((response: Array<DependencyThemeForm>) => response)
    );
  }

  postCancelarJornada(request: CancelarJornadas): Observable<CancelarJornadas> {
    this.httpService.setUriAracne3('apiPdv/JornadasGestion/cancelarJornadas');

    return this.httpService.put(request).pipe(
      map((response: any) => response),
      catchError(error => of(null))
    );
  }
}
