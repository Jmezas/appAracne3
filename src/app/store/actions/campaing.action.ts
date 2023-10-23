import { createAction, props } from '@ngrx/store';
import { IItemCampaign, IResponseCampaignsAracne } from '../../shared/models/campaing.interface';

export const setAllCampaign = createAction('[Campaign] Set All Campaign', props<{ collection: Array<IResponseCampaignsAracne> }>());
export const setActiveCampaign = createAction('[Campaign] set active campaign', props<{ activeCampaign: IItemCampaign }>());
export const removeActiveCampaign = createAction('[Campaing] Remove active Campaing');
