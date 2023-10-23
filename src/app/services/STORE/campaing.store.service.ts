import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import * as campaingAction from '../../store/actions/campaing.action';

import { HttpService } from '../http.service';
import { GenericStoreService } from './store.service';
import { IItemCampaign, IResponseCampaignsAracne } from '../../shared/models/campaing.interface';

const campaignKey: string = 'Active_campaign';
const listCampaignsKey: string = 'List_Campaigns';

@Injectable({
  providedIn: 'root',
})
export class CampaingService {
  currentCampaign: IItemCampaign = null;

  constructor(
    private store: Store<AppState>,
    private httpService: HttpService,
    private storeService: GenericStoreService
  ) {
    this.loadCampaign();
  }

  async loadCampaign() {
    this.currentCampaign = await this.getActiveCampaing();
  }

  setActiveCampaing(activeCampaign: IItemCampaign) {
    this.currentCampaign = activeCampaign;

    const fn = campaingAction.setActiveCampaign;
    this.httpService.setActiveCampaign(activeCampaign);
    this.storeService.setLocalData(fn, { activeCampaign }, campaignKey);
  }

  async getActiveCampaing() {
    let activeCampaign: IItemCampaign;

    const campaingSubscription = await this.store.select('campaing').subscribe(campaing => activeCampaign = campaing.activeCampaign);

    if (!activeCampaign) {
      activeCampaign = await this.storeService.getLocalData(campaingAction.setActiveCampaign, { activeCampaign }, campaignKey);
    }

    setTimeout(() => { campaingSubscription.unsubscribe(); }, 250);

    return activeCampaign;
  }

  setListCampaings(responseCampaings: Array<IResponseCampaignsAracne>) {
    const fn = campaingAction.setAllCampaign;

    this.storeService.setLocalData(fn, { collection: responseCampaings }, listCampaignsKey);
  }

  async getLocalListCampaigns() {
    let listCampaigns: Array<IResponseCampaignsAracne>;

    await this.store.select('campaing').subscribe(campaing => listCampaigns = campaing.campaignCollection);

    if (!listCampaigns || listCampaigns.length === 0) {
      listCampaigns = await this.storeService.getLocalData(campaingAction.setAllCampaign, { collection: listCampaigns }, listCampaignsKey);
    }

    return listCampaigns;
  }
}
