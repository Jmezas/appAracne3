import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import { unsetMainRouteBackAction } from '../../../../store/actions/menu.action';

import { AuthServiceStore } from '../../../../services/STORE/auth.store.service';
import { CampaingService } from '../../../../services/STORE/campaing.store.service';
import { UserService } from '../../../../services/API/user.service';
import { TableUserService } from '../../../../services/database/table-user.service';
import { ModalService } from '../../../../services/UI/modal.service';
import { LoadingService } from '../../../../services/UI/loading.service';
import { ToastAlertService } from '../../../../services/UI/toast-alert.service';

import { User } from '../../../../shared/models/user.model';
import { UserCampaign } from '../../../../shared/models/user.interface';
import { AppUserConfig } from '../../../../shared/models/appUserConfig.interface';
import { IItemCampaign } from '../../../../shared/models/campaing.interface';
import { APP_CONFIG } from '../../../../shared/constants/values.constants';

@Component({
  selector: 'app-tarea-config',
  templateUrl: './tarea-config.page.html',
  styleUrls: ['./tarea-config.page.scss'],
})
export class TareaConfigPage implements OnInit {
  userData: User = null;
  campaignData: IItemCampaign = null;
  isOpenModalUserReporter: boolean = false;
  enterAnimation: any;
  leaveAnimation: any;
  userReporterSelected: UserCampaign = null;
  userReporterIcon: string = 'assets/svg/user.svg';
  modalUserReporterData: Array<UserCampaign> = [];
  modalUserReporterDataFilter: Array<UserCampaign> = [];
  checkUserReporter = new FormControl(false);

  constructor(
    private store: Store<AppState>,
    private authStore: AuthServiceStore,
    private campaingService: CampaingService,
    private userService: UserService,
    private tableUserService: TableUserService,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private toastService: ToastAlertService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.initConfigModule();
    this.enterAnimation = this.modalService.enterAnimation;
    this.leaveAnimation = this.modalService.leaveAnimation;
    this.store.dispatch(unsetMainRouteBackAction());
  }

  async initConfigModule() {
    this.userData = await this.authStore.getActiveUser();
    this.campaignData = await this.campaingService.getActiveCampaing();
    this.userReporterSelected = null;

    const config = await this.tableUserService.getAppUserConfigCollection(parseInt(this.userData.uid), this.campaignData.idCampania);

    if (config.length > 0) {
      const check = config.filter(x => x.key == APP_CONFIG.UserReporter);
      const value = (check.length > 0 ? check[0].value : false);
      this.userReporterSelected = (check.length > 0 ? JSON.parse(check[0].valueObject) : null);
      this.checkUserReporter.setValue(value);
    } else {
      this.userReporterSelected = null;
      this.checkUserReporter.setValue(false);
    }

    this.initModalUserReporterData();
  }

  initModalUserReporterData() {
    const userReporterSubs = this.userService.getUserCampaignReporter(parseInt(this.userData.uid),
      this.campaignData.idCampania, this.campaignData.idRol).subscribe(result => {
        this.modalUserReporterData = result;
        this.modalUserReporterDataFilter = result;
        setTimeout(() => { userReporterSubs?.unsubscribe(); }, 500);
      })
  }

  onChangeUserReport(event: any) {
    if (!event.detail.checked) {
      if (this.userReporterSelected) {
        this.onDeleteUserReporter();
      }
      return;
    }

    if (!this.userReporterSelected) {
      this.openModalUserReporter();
    }
  }

  openModalUserReporter() {
    this.isOpenModalUserReporter = true;
  }

  onChangeSearchUserReporter(event: any) {
    const query = event.target.value.toLowerCase();
    this.modalUserReporterDataFilter = this.modalUserReporterData.filter(d => d.usuario.toLowerCase().indexOf(query) > -1);
  }

  async onSelectUserReporter(userId: number) {
    this.isOpenModalUserReporter = false;
    this.loadingService.show('Configurando usuario...');

    const request: AppUserConfig = {
      userId: parseInt(this.userData.uid),
      campaignId: this.campaignData.idCampania,
      key: APP_CONFIG.UserReporter,
      value: true,
      valueObject: JSON.stringify(this.modalUserReporterData.filter(x => x.idUsuario === userId)[0])
    }

    const isInserted = await this.tableUserService.addAppUserConfig(request);

    setTimeout(() => {
      this.loadingService.stop();

      if (!isInserted) {
        this.userReporterSelected = null;
        this.checkUserReporter.setValue(false)
        this.toastService.warning('No se pudo configurar al usuario');
      } else {
        this.userReporterSelected = this.modalUserReporterData.filter(x => x.idUsuario === userId)[0];
      }
    }, 2000);
  }

  async onDeleteUserReporter() {
    this.loadingService.show('Desconfigurando usuario...');
    const request = [APP_CONFIG.UserReporter];
    const isDeleted = await this.tableUserService.deleteAppUserConfig(parseInt(this.userData.uid), this.campaignData.idCampania, request);

    setTimeout(() => {
      this.loadingService.stop();

      if (!isDeleted) {
        this.toastService.warning('No se pudo desconfigurar al usuario');
        return;
      }

      this.userReporterSelected = null;
      this.checkUserReporter.setValue(false);
    }, 2000);
  }

  onCloseModalUserReporter() {
    if (!this.userReporterSelected) {
      this.checkUserReporter.setValue(false);
    }

    this.isOpenModalUserReporter = false;
  }
}
