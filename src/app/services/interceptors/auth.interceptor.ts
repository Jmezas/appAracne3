import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor,
  HttpErrorResponse, HttpHeaders, HttpResponse,
} from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { DeviceService } from '../UTILS/device.service';
import { AuthServiceAPI } from '../API/auth.api.service';
import { CampaingService } from '../STORE/campaing.store.service';
import { FileTransferForm } from '../../shared/models/filetransfer-form.interface';

import { Observable, of, throwError, BehaviorSubject, from } from 'rxjs';
import { catchError, filter, switchMap, take, map } from 'rxjs/operators';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileTransferError } from '@awesome-cordova-plugins/file-transfer/ngx';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  isPlatformMobile: boolean = false;
  isRefreshingToken: boolean = false;

  constructor(
    private authServiceAPI: AuthServiceAPI,
    private deviceService: DeviceService,
    private campaignService: CampaingService,
    private http: HTTP,
    private fileTransfer: FileTransfer
  ) {
    this.isPlatformMobile = this.deviceService.isPlatformMobile();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Valida si esta en la lista de los servicios de Aracne2, para afrontar el error de CORS
    // usando el pluging de HTTP
    if (this.isAracne2Route(req.url)) {
      return this.callNativeHttp(req);
    }

    // Valida si esta en la lista que no necesita token
    if (this.isWithoutToken(req.url) || this.isFileTransfer(req.url) && req.method == 'GET') {
      return next.handle(req);
    }

    // Valida si esta en la lista de endpoints que solo necesita el token como header
    if (this.isOnlyToken(req.url)) {
      return next.handle(this.addToken(req)).pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 400:
                return this.handle400Error(err);
              case 401:
                return this.handle401Error(req, next, true, false);
              default:
                return throwError(err);
            }
          } else {
            return throwError(err);
          }
        })
      );
    }

    // Valida si esta en la lista de endpoints de filetransfer,this.isFileTransfer(req.url) && req.method == 'POST' solo necesita token como header
    if (this.isFileTransfer(req.url) && req.method == 'POST') {
      return this.callNativeFileTransfer(req).pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 400:
                return this.handle400Error(err);
              case 401:
                return this.handle401Error(req, next, false, true);
              default:
                return throwError(err);
            }
          } else {
            return throwError(err);
          }
        })
      );
    }

    return next.handle(this.addAracne3Headers(req)).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 400:
              return this.handle400Error(err);
            case 401:
              return this.handle401Error(req, next, false, false);
            default:
              return throwError(err);
          }
        } else {
          return throwError(err);
        }
      })
    );
  }

  private callNativeHttp(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return new Observable<HttpEvent<any>>(ob => {
      this.http.post(`${req.url}`, { ...req.body }, { 'Content-Type': 'application/x-www-form-urlencoded', 'charset': 'utf-8' })
        .then(data => {
          if (data.status == 200) {
            ob.next(new HttpResponse({ body: data.data }));
            ob.complete();
          } else {
            ob.next(new HttpResponse({ body: data }));
            ob.complete();
          }
        })
        .catch(error => {
          ob.error(new HttpErrorResponse({
            error: null,
            headers: req.headers,
            status: error.http_status,
            statusText: null,
            url: error.target
          }));
        })
    })
  }

  private callNativeFileTransfer(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const requestBody: FileTransferForm = req.body;

    const options: FileUploadOptions = {
      fileKey: requestBody.fileKey,
      fileName: requestBody.fileName,
      httpMethod: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authServiceAPI.currentAccessToken.token}`
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    return new Observable<HttpEvent<any>>(ob => {
      fileTransfer.upload(requestBody.filePath, req.url, options)
        .then(response => {
          const bodyResponse = {
            success: ((response.responseCode == 200 && JSON.parse(response.response)['items'].length > 0) ? true : false),
            idFileBlob: ((response.responseCode == 200 && JSON.parse(response.response)['items'].length > 0) ? JSON.parse(response.response)['items'][0]['id'] : null),
            respuesta: requestBody.dataMerged
          }
          ob.next(new HttpResponse({ body: JSON.stringify(bodyResponse) }));
          ob.complete();
        })
        .catch((error: FileTransferError) => {
          ob.error(new HttpErrorResponse({
            error: null,
            headers: req.headers,
            status: error.http_status,
            statusText: null,
            url: error.target
          }));
          // Deja abierto el observable resuelve el error del flujo del proceso de refresh token para plugin HTTP nativo
          // ob.complete();
        })
    });
  }

  private isAracne2Route(url: string) {
    if (
      url.includes('/Api/Get/') ||
      url.includes('/Api/Post/') ||
      url.includes('/Api/Execute/') ||
      url.includes('/Api/Send/')
    ) {
      return true;
    }

    return false;
  }

  private isWithoutToken(url: string): boolean {
    if (
      url == `${environment.baseUriAracne3}/api/authenticate` ||
      url == `${environment.baseUriAracne3}/api/authenticate/refresh` ||
      url == `${environment.baseUriAracne3}/api/authenticate/test` ||
      url == `${environment.baseUriAracne3}/api/authenticate/refresh/test` ||
      url == `${environment.baseUriAracne3}/api/userLogOut` ||
      url.includes('https://maps.googleapis.com')
    ) {
      return true;
    }

    return false;
  }

  private isOnlyToken(url: string): boolean {
    if (
      url.includes('/employee/campaign/') ||
      url.includes('/employees/updateBatteryLevel/')
    ) {
      return true;
    }

    return false;
  }

  private isFileTransfer(url: string): boolean {
    if (url.includes(`${environment.baseUriAracne3}/api/File/`)) {
      return true;
    }

    return false;
  }

  private addToken(req: HttpRequest<any>) {
    if (this.authServiceAPI.currentAccessToken) {
      return req.clone({
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.authServiceAPI.currentAccessToken.token}`
        })
      });
    }

    return req;
  }

  private addAracne3Headers(req: HttpRequest<any>) {
    if (this.authServiceAPI.currentAccessToken && this.campaignService.currentCampaign) {
      return req.clone({
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.authServiceAPI.currentAccessToken.token}`,
          'IDCampania': `${this.campaignService.currentCampaign.idCampania}`,
          'BBDDCampania': `${this.campaignService.currentCampaign.bbddCampania}`
        })
      });
    }

    return req;
  }

  private handle400Error(err): Observable<any> {
    return of(null);
  }

  // Token inválido, intentamos refrescar el token
  private handle401Error(request: HttpRequest<any>, next: HttpHandler, isOnlyToken: boolean, isFileTransfer: boolean): Observable<any> {
    // Validamos si otra petición esta utilizando la lógica de refreshToken
    if (!this.isRefreshingToken) {
      // Seteamos en null para que las demas peticiones permanezcan en cola
      this.tokenSubject.next(null);
      // Bloqueamos la lógica del refreshToken
      this.isRefreshingToken = true;
      // Seteamos en null la token actual
      this.authServiceAPI.currentAccessToken = null;

      return from(this.authServiceAPI.refreshToken()).pipe(
        switchMap(token => {
          if (token) {
            return this.authServiceAPI.storeAuthenticationData(token).pipe(
              switchMap(_ => {
                // Seteamos el nuevo token para que las peticiones en cola puedan continuar
                this.tokenSubject.next(token.token);
                // Desbloqueamos la lógica del refreshToken
                this.isRefreshingToken = false;
                // Volvemos a realizar la petición inicial nuevamente con el nuevo token
                if (isOnlyToken && !isFileTransfer) {
                  return next.handle(this.addToken(request));
                }

                if (!isOnlyToken && isFileTransfer) {
                  return this.callNativeFileTransfer(request);
                }

                return next.handle(this.addAracne3Headers(request));
              })
            );
          } else {
            // Desbloqueamos la lógica del refreshToken
            this.isRefreshingToken = false;
            // No se pudo obtener el refreshToken o ocurrio algun problema
            return of(null);
          }
        })
      );
    } else {
      // Agregamos a la cola las peticiones mientras se resuelve el refreshToken
      return this.tokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(_ => {
          // Realizamos la petición nuevamente ya con el refreshToken obtenido
          if (isOnlyToken && !isFileTransfer) {
            return next.handle(this.addToken(request));
          }

          if (!isOnlyToken && isFileTransfer) {
            return this.callNativeFileTransfer(request);
          }

          return next.handle(this.addAracne3Headers(request));
        })
      );
    }
  }
}
