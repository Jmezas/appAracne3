import { Injectable } from "@angular/core";
import { TYPE_REQUEST } from "src/app/shared/constants/values.constants";
import { environment } from "src/environments/environment";
import { HttpService } from "../http.service";

@Injectable({
    providedIn: 'root'
})
export class ProductApiService {

    constructor(
      private httpService: HttpService
    ) { }
  
    getProductosCampaniaApi(campaignId: string, businessLineName: string) {
        this.httpService.setUriAracne2(TYPE_REQUEST.REQUEST_GET)
        const payload = {
            query: `SELECT * FROM ${environment.DB.TABLES.VIEW_Products_BY_CAMPAIGN} WHERE Activo = 1 AND IdCampaña = '${campaignId}'`,
            sqlName: businessLineName
        };

        return this.httpService.post(payload);
    }
  }
  