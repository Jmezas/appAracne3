import { Injectable } from '@angular/core';
import { map, switchMap, catchError } from 'rxjs/operators';
import { TYPE_REQUEST } from 'src/app/shared/constants/values.constants';
import { IResponseGetAuditoria } from 'src/app/shared/models/auditoria.interface';
import { IRequestAracne2 } from 'src/app/shared/models/http.interface';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuditoriaApiService {
    constructor(private httpService: HttpService) { }

    public async registrarAuditoria(campaignId: string, userId: string) {
        try {
            const dataTable: Array<IResponseGetAuditoria> = await this.getAuditoria(userId);
            if (dataTable == null || dataTable.length == 0) {
                await this.insertAuditoria(userId);
            } else {
                let updateCounter: number = dataTable[0].Contador_Acceso + 1;
                await this.updateAuditoria(userId, `${updateCounter}`);
            }
            await this.insertAuditoriaCampania(userId, campaignId);
        } catch (error) {
            console.log("ERROR registrarAuditoria : ", error);
        }
    }

    private getAuditoria(userId: string): Promise<Array<IResponseGetAuditoria>> {
        const payload: IRequestAracne2 = {
            query: `SELECT IdUsuario, Contador_Acceso 
                    FROM ${environment.DB.TABLES.LOG_AUDITORIA} WITH(NOLOCK)  
                    WHERE IdUsuario = '${userId}'`,
            sqlName: environment.DB.SQL_NAME.SQLDATA_ARACNE2,
        };

        this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET);
        return this.httpService
            .post(payload)
            .pipe(map((response) => response || []))
            .toPromise();
    }

    private updateAuditoria(userId: string, contador: string): Promise<boolean> {
        const payload: IRequestAracne2 = {
            query: `UPDATE ${environment.DB.TABLES.LOG_AUDITORIA} 
                    SET Fecha_Ultimo_Acceso = CONVERT(datetime, GETDATE()), Contador_Acceso = ${contador} 
                    WHERE IdUsuario = '${userId}'`,
            sqlName: environment.DB.SQL_NAME.SQLDATA_ARACNE2
        }

        this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_POST);
        return this.httpService
            .post(payload)
            .pipe()
            .toPromise();
    }

    private insertAuditoria(userId: string): Promise<boolean> {
        const payload: IRequestAracne2 = {
            query: `INSERT INTO ${environment.DB.TABLES.LOG_AUDITORIA} (IdUsuario, Fecha_Alta, Fecha_Ultimo_Acceso, Contador_Acceso, ID_Estado_Usuario) 
                    VALUES ('${userId}', CONVERT(datetime, GETDATE()), CONVERT(datetime, GETDATE()), 1, 2)`,
            sqlName: environment.DB.SQL_NAME.SQLDATA_ARACNE2
        }

        this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_POST);
        return this.httpService
            .post(payload)
            .pipe()
            .toPromise();
    }

    private insertAuditoriaCampania(userId: string, campaignId: string): Promise<boolean> {
        const payload: IRequestAracne2 = {
            query: `INSERT INTO ${environment.DB.TABLES.LOG_AUDITORIA_CAMPAIGNS} (IdUsuario, IdCampaña, Fecha_Acceso) 
                    VALUES ('${userId}', '${campaignId}', CONVERT(datetime, GETDATE()))`,
            sqlName: environment.DB.SQL_NAME.SQLDATA_ARACNE2
        }

        this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_POST);
        return this.httpService
            .post(payload)
            .pipe()
            .toPromise();
    }

    putUpdateBatteryLevel(userId: number, batteryLevel: number): Observable<any> {
        this.httpService.setUriAracne3(`apiEmployee/employees/updateBatteryLevel/${userId}/${batteryLevel}`);

        return this.httpService.put([]).pipe(
            map((response) => response),
            catchError(error => error)
        );
    }
}
