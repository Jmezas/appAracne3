import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import { tapMenuSelectedAction, unsetMainRouteBackAction } from '../../../../store/actions/menu.action';

import { AuthServiceStore } from '../../../../services/STORE/auth.store.service';
import { CampaingService } from '../../../../services/STORE/campaing.store.service';
import { TableUserService } from '../../../../services/database/table-user.service';
import { TableFormService } from '../../../../services/database/table-form.service';
import { DatabaseFormSyncService } from '../../../../services/database/database-form-sync.service';
import { TableNormalFormService } from '../../../../services/database/table-normal-form.service';
import { DatabaseNormalFormSyncService } from '../../../../services/database/database-normal-form-sync.service';
import { InternetConnectionService } from '../../../../services/internet-connection.service';
import { LoadingService } from '../../../../services/UI/loading.service';
import { AlertService } from '../../../../services/UI/alert.service';

import { UserCampaign } from '../../../../shared/models/user.interface';
import { FormularioJornada } from '../../../../shared/models/formulario-jornada';
import { APP_CONFIG } from '../../../../shared/constants/values.constants';

import * as moment from 'moment';
moment.locale('es');

export interface DataPending {
  workdayOrReportId?: number;
  formId: number;
  formName: string;
  icon: string;
  isWorkdayForm: boolean;
  isLoading: boolean;
  isSync: boolean;
  isEnabled: boolean;
}
export interface DataPendingSync {
  registerDate: Date;
  registerDateFormat: string;
  salespointId?: number;
  salespointName?: string;
  dataPending: Array<DataPending>;
}

@Component({
  selector: 'app-tarea-sync',
  templateUrl: './tarea-sync.page.html',
  styleUrls: ['./tarea-sync.page.scss'],
})
export class TareaSyncPage implements OnInit {
  dataPendingSync: Array<DataPendingSync> = [];
  syncIcon: string = 'assets/svg/sync-circle-outline.svg';
  syncSuccessIcon: string = 'assets/svg/checkmark-circle-outline.svg';
  isLoading: boolean = false;
  presentUserId: number;
  presentCampaignId: number;

  constructor(
    private store: Store<AppState>,
    private authStore: AuthServiceStore,
    private campaingService: CampaingService,
    private tableUserService: TableUserService,
    private databaseFormSync: DatabaseFormSyncService,
    private tableFormService: TableFormService,
    private tableNormalFormService: TableNormalFormService,
    private databaseNormalFormSync: DatabaseNormalFormSyncService,
    private internetService: InternetConnectionService,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) { }

  ngOnInit() { }

  ionViewWillEnter(): void {
    this.store.dispatch(tapMenuSelectedAction({ indexTab: 0 }));
    this.store.dispatch(unsetMainRouteBackAction());

    this.isLoading = true;
    this.loadingService.show('Cargando registros pendientes...');

    this.settingArg();
  }

  async settingArg() {
    const activeUser = await this.authStore.getActiveUser();
    const activeCampaign = await this.campaingService.getActiveCampaing();
    // Verificamos si tiene un configuración de usuario reporteador
    const keyAppConfig = APP_CONFIG.UserReporter;
    const config = await this.tableUserService.getAppUserConfigCollection(parseInt(activeUser.uid), activeCampaign.idCampania, keyAppConfig);
    const parseConfig: UserCampaign = (config.length > 0 ? JSON.parse(config[0].valueObject) : null);

    this.presentUserId = (parseConfig ? parseConfig.idUsuario : parseInt(activeUser.uid));
    this.presentCampaignId = activeCampaign.idCampania;
    this.initModule();
  }

  initModule(): Promise<boolean> {
    this.dataPendingSync = [];

    return new Promise(async (resolve, reject) => {
      const formsInDatabase = await this.tableFormService.getFormListCollection(this.presentCampaignId);
      const formsAnswerInDatabase = await this.tableFormService.getAnswersFormByUserCampaign(this.presentCampaignId, this.presentUserId);
      const workdayFormsNotSincronized: Array<FormularioJornada> = [];
      const workdayFormsList = formsInDatabase.filter(x => x.activo && x.publicado && !x.isSynchronized && x.idUsuarioJornada === this.presentUserId);

      workdayFormsList.forEach(item => {
        const withAnswers = formsAnswerInDatabase.some(x => x.idFormularioJornada === item.idFormularioJornada && x.idJornada === item.idJornada && x.idPdv === item.idPdv);
        if (withAnswers) {
          workdayFormsNotSincronized.push(item);
        }
      });

      workdayFormsNotSincronized.forEach((item, index, array) => {
        const validIfExists = (index === 0 ? false : this.dataPendingSync.some(x => x.registerDateFormat === moment(item.fechaJornada).format('DD/MM/YYYY') && x.salespointId === item.idPdv));

        if (!validIfExists) {
          const formsOfSalespointDay = array.filter(x => x.idJornada === item.idJornada && x.idPdv === item.idPdv).reduce((prev, curr) => {
            prev.push({
              workdayOrReportId: curr.idJornada,
              formId: curr.idFormularioJornada,
              formName: curr.nombreFormulario,
              icon: 'assets/svg/theme_form-outline.svg',
              isWorkdayForm: true,
              isLoading: false,
              isSync: false,
              isEnabled: true
            });
            return prev;
          }, ([] as Array<DataPending>));

          const registerDateOfForms = moment(item.fechaJornada).format('DD/MM/YYYY');

          this.dataPendingSync.push({
            registerDate: moment(registerDateOfForms, 'dd/mm/yyyy').toDate(),
            registerDateFormat: registerDateOfForms,
            salespointId: item.idPdv,
            salespointName: item.salespointName,
            dataPending: formsOfSalespointDay
          });
        }
      });

      const normalFormsInDatabase = await this.tableNormalFormService.getNormalFormCollection(this.presentCampaignId);
      const normalFormsAnswerInDatabase = await this.tableNormalFormService.getNormalFormAssistanceAnswer(this.presentUserId);
      const normalFormWithPdvNotSincronized = normalFormsAnswerInDatabase.filter(x => x.dataInsertReporteFormulario.idPdv != undefined && x.dataInsertReporteFormulario.idPdv != null);

      normalFormWithPdvNotSincronized.forEach(item => {
        const indexDataPending = this.dataPendingSync.findIndex(x => x.registerDateFormat === moment(item.dataInsertReporteFormulario.fechaReporte).format('DD/MM/YYYY') && x.salespointId === item.dataInsertReporteFormulario.idPdv);
        const formName: string = normalFormsInDatabase.filter(x => x.idFormulario === item.dataInsertReporteFormulario.idFormulario).map(y => y.nombreFormulario)[0];

        const normalFormsOfSalespointDay: DataPending = {
          workdayOrReportId: item.dataInsertReporteFormulario.idReporteFormulario,
          formId: item.dataInsertReporteFormulario.idFormulario,
          formName,
          icon: 'assets/svg/theme_form-outline.svg',
          isWorkdayForm: false,
          isLoading: false,
          isSync: false,
          isEnabled: true
        };

        if (indexDataPending != -1) {
          this.dataPendingSync[indexDataPending].dataPending.push(normalFormsOfSalespointDay);
        } else {
          const registerDateOfForms = moment(item.dataInsertReporteFormulario.fechaReporte).format('DD/MM/YYYY');

          this.dataPendingSync.push({
            registerDate: moment(registerDateOfForms, 'dd/mm/yyyy').toDate(),
            registerDateFormat: registerDateOfForms,
            salespointId: item.dataInsertReporteFormulario.idPdv,
            salespointName: item.dataInsertReporteFormulario.salespointName,
            dataPending: [normalFormsOfSalespointDay]
          });
        }
      });

      const normalFormNotSincronized = normalFormsAnswerInDatabase.filter(x => !x.dataInsertReporteFormulario.idPdv);

      normalFormNotSincronized.forEach(item => {
        const indexDataPending = this.dataPendingSync.findIndex(x => x.registerDateFormat === moment(item.dataInsertReporteFormulario.fechaReporte).format('DD/MM/YYYY') && !x.salespointId);
        const formName: string = normalFormsInDatabase.filter(x => x.idFormulario === item.dataInsertReporteFormulario.idFormulario).map(y => y.nombreFormulario)[0];

        const normalForms: DataPending = {
          workdayOrReportId: item.dataInsertReporteFormulario.idReporteFormulario,
          formId: item.dataInsertReporteFormulario.idFormulario,
          formName,
          icon: 'assets/svg/theme_form-outline.svg',
          isWorkdayForm: false,
          isLoading: false,
          isSync: false,
          isEnabled: true
        };

        if (indexDataPending != -1) {
          this.dataPendingSync[indexDataPending].dataPending.push(normalForms);
        } else {
          const registerDateOfForms = moment(item.dataInsertReporteFormulario.fechaReporte).format('DD/MM/YYYY');

          this.dataPendingSync.push({
            registerDate: moment(registerDateOfForms, 'dd/mm/yyyy').toDate(),
            registerDateFormat: registerDateOfForms,
            salespointId: null,
            salespointName: 'Formularios',
            dataPending: [normalForms]
          });
        }
      });

      if (this.dataPendingSync.length > 0) {
        this.dataPendingSync = this.dataPendingSync.sort((x, y) => Number(new Date(x.registerDate)) - Number(new Date(y.registerDate)));
      }

      setTimeout(() => {
        this.isLoading = false;
        this.loadingService.stop();
        resolve(true);
      }, 500);
    });
  }

  refreshDataPending(event: any) {
    this.initModule().then(result => {
      event.target.complete();
    });
  }

  async onSyncWorkPending(indexParent: number, indexChild: number) {
    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      this.alertService.showAlert('no_wifi.svg', '¡Sin conexión a internet!', `Por favor, verificar su conexión y volver a intentarlo.`);
      return;
    }

    let resultSync: boolean = false;
    this.dataPendingSync[indexParent].dataPending[indexChild].isLoading = true; 
    
    this.dataPendingSync.forEach((item, index) => {
      if (indexParent != index) {
        item.dataPending = item.dataPending.map(x => ({...x, isEnabled : false }));
      } else {
        this.dataPendingSync[indexParent].dataPending.forEach((item2, index2) => {
          if (indexChild != index2) {
            item2.isEnabled = false;
          }
        });
      }
    });

    const { salespointId } = this.dataPendingSync[indexParent];
    const { workdayOrReportId, formId, isWorkdayForm } = this.dataPendingSync[indexParent].dataPending[indexChild];

    if (isWorkdayForm) {
      // Sincronizamos las respuestas del formulario con el api de formularios respuesta
      resultSync = await this.databaseFormSync.syncWorkDayFormById(true, workdayOrReportId, salespointId, formId);
    } else {
      resultSync = await this.databaseNormalFormSync.syncNormalFormById(this.presentUserId, workdayOrReportId, formId);
    }

    if (!resultSync) {
      this.alertService.showAlert(null, 'Ocurrio un error', 'No se pudo sincronizar el registro del formulario, intente nuevamente.');
      this.dataPendingSync[indexParent].dataPending[indexChild].isLoading = false;
      this.dataPendingSync.forEach((item, index) => {
        item.dataPending = item.dataPending.map(x => ({...x, isEnabled : true }));
      });
      return;
    }

    this.alertService.showAlert('workday_success.svg', 'Formulario sincronizado', 'Se sincronizó correctamente el registro del formulario con el servidor');
    this.dataPendingSync[indexParent].dataPending[indexChild].isLoading = false;
    this.dataPendingSync[indexParent].dataPending[indexChild].isSync = true;
    this.dataPendingSync.forEach((item, index) => {
      item.dataPending = item.dataPending.map(x => ({...x, isEnabled : true }));
    });
  }
}
