import { Injectable } from '@angular/core';

import { JornadasService } from '../API/jornadas.service';
import { AsistenciaServiceAPI } from '../API/asistencia.api.service';
import { FormularioService } from '../API/formulario.service';
import { FormularioJornadasService } from '../API/formulario-jornadas.service';

import { TableUserService } from './table-user.service';
import { TableWorkdayRouteService } from './table-workday-route.service';
import { TableWorkdayAssistanceService } from './table-workday-assistance.service';
import { TableNormalFormService } from './table-normal-form.service';
import { TableFormService } from './table-form.service';


import { AlertService } from '../UI/alert.service';
import { LoadingService } from '../UI/loading.service';
import { InternetConnectionService } from '../internet-connection.service';

import { UserCampaign } from '../../shared/models/user.interface';
import { PdvsJornada } from '../../shared/models/jornada.interface';
import {
  DependencyThemeFormRequest, FormThemeType,
  Formulario, FormularioJornada
} from '../../shared/models/formulario-jornada';
import { FormularioNormal } from '../../shared/models/formulario';
import { APP_CONFIG, FORMS_ICON } from '../../shared/constants/values.constants';

import { forkJoin } from 'rxjs';
import * as moment from 'moment';
moment.locale('es');

@Injectable({
  providedIn: 'root'
})
export class DatabaseImportService {

  constructor(
    private jornadasService: JornadasService,
    private assistanceService: AsistenciaServiceAPI,
    private formularioService: FormularioService,
    private formularioJornadaService: FormularioJornadasService,
    private tableUserService: TableUserService,
    private tableWorkdayRouteService: TableWorkdayRouteService,
    private tableWorkdayAssistanceService: TableWorkdayAssistanceService,
    private tableNormalFormService: TableNormalFormService,
    private tableFormService: TableFormService,
    private internetService: InternetConnectionService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) { }

  importRouteByUser(campaignId: number, userId: number, dateWorkday: string): Promise<{ success: boolean; routePdvs: Array<PdvsJornada> }> {
    return new Promise((resolve, reject) => {
      const getRutasByUsuarioSubs = this.jornadasService.getRutasByUsuario(userId, dateWorkday, dateWorkday)
        .subscribe(async (responseRoutes) => {
          setTimeout(() => { getRutasByUsuarioSubs?.unsubscribe(); }, 250);

          if (!responseRoutes) {
            return resolve({ success: false, routePdvs: [] });
          }

          if (responseRoutes.length === 0) {
            return resolve({ success: true, routePdvs: [] });
          }

          const routePdvs: Array<PdvsJornada> = responseRoutes.reduce((prev, curr) => {
            curr.pdvsJornada.forEach((item) => { prev.push(item); });
            return prev;
          }, []);

          await this.tableWorkdayRouteService.addWorkdayRouteCollection(responseRoutes, campaignId);
          await this.tableWorkdayRouteService.addWorkdayRouteSalespointCollection(routePdvs, campaignId);

          resolve({ success: true, routePdvs });
        });
    });
  }

  importAssistanceTypes(campaignId: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const getAssistanceTypeSubs = this.assistanceService.getAracne3AssistanceType().subscribe(async (responseAssistanceType) => {
        setTimeout(() => { getAssistanceTypeSubs?.unsubscribe(); }, 250);

        if (!responseAssistanceType) {
          return resolve(false);
        }

        if (responseAssistanceType.length === 0) {
          return resolve(true);
        }

        const assistanceTypes = responseAssistanceType.map(x => ({ ...x, idCampania: campaignId }));
        await this.tableWorkdayAssistanceService.addAssistanceTypeCollection(assistanceTypes);
        resolve(true);
      });
    });
  }

  importAssistenceStatus(campaignId: number, workdayId: number, salespointIds: Array<number>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const batcheRequestAssistenceStatus = salespointIds.map(id => this.assistanceService.getAracne3AssistancesForWorkDay(workdayId, id));

      const getAssistanceStatusSubs = forkJoin(batcheRequestAssistenceStatus).subscribe(async (responseAssistances) => {
        setTimeout(() => { getAssistanceStatusSubs?.unsubscribe(); }, 250);

        const resultAssistance = responseAssistances.reduce((prev, curr) => {
          prev.push(...curr);
          return prev;
        }, []);

        if (resultAssistance.some(x => !x)) {
          return resolve(false);
        }

        const assistances = resultAssistance.map(x => ({ ...x, idCampania: campaignId }));
        await this.tableWorkdayAssistanceService.addAssistanceWorkday(assistances);
        resolve(true);
      });
    });
  }

  importNormalForms(campaignId: number, roleId: number, salespoint: Array<{ id: number; name: string }> = []): Promise<boolean> {
    const salespointForms: Array<FormularioNormal> = [];

    return new Promise((resolve, reject) => {
      const getNormalFormSubs = this.formularioService.getFormulariosByRole(roleId).subscribe(async (responseNormalForm) => {
        setTimeout(() => { getNormalFormSubs?.unsubscribe(); }, 250);

        if (!responseNormalForm) {
          return resolve(false);
        }

        const normalForms = responseNormalForm.filter(x => x.activo && x.publicado && !x.asociadoPdv);

        if (normalForms.length > 0) {
          const forms = normalForms.map(x => ({
            ...x,
            campaignId: campaignId
          }));
          await this.tableNormalFormService.addNormalFormCollection(forms);

          const normalFormIds: Array<number> = normalForms.map(x => x.idFormulario);
          const batchNormalFormsFields = normalFormIds.map(id => this.formularioService.getFormularioById(id));

          const getNormalFormFieldSubs = forkJoin(batchNormalFormsFields).subscribe(async (normalFormFields) => {
            if (normalFormFields.length > 0) {
              await this.tableNormalFormService.addNormalFormData(campaignId, normalFormFields);
            }

            setTimeout(() => { getNormalFormFieldSubs?.unsubscribe(); }, 250);
          });
        }

        const normalSalespointForms = responseNormalForm.filter(x => x.activo && x.publicado && x.asociadoPdv);

        if (normalSalespointForms.length > 0 && salespoint.length > 0) {
          salespoint.forEach(item => {
            const forms = normalSalespointForms.map(x => ({
              ...x,
              salespointId: item.id,
              salespointName: item.name,
              campaignId: campaignId
            }));
            salespointForms.push(...forms);
          });
          await this.tableNormalFormService.addNormalFormCollection(salespointForms);

          const normalSalespointFormIds: Array<number> = salespointForms.map(x => x.idFormulario);
          const uniqueIds = [...new Set(normalSalespointFormIds)];
          const batchNormalSalespointFormsFields = uniqueIds.map(id => this.formularioService.getFormularioById(id));

          const getNormalSalespointFormFieldSubs = forkJoin(batchNormalSalespointFormsFields).subscribe(async (normalSalespointFormFields) => {
            if (normalSalespointFormFields.length > 0) {
              await this.tableNormalFormService.addNormalFormData(campaignId, normalSalespointFormFields);
            }

            setTimeout(() => { getNormalSalespointFormFieldSubs?.unsubscribe(); }, 250);
          });
        }

        resolve(true);
      });
    });
  }

  importWorkdayForms(campaignId: number, userId: number, roleId: number, workdayId: number,
    salespoint: Array<{ id: number; name: string }>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const batchRequestWorkdayForms = salespoint.map(x => this.formularioJornadaService.getListaFormulariosJornada(x.id, roleId, workdayId));

      const getWorkdayFormSubs = forkJoin(batchRequestWorkdayForms).subscribe(async (responseWorkdayForms) => {
        setTimeout(() => { getWorkdayFormSubs?.unsubscribe(); }, 250);

        const resultForm = responseWorkdayForms.reduce((prev, curr) => {
          prev.push(...curr);
          return prev;
        }, []);

        if (resultForm.some(x => !x)) {
          return resolve(false);
        }

        if (resultForm.length === 0) {
          return resolve(true);
        }

        const resultActivePublishForm: Array<FormularioJornada> = resultForm.filter(x => x.activo && x.publicado).map(y => ({
          ...y,
          obligatorioIcon: (y.obligatorio === true ? 'assets/svg/required_active.svg' : ''),
          temaFormularioIcon: FORMS_ICON[y.temaFormulario],
          isCompleted: (y.completado ? y.completado : false),
          salespointName: salespoint.filter(f => f.id === y.idPdv).map(m => m.name)[0],
          isSynchronized: (y.completado ? y.completado : false),
          idUsuarioJornada: userId,
          fechaJornada: moment().toDate(),
          campaignId: campaignId
        }));

        await this.tableFormService.addFormListCollection(resultActivePublishForm);

        // Campos y Opciones de Formularios Jornada
        const formsUniques = [...new Map(resultActivePublishForm.map((m) => [m.idFormularioJornada, m])).values()];
        const batchFormsFields = formsUniques.map(request => this.formularioJornadaService.getCamposFormularioJornada(request.idFormularioJornada));

        const getFormFieldSubs = forkJoin(batchFormsFields).subscribe(formFields => {
          setTimeout(() => { getFormFieldSubs?.unsubscribe(); }, 250);

          if (formFields.length === 0) {
            return resolve(false);
          }

          const workdayFormFields: Array<Formulario> = [];

          resultActivePublishForm.forEach(item => {
            const fields = formFields.filter(x => x.idFormularioJornada === item.idFormularioJornada).map(y => ({
              ...y,
              detalleTema: y.detalleTema.map(m => ({ ...m, imagenTema: item.temaFormularioIcon })),
              idJornada: item.idJornada,
              idPdv: item.idPdv,
              campaignId: campaignId
            }));

            if (fields.length > 0) {
              workdayFormFields.push(...fields);
            }
          });

          this.tableFormService.addFormDetailCollection(workdayFormFields);
          return resolve(true);
        });
      });
    });
  }

  importFilterDependencyTheme(dependencyThemeId: number, campaignId: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const request: DependencyThemeFormRequest = {
        idTemaFormulario: dependencyThemeId,
        idSuperCategoria: 0,
        idCategoria: 0,
        idMarca: 0,
        idLineaProducto: 0,
        idProducto: 0
      }

      const getDependencyThemeFormSubs = this.formularioJornadaService.getListaTemaDependencia(dependencyThemeId, request).subscribe(async (dependency) => {
        setTimeout(() => { getDependencyThemeFormSubs?.unsubscribe(); }, 250);

        if (!dependency) {
          return resolve(false);
        }

        if (dependency.length === 0) {
          return resolve(true);
        }

        const request = dependency.map(x => ({
          ...x,
          campaignId: campaignId,
          formThemeId: FormThemeType[x.tipoTemaDependencia]
        }));

        await this.tableFormService.addDependencyFormTable(request);
        resolve(true);
      });
    });
  }

  async importDataForApp(userId: number, campaignId: number, campaignName: string, roleId: number) {
    const importDay = moment().format('MM-DD-YYYY');
    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      this.alertService.showAlert('no_wifi.svg', '¡Sin conexión a internet!', `No hay conexión a Internet.\r\ Por favor, verificar su conexión.`);
      return;
    }

    // Verificamos si tiene un configuración de usuario reporteador
    const keyAppConfig = APP_CONFIG.UserReporter;
    const config = await this.tableUserService.getAppUserConfigCollection(userId, campaignId, keyAppConfig);
    const parseConfig: UserCampaign = (config.length > 0 ? JSON.parse(config[0].valueObject) : null);
    const presentUserId: number = (parseConfig ? parseConfig.idUsuario : userId);
    const presentRoleId: number = (parseConfig ? parseConfig.idRol : roleId);

    this.loadingService.show(`Importando datos de la campaña ${campaignName}${(parseConfig ? ` para ${parseConfig.usuario}` : '')}...`);

    // Tipos de Asistencia
    const resultAssistanceType = await this.importAssistanceTypes(campaignId);

    if (!resultAssistanceType) {
      this.loadingService.stop();
      this.alertService.showAlert(null, 'No se pudo importar', 'Ocurrió un error al importa la configuración de la jornada, puede intentarlo nuevamente.');
      return;
    }

    // Formularios Normales o Asociados a Pdv
    const resultNormalForms = await this.importNormalForms(campaignId, presentRoleId);

    if (!resultNormalForms) {
      this.loadingService.stop();
      this.alertService.showAlert(null, 'No se pudo importar', 'Ocurrió un error al intentar importar los formularios, puede intentarlo nuevamente.');
      return;
    }

    // Ruta y Pdv.
    const resultRoutes = await this.importRouteByUser(campaignId, presentUserId, importDay);

    if (!resultRoutes.success) {
      this.loadingService.stop();
      this.alertService.showAlert(null, 'No se pudo importar', 'Ocurrió un error al intentar importar la jornada de hoy, puede intentarlo nuevamente.');
      return;
    }

    if (resultRoutes.routePdvs.length > 0) {
      const workdayId: number = resultRoutes.routePdvs.map(x => x.idJornada)[0];
      const salespoints = resultRoutes.routePdvs.map(y => ({ id: y.idPdv, name: y.nombrePdv }));
      const salespointIds = salespoints.map(x => x.id);

      // Asistencias de la Jornada
      const resultAssistances = await this.importAssistenceStatus(campaignId, workdayId, salespointIds);

      if (!resultAssistances) {
        this.loadingService.stop();
        this.alertService.showAlert(null, 'No se pudo importar', 'Ocurrió un error al importa la configuración de la jornada, puede intentarlo nuevamente.');
        return;
      }

      // Formularios Jornada
      const resultWorkdayForms = await this.importWorkdayForms(campaignId, presentUserId, presentRoleId, workdayId, salespoints);

      if (!resultWorkdayForms) {
        this.loadingService.stop();
        this.alertService.showAlert(null, 'No se pudo importar', 'Ocurrió un error al importar los formularios de la jornada, puede intentarlo nuevamente.');
        return;
      }

      // Dependencias Formularios Jornada 
      const resultDependencyThemes = await this.importFilterDependencyTheme(5, campaignId);

      if (!resultDependencyThemes) {
        this.loadingService.stop();
        this.alertService.showAlert(null, 'No se pudo importar', 'Ocurrió un error al importar la configuración de formularios de la jornada, puede intentarlo nuevamente.');
        return;
      }
    }

    this.loadingService.stop();
    this.alertService.showAlert('workday_success.svg', 'Datos importados',
      `La campaña ${campaignName}${(parseConfig ? ` para ${parseConfig.usuario}` : '')} ahora puede trabajar Offline`);
  }
}
