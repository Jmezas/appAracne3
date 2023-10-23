import { createReducer, on } from '@ngrx/store';
import { IItemCampaign, IResponseCampaignsAracne } from '../../shared/models/campaing.interface';
import { setActiveCampaign, removeActiveCampaign, setAllCampaign } from '../actions/campaing.action';

export interface State {
    campaignCollection: Array<IResponseCampaignsAracne>;
    activeCampaign: IItemCampaign;
}

export const initialState: State = {
    campaignCollection: [],
    activeCampaign: null
};

const _campaingReducer = createReducer(initialState,
    on(setAllCampaign, (state, { collection}) => ({ ...state, campaignCollection: collection})),
    on(setActiveCampaign, (state, { activeCampaign }) => ({ ...state, activeCampaign })),
    on(removeActiveCampaign, state => ({ ...state, activeCampaign: null })),
);

export const campaingReducer = (state, action) => _campaingReducer(state, action);
