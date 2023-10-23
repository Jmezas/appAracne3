import { createAction, props } from '@ngrx/store';
import { IResponseCampaignsRolesPA } from 'src/app/shared/models/roles.interface';

export const setMasterRoles = createAction('[Roles] Set master Roles', props<{rolesItems: Array<IResponseCampaignsRolesPA>}> ());