import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../store/app.reducer';
import { formSelectedAction } from '../../../../../../store/actions/form.action';
import { setMainRouteBackAction, unsetMainRouteBackAction } from '../../../../../../store/actions/menu.action';

import { CampaingService } from '../../../../../../services/STORE/campaing.store.service';
import { TableUserService } from '../../../../../../services/database/table-user.service';
import { TableFormService } from '../../../../../../services/database/table-form.service';
import { TableNormalFormService } from '../../../../../../services/database/table-normal-form.service';
import { FormularioService } from '../../../../../../services/API/formulario.service';
import { FormularioJornadasService } from '../../../../../../services/API/formulario-jornadas.service';
import { InternetConnectionService } from '../../../../../../services/internet-connection.service';
import { AlertService } from '../../../../../../services/UI/alert.service';
import { LoadingService } from '../../../../../../services/UI/loading.service';

import { User } from '../../../../../../shared/models/user.model';
import { UserCampaign } from '../../../../../../shared/models/user.interface';
import { IItemCampaign } from '../../../../../../shared/models/campaing.interface';
import { FormularioJornada } from '../../../../../../shared/models/formulario-jornada';
import { FormularioNormal } from '../../../../../../shared/models/formulario';
import { PdvsJornada } from '../../../../../../shared/models/jornada.interface';
import { CalendarAssistance } from '../../../../../../shared/models/assistance.interface';
import { APP_CONFIG, FORMS_ICON } from '../../../../../../shared/constants/values.constants';

@Component({
  selector: 'form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
})
export class FormListComponent implements OnInit {
  @Input() isInlineList: boolean = false;
  userAuth: User = null;
  activeCampaign: IItemCampaign = null;
  completed_icon: string = 'assets/svg/completed.svg';
  sad_face: string = 'assets/svg/sad_face.svg';
  form_theme_icon: string = 'assets/svg/theme_form.svg';
  salespointSelected: PdvsJornada = null;
  calendarAssistanceCollection: Array<CalendarAssistance> = [];
  workDayFormsCollection: Array<FormularioJornada> = [];
  normalFormsCollection: Array<FormularioNormal> = [];
  isLoading: boolean = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private campaignService: CampaingService,
    private tableUserService: TableUserService,
    private tableFormService: TableFormService,
    private tableNormalFormService: TableNormalFormService,
    private formularioService: FormularioService,
    private formularioJornadaSrv: FormularioJornadasService,
    private internetService: InternetConnectionService,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.loadingService.show('Cargando formularios...');
    this.initFormList();
  }

  async initFormList() {
    this.activeCampaign = await this.campaignService.getActiveCampaing();

    const authUserSubs = this.store.select('auth').subscribe(({ user }) => {
      this.userAuth = user;
      setTimeout(() => { authUserSubs?.unsubscribe(); }, 500);
    });

    const salespointSelectedSubs = this.store.select('salespoint').subscribe(({ salespointSelected }) => {
      this.salespointSelected = salespointSelected;

      if (salespointSelected == null) {
        setTimeout(() => {
          this.isLoading = false;
          this.loadingService.stop();
          this.store.dispatch(unsetMainRouteBackAction());
          salespointSelectedSubs?.unsubscribe();
        }, 500);
        return;
      }

      const assistenceStatusSubs = this.store.select('assistance').subscribe(({ calendarAssistance }) => {
        this.calendarAssistanceCollection = calendarAssistance;

        if (calendarAssistance.length == 0) {
          setTimeout(() => {
            this.isLoading = false;
            this.loadingService.stop();
            this.store.dispatch(unsetMainRouteBackAction());
            assistenceStatusSubs?.unsubscribe();
          }, 500);
          return;
        }

        this.store.dispatch(setMainRouteBackAction({ routerBackId: 4 }));

        setTimeout(() => {
          this.getWorkingDayForms();
          assistenceStatusSubs?.unsubscribe();
        }, 500);
      });

      setTimeout(() => { salespointSelectedSubs?.unsubscribe(); }, 500);
    });
  }

  async getWorkingDayForms() {
    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      this.getOfflineForms();
      return;
    }

    this.getOnlineForms();
  }

  async getOfflineForms() {
    const formListSQL = await this.tableFormService.getFormListCollection(this.activeCampaign.idCampania, this.salespointSelected.idJornada, this.salespointSelected.idPdv, []);
    const normalFormListSQL = await this.tableNormalFormService.getNormalFormCollection(this.activeCampaign.idCampania);

    this.workDayFormsCollection = formListSQL;
    this.normalFormsCollection = normalFormListSQL.filter(x => x.activo && x.publicado && x.asociadoPdv);
    this.isLoading = false;
    setTimeout(() => { this.loadingService.stop(); }, 250);
  }

  async getOnlineForms() {
    // Verificamos si tiene un configuración de usuario reporteador
    const keyAppConfig = APP_CONFIG.UserReporter;
    const config = await this.tableUserService.getAppUserConfigCollection(parseInt(this.userAuth.uid), this.activeCampaign.idCampania, keyAppConfig);
    const parseConfig: UserCampaign = (config.length > 0 ? JSON.parse(config[0].valueObject) : null);
    const presentUserRol: number = (parseConfig ? parseConfig.idRol : this.activeCampaign.idRol);

    const workDayDate = this.calendarAssistanceCollection[0].dateMarked;

    const formListSQL = await this.tableFormService.getFormListCollection(this.activeCampaign.idCampania, this.salespointSelected.idJornada, this.salespointSelected.idPdv, []);
    const normalFormListSQL = await this.tableNormalFormService.getNormalFormCollection(this.activeCampaign.idCampania);

    // Obtenemos los Formularios Jornada
    const formulariosSubs = this.formularioJornadaSrv.getListaFormulariosJornada(this.salespointSelected.idPdv, presentUserRol, this.salespointSelected.idJornada).subscribe(async (responseWorkDayForm) => {
      if (!responseWorkDayForm || responseWorkDayForm.length === 0) {
        this.workDayFormsCollection = formListSQL;
      } else {
        const resultForm = responseWorkDayForm.filter(x => x.activo && x.publicado).map(y => {
          const index = formListSQL.findIndex(z => z.idFormularioJornada === y.idFormularioJornada && z.idJornada === this.salespointSelected.idJornada && z.idPdv === this.salespointSelected.idPdv);

          return ({
            ...y,
            obligatorioIcon: (y.obligatorio ? 'assets/svg/required_active.svg' : ''),
            temaFormularioIcon: FORMS_ICON[y.temaFormulario],
            isCompleted: (y.completado ? y.completado : (index != -1 ? formListSQL[index].isCompleted : false)),
            salespointName: this.salespointSelected.nombrePdv,
            isSynchronized: (y.completado ? y.completado : (index != -1 ? formListSQL[index].isSynchronized : false)),
            idUsuarioJornada: (parseConfig ? parseConfig.idUsuario : parseInt(this.userAuth.uid)),
            fechaJornada: workDayDate,
            campaignId: this.activeCampaign.idCampania
          });
        });

        this.workDayFormsCollection = resultForm;
        await this.tableFormService.addFormListCollection(resultForm);
      }

      // Obtenemos los Formularios Normales asociados a Punto de Venta
      const formsSubs = this.formularioService.getFormulariosByRole(presentUserRol).subscribe(async (responseNormalForm) => {
        if (!responseNormalForm || responseNormalForm.length === 0) {
          const normalForms = normalFormListSQL.filter(x => x.activo && x.publicado && x.asociadoPdv);
          this.normalFormsCollection = normalForms;
        } else {
          const normalForms = responseNormalForm.filter(x => x.activo && x.publicado && x.asociadoPdv).map(y => ({
            ...y,
            salespointId: this.salespointSelected.idPdv,
            salespointName: this.salespointSelected.nombrePdv,
            campaignId: this.activeCampaign.idCampania
          }));

          this.normalFormsCollection = normalForms;
          await this.tableNormalFormService.addNormalFormCollection(normalForms);
        }

        this.isLoading = false;
        setTimeout(() => { formsSubs?.unsubscribe(); formulariosSubs?.unsubscribe(); this.loadingService.stop(); }, 250);
      });
    });
  }

  async refreshWorkingDayForms(event) {
    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      setTimeout(() => { event.target.complete(); }, 2500);
      return;
    }

    this.getOnlineForms();
    setTimeout(() => { event.target.complete(); }, 2500);
  }

  onSelectedForm(formId: number, isWorkDayForm: boolean) {
    if (isWorkDayForm) {
      const isCompleted = this.workDayFormsCollection.filter(X => X.idFormularioJornada == formId)[0].completado;

      if (isCompleted) {
        return;
      }
    }

    const formSelected = (isWorkDayForm ?
      this.workDayFormsCollection.filter(X => X.idFormularioJornada == formId)[0] :
      this.normalFormsCollection.filter(x => x.idFormulario == formId)[0]);

    this.store.dispatch(formSelectedAction({ formSelected, isWorkDayForm }));
    this.router.navigate(['main/tarea-form']);
  }
}
