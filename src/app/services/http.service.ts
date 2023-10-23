import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { TYPE_REQUEST } from '../shared/constants/values.constants';
import { DeviceService } from './UTILS/device.service';

import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IItemCampaign } from '../shared/models/campaing.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private uri: string;
  private activeCampaign: IItemCampaign = null;

  constructor(
    private deviceService: DeviceService,
    private httpClient: HttpClient,
    private http: HTTP
  ) { }

  setActiveCampaign(campaign: IItemCampaign) {
    this.activeCampaign = campaign;
  }

  getWithParams(params: HttpParams): Observable<any> {
    const headersRequest = {};
    const parametersRequest = (params != null ?
      params['updates'].reduce((obj, item) => Object.assign(obj, { [item.param]: item.value }), {})
      : {});

    return this.httpClient.get(`${this.uri}`, { params: parametersRequest, headers: headersRequest, responseType: 'text' })
      .pipe(
        map(response => {
          return JSON.parse(response);
        }),
        // retry(1),
        catchError(this.handleError)
      );
  }

  post(bodyData: any): Observable<any> {
    const headersRequest = {};

    return this.httpClient.post(`${this.uri}`, { ...bodyData }, { ...headersRequest, responseType: 'text' }).pipe(
      map(response => {
        return JSON.parse(response);
      }),
      // retry(1),
      catchError(this.handleError)
    );
  }

  put(bodyData: any): Observable<any> {
    const headersRequest = {};

    return this.httpClient.put(`${this.uri}`, { ...bodyData }, { ...headersRequest, responseType: 'text' }).pipe(
      map(response => {
        return JSON.parse(response);
      }),
      // retry(1),
      catchError(this.handleError)
    );
  }

  postPromise(bodyData: any): Promise<any> {
    if (this.deviceService.isPlatformMobile()) {
      this.http.setDataSerializer('json');

      return new Promise((resolve, reject) => {
        this.http.post(`${this.uri}`, { ...bodyData }, { 'Content-Type': 'application/json', 'charset': 'utf-8' })
          .then(data => (data.status == 200 ? resolve(data.data) : resolve([])))
          .catch(error => reject(error.error))
      });
    }
  }

  getWithParamsPromise(params: any): Promise<any> {
    if (this.deviceService.isPlatformMobile()) {
      return new Promise((resolve, reject) => {
        this.http.get(`${this.uri}`, params, {})
          .then(data => (data.status == 200 ? resolve(JSON.parse(data.data)) : resolve([])))
          .catch(error => reject(error.error))
      });
    }
  }

  public setUriAracne2(type: string) {
    let baseUriAracne2: string = '';

    if (this.deviceService.isPlatformMobile()) {
      baseUriAracne2 = environment.baseUriAracne2;
    }

    switch (type) {
      case TYPE_REQUEST.REQUEST_GET: return this.uri = `${baseUriAracne2}/Api/Get/`;
      case TYPE_REQUEST.REQUEST_POST: return this.uri = `${baseUriAracne2}/Api/Post/`;
      case TYPE_REQUEST.REQUEST_EXECUTE: return this.uri = `${baseUriAracne2}/Api/Execute/`;
      case TYPE_REQUEST.REQUEST_SEND_FILE: return this.uri = `${baseUriAracne2}/Api/Send/`;
    }
  }

  public setUriAracne3(endpoint: string) {
    const endpointValidated = this.validateEndpoint(endpoint);
    this.uri = `${environment.baseUriAracne3}/${endpointValidated}`;
    return `${environment.baseUriAracne3}/${endpointValidated}`;
  }

  public setUriAracne3apimdm(endpoint: string) {
    this.uri = `${environment.baseUriAracne3}/${endpoint}`;
    return `${environment.baseUriAracne3}/${endpoint}`;
  }

  validateEndpoint(endpoint: string): string {
    if (
      endpoint.includes('apiPdv/') ||
      endpoint.includes('apiForms/') ||
      endpoint.includes('apiEmployee/') ||
      endpoint.includes('apimdm/masterTable')
    ) {
      const dataCampaign = this.activeCampaign.decodeTokenUserConfig;
      const splitEndpoint = endpoint.split('/');
      const newEndpoint = splitEndpoint.reduce((prev, curr, index) => {
        return prev += (index == 0 ? `${curr}/${dataCampaign.CountryPath}/${dataCampaign.CampaignPath}` : `/${curr}`);
      }, '');

      return newEndpoint
    }

    return endpoint;
  }

  public setExternalUri(endpoint: string) {
    this.uri = endpoint;
    return endpoint;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Código do error: ${error.status}, ` + `mensagem: ${error.message}`;
    }

    return of(undefined);
    // return throwError(errorMessage);
  }
}
