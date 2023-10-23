import { Injectable } from '@angular/core';

import { CampaingService } from '../STORE/campaing.store.service';
import { AuthServiceStore } from '../STORE/auth.store.service';
import { TableUserService } from './table-user.service';
import { TableFormService } from './table-form.service';
import { DatabaseFormSyncService } from './database-form-sync.service';
import { TableNormalFormService } from './table-normal-form.service';
import { DatabaseNormalFormSyncService } from './database-normal-form-sync.service';

import { UserCampaign } from '../../shared/models/user.interface';
import { APP_CONFIG } from '../../shared/constants/values.constants';

@Injectable({
  providedIn: 'root'
})
export class DatabaseSyncService {

  constructor(
    private authStore: AuthServiceStore,
    private campaignService: CampaingService,
    private tableUserService: TableUserService,
    private tableFormService: TableFormService,
    private databaseFormSyncService: DatabaseFormSyncService,
    private tableNormalFormService: TableNormalFormService,
    private databaseNormalFormSyncService: DatabaseNormalFormSyncService
  ) { }

  gettingArgs(): Promise<{ campaignId: number, userId: number }> {
    return new Promise(async (resolve, reject) => {
      const keyAppConfig = APP_CONFIG.UserReporter;

      const activeCampaign = await this.campaignService.getActiveCampaing();
      const activeUser = await this.authStore.getActiveUser();
      const config = await this.tableUserService.getAppUserConfigCollection(parseInt(activeUser.uid), activeCampaign.idCampania, keyAppConfig);
      const parseConfig: UserCampaign = (config.length > 0 ? JSON.parse(config[0].valueObject) : null);
      const userConfig: number = (parseConfig ? parseConfig.idUsuario : parseInt(activeUser.uid));

      resolve({ campaignId: activeCampaign.idCampania, userId: userConfig });
    });
  }

  async workdayFormsCompleteToSync(): Promise<boolean> {
    let promisesSyncForms: Array<Promise<any>> = [];

    const args = await this.gettingArgs();
    const formsInDatabase = await this.tableFormService.getFormListCollection(args.campaignId);
    const workdayFormsList = formsInDatabase.filter(x => x.activo && x.publicado && x.isCompleted && !x.isSynchronized && x.idUsuarioJornada === args.userId);

    if (workdayFormsList.length === 0) {
      return true;
    }

    workdayFormsList.forEach(item => {
      promisesSyncForms.push(this.databaseFormSyncService.syncWorkDayFormById(true, item.idJornada, item.idPdv, item.idFormularioJornada));
    });

    await Promise.all(promisesSyncForms);

    return true;
  }

  async normalFormsCompleteToSync() {
    let promisesSyncNormalForms: Array<Promise<any>> = [];

    const args = await this.gettingArgs();
    const normalFormsAnswersInDatabase = await this.tableNormalFormService.getNormalFormAssistanceAnswer(args.userId);

    if (normalFormsAnswersInDatabase.length === 0) {
      return true;
    }

    normalFormsAnswersInDatabase.forEach(item => {
      const { idReporteFormulario, idFormulario } = item.dataInsertReporteFormulario;
      promisesSyncNormalForms.push(this.databaseNormalFormSyncService.syncNormalFormById(args.userId, idReporteFormulario, idFormulario));
    });

    await Promise.all(promisesSyncNormalForms);

    return true;
  }
}
