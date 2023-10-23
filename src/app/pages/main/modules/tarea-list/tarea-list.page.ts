import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import { tapMenuSelectedAction } from '../../../../store/actions/menu.action';
import { unSetCalendarAssistance } from '../../../../store/actions/assistance.action';
import { clearSalespointSelected } from '../../../../store/actions/salespoint.action';

import { CampaingService } from '../../../../services/STORE/campaing.store.service';
import { TableUserService } from '../../../../services/database/table-user.service';

import { User } from '../../../../shared/models/user.model';
import { UserCampaign } from '../../../../shared/models/user.interface';
import { IItemCampaign } from '../../../../shared/models/campaing.interface';
import { PdvsJornada } from '../../../../shared/models/jornada.interface';
import { APP_CONFIG } from '../../../../shared/constants/values.constants';

import { Subscription } from 'rxjs';
import * as moment from 'moment';
moment.locale('es');

@Component({
  selector: 'app-tarea-list',
  templateUrl: './tarea-list.page.html',
  styleUrls: ['./tarea-list.page.scss'],
})
export class TareaListPage implements OnInit, OnDestroy {
  userAuth: User = null;
  userReporterIcon: string = 'assets/svg/user.svg';
  userReporterConfig: UserCampaign = null;
  activeCampaign: IItemCampaign = null;
  lastAccessDate: Date = null;
  salespointSelected: PdvsJornada = null;
  showForms: boolean = false;
  list_icon: string = 'reorder-four-outline';
  isInlineList: boolean = false;
  enabledKpis: boolean = false;
  showKpis: boolean = false;
  backgroundResumeSubs: Subscription;
  authUserSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private platform: Platform,
    private campaignService: CampaingService,
    private tableUserService: TableUserService
  ) { }
  
  ngOnInit(): void {
    this.settingArgs();
  }

  async ionViewWillEnter() {
    this.showForms = false;
    this.showKpis = false;
    this.lastAccessDate = moment().toDate();
    this.store.dispatch(tapMenuSelectedAction({ indexTab: 4 }));
  }

  ionViewDidEnter() {
    this.backgroundResumeSubs = this.platform.resume.subscribe(() => {
      if (this.lastAccessDate != null) {
        // Si regresa del segundo plano y ya ha culminado el día, entonces, retornamos al calendario
        const today = moment().toDate();
        const compared = moment(today).diff(moment(this.lastAccessDate), 'days');

        if (compared >= 1) {
          this.store.dispatch(unSetCalendarAssistance());
          this.store.dispatch(clearSalespointSelected());
          this.router.navigate(['main/calendario']);
        }
      }
    });

    const salespointSelectedSubs = this.store.select('salespoint').subscribe(({ salespointSelected }) => {
      this.salespointSelected = salespointSelected;

      if (salespointSelected === null) {
        setTimeout(() => { salespointSelectedSubs?.unsubscribe(); }, 500);
        return;
      }

      const assistenceStatusSubs = this.store.select('assistance').subscribe(({ calendarAssistance }) => {
        if (calendarAssistance.length === 0) {
          setTimeout(() => { assistenceStatusSubs?.unsubscribe(); }, 500);
          return;
        }

        setTimeout(() => {
          this.initWorkList();
          assistenceStatusSubs?.unsubscribe();
        }, 500);
      });

      setTimeout(() => { salespointSelectedSubs?.unsubscribe(); }, 500);
    });
  }

  ionViewDidLeave() {
    this.backgroundResumeSubs?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.authUserSubs?.unsubscribe();
  } 

  async settingArgs() {
    this.activeCampaign = await this.campaignService.getActiveCampaing(); 

    this.authUserSubs = this.store.select('auth').subscribe(({ user }) => {
      if (user != null) {
        this.userAuth = user;
      }
    });
  } 

  async initWorkList() {
    this.showForms = true;
    this.showKpis = false;
    
    // Valida si la campaña tiene habilitado la opción de Indicadores o KPIs
    this.enabledKpis = (this.activeCampaign.decodeTokenUserConfig != undefined ? this.activeCampaign.decodeTokenUserConfig.Kpis : false); 
    
    // Verificamos si tiene un configuración de usuario reporteador
    const keyAppConfig = APP_CONFIG.UserReporter;
    const config = await this.tableUserService.getAppUserConfigCollection(parseInt(this.userAuth.uid), this.activeCampaign.idCampania, keyAppConfig);
    this.userReporterConfig = (config.length > 0 ? JSON.parse(config[0].valueObject) : null);
  }

  toggleListView() {
    this.list_icon = (!this.showForms ? this.list_icon : (this.list_icon == 'reorder-four-outline' ? 'grid-outline' : 'reorder-four-outline'));
    this.isInlineList = (!this.showForms ? this.isInlineList : !this.isInlineList);
    setTimeout(() => {
      this.showForms = true;
      this.showKpis = false;
    }, 250);
  }

  onShowIndicatorView() {
    this.showKpis = true;
    this.showForms = false;
  }
}
