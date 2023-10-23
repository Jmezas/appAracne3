import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../store/app.reducer';

import { FormularioService } from '../../../../../../services/API/formulario.service';
import { CampaingService } from '../../../../../../services/STORE/campaing.store.service';
import { TableUserService } from '../../../../../../services/database/table-user.service';
import { LoadingService } from '../../../../../../services/UI/loading.service';

import { User } from '../../../../../../shared/models/user.model';
import { UserCampaign } from '../../../../../../shared/models/user.interface';
import { IItemCampaign } from '../../../../../../shared/models/campaing.interface';
import { PdvsJornada } from '../../../../../../shared/models/jornada.interface';
import { FormKpi } from '../../../../../../shared/models/formKpi.interface';
import { APP_CONFIG } from '../../../../../../shared/constants/values.constants'; 

import * as moment from 'moment';
moment.locale('es');

@Component({
  selector: 'form-kpi',
  templateUrl: './form-kpi.component.html',
  styleUrls: ['./form-kpi.component.scss'],
})
export class FormKpiComponent implements OnInit {
  userAuth: User = null;
  activeCampaign: IItemCampaign = null;
  salespointSelected: PdvsJornada = null;
  dataKpis: Array<FormKpi> = [];
  kpiView: string = 'bar-chart-outline';
  isInline: boolean = true;

  constructor(
    private store: Store<AppState>,
    private campaignService: CampaingService,
    private tableUserService: TableUserService,
    private formService: FormularioService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.show('Cargando indicadores...');
    this.initFormKpi();
  }

  async initFormKpi() {
    this.activeCampaign = await this.campaignService.getActiveCampaing();

    const authSubs = this.store.select('auth').subscribe(({ user }) => {
      this.userAuth = user;
      setTimeout(() => { authSubs?.unsubscribe(); }, 500);
    });

    const salespointSelectedSubs = this.store.select('salespoint').subscribe(({ salespointSelected }) => {
      this.salespointSelected = salespointSelected;

      if (salespointSelected == null) {
        setTimeout(() => {
          this.loadingService.stop();
          salespointSelectedSubs?.unsubscribe();
        }, 500);

        return;
      }

      const assistenceStatusSubs = this.store.select('assistance').subscribe(({ calendarAssistance }) => {
        if (calendarAssistance.length == 0) {
          setTimeout(() => {
            this.loadingService.stop();
            assistenceStatusSubs?.unsubscribe();
          }, 500);
          return;
        }

        setTimeout(() => {
          this.getKpiForms();
          assistenceStatusSubs?.unsubscribe();
        }, 500);
      });

      setTimeout(() => { salespointSelectedSubs?.unsubscribe(); }, 500);
    });
  }

  async getKpiForms() {
    const today = moment().toDate();
    const todayRequest = moment(today).format('MM-DD-YYYY');

    // Verificamos si tiene un configuración de usuario reporteador
    const keyAppConfig = APP_CONFIG.UserReporter;
    const config = await this.tableUserService.getAppUserConfigCollection(parseInt(this.userAuth.uid), this.activeCampaign.idCampania, keyAppConfig);
    const parseConfig: UserCampaign = (config.length > 0 ? JSON.parse(config[0].valueObject) : null);
    const presentUser: number = (parseConfig ? parseConfig.idUsuario : parseInt(this.userAuth.uid));

    const kpiSubs = this.formService.getKpisFormularios(this.salespointSelected.idPdv, presentUser, todayRequest).subscribe(
      response => {
        if (response != undefined && response.length > 0) {
          const data = response.map(x => ({
            ...x,
            graphicKpi: {
              labels: x.kpis.reduce((prev, curr) => { prev.push(curr.descriptorKpi); return prev; }, []),
              values: x.kpis.reduce((prev, curr) => { prev.push(curr.valorKpi); return prev; }, []),
              lablesSerieBARS: x.kpis.filter(x => x.idValor === null).map(y => `# Cantidad ${y.descriptorKpi}`)
            }
          }));

          this.dataKpis = data;
        }
        
        setTimeout(() => { kpiSubs?.unsubscribe(); this.loadingService.stop(); }, 500);
      },
      error => {
        setTimeout(() => { kpiSubs?.unsubscribe(); this.loadingService.stop(); }, 500);
      }
    )
  }

  toggleKpis() {
    this.kpiView = (this.kpiView == 'bar-chart-outline' ? 'reorder-four-outline' : 'bar-chart-outline');
    this.isInline = !this.isInline;
  }
}
