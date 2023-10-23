import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthServiceStore } from '../../services/STORE/auth.store.service';
import { CampaingService } from '../../services/STORE/campaing.store.service';
import { ModalService } from '../../services/UI/modal.service';
import { CampaingServiceAPI } from '../../services/API/campaing.api.service';
import { JwtService } from '../../services/UTILS/jwt.service';
import { InternetConnectionService } from '../../services/internet-connection.service';

import { IItemCampaign, IResponseCampaignsAracne } from '../../shared/models/campaing.interface';
import { IUserAuth } from '../../shared/models/user.interface';
import { clearSubscriptions, storeSubscriptions } from '../../shared/utils/subscriptions.utils';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-campaing',
  templateUrl: './campaing.page.html',
  styleUrls: ['./campaing.page.scss'],
})
export class CampaingPage implements OnInit, OnDestroy {
  loading: boolean = false;
  process_campaign: string = '';
  responseCampaings: Array<IResponseCampaignsAracne> = [];
  enterAnimation: any;
  leaveAnimation: any;
  returnIcon: string = 'assets/svg/return.svg';
  isModalCampaignOpen: boolean = false;
  modalCampaignLogo: string = '';
  modalCampaignList: Array<IItemCampaign> = [];
  subscriptions: Array<Subscription> = [];
  menuSubscription: Subscription;
  authSubscription: Subscription;

  constructor(
    private authStore: AuthServiceStore,
    private campaingService: CampaingService,
    private camapingAPI: CampaingServiceAPI,
    private jwtService: JwtService,
    private modalService: ModalService,
    private router: Router,
    private internetConnection: InternetConnectionService
  ) { }

  ngOnInit() { }

  ionViewWillEnter(): void {
    this.enterAnimation = this.modalService.enterAnimation;
    this.leaveAnimation = this.modalService.leaveAnimation;
    this.getAllCampaings();
  }

  ngOnDestroy(): void {
    clearSubscriptions(this.subscriptions);
  }

  async getAllCampaings() {
    this.loading = true;
    this.process_campaign = 'Iniciando';

    const { uid: userId } = (await this.authStore.getActiveUser()) as IUserAuth;
    const conn = await this.internetConnection.getNetWorkStatus();

    // Flujo offline
    if (!conn.connected) {
      // Obtener la lista de campañas locales;
      await this.campaingService.getLocalListCampaigns()
        .then(response => { this.settingCampaign(response, true); })
        .catch(error => {
          this.responseCampaings = [];
          this.loading = false;
        });
    } else {
      // Flujo online 
      const subscriptionTemp = this.camapingAPI.apiGetEmployeeCampaingsAracne(userId).subscribe(
        response => { this.settingCampaign(response, false); },
        error => {
          this.responseCampaings = [];
          this.loading = false;
        }
      );

      storeSubscriptions(this.subscriptions, subscriptionTemp);
    }
  }

  async settingCampaign(campaigns: Array<IResponseCampaignsAracne>, isOffline: boolean) {
    // Seteamos las campañas y validamos si tiene activo alguna campaña, utilidad para setear la campaña cuando regresa del segundo plano
    this.responseCampaings = campaigns.map(x => ({ ...x, logo: (x.tipoAracne == 'Aracne3' ? 'assets/svg/aracne3_vertical.svg' : 'assets/svg/aracne2_logo.svg') }));

    if (!isOffline) {
      this.campaingService.setListCampaings(this.responseCampaings);
    }

    const activeCampaign: IItemCampaign = await this.campaingService.getActiveCampaing();

    if (activeCampaign != null && campaigns.some(x => x.campaniasList.some(y => y.idCampania === activeCampaign.idCampania))) {
      this.selectCampaing(activeCampaign.idCampania);
      return;
    }

    setTimeout(() => { this.process_campaign = 'Cargando campañas'; }, 500);
    setTimeout(() => { this.loading = false; }, 1500);
  }

  async eventSelectCampaing(event: any) {
    const campaignId = event.detail.value;
    const campaignList = this.responseCampaings.filter(x => x.campaniasList.some(s => s.idCampania == campaignId))[0];
    const activeCampaign = campaignList.campaniasList.filter(x => x.idCampania == campaignId)[0];
    const decodeToken = await this.jwtService.decodeToken(activeCampaign.tokenUserConfig);
    const activeCampaignSelected = { ...activeCampaign };

    activeCampaignSelected.decodeTokenUserConfig = decodeToken;
    activeCampaignSelected.decodeTokenUserConfig.isReporter = (
      (activeCampaignSelected.idLineaNegocio === 17 && (activeCampaignSelected.idRol === 1 || activeCampaignSelected.idRol === 3)) ? true : false
    );

    this.campaingService.setActiveCampaing(activeCampaignSelected);

    this.router.navigate(['/main']);

    // Detenemos el loader tambien en este punto para el caso de retorno del app en segundo plano y tenga activo una campaña
    setTimeout(() => { this.loading = false; }, 1000);
  }

  selectCampaing(campaignId: any) {
    this.isModalCampaignOpen = false;
    setTimeout(() => {
      const event = {
        detail: {
          value: campaignId
        }
      };

      this.eventSelectCampaing(event);
    }, 100);
  }

  onOpenModalCampaign(campaniasList: Array<IItemCampaign>) {
    this.modalCampaignLogo = this.responseCampaings.filter(x => x.campaniasList.some(s => s.idCampania == campaniasList[0].idCampania))[0].logo;
    this.modalCampaignList = [...campaniasList].sort((a, b) => a.paisCampania.toLowerCase() > b.paisCampania.toLowerCase() ? 1 : -1);
    this.isModalCampaignOpen = true;
  }

  onCloseModalCampaign() {
    this.isModalCampaignOpen = false;
  }

  async eventCloseSession() {
    await this.authStore.closeSession();
  }
}
