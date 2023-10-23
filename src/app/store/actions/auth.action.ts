import { createAction, props } from '@ngrx/store';

import { User } from 'src/app/shared/models/user.model';
import { IUserToken } from '../../shared/models/user.interface';

export const setActiveUser = createAction(
    '[Auth] Set User',
    props<{ user: User }>()
);
export const unsetActiveUser = createAction('[Auth] Unset User');

export const setActiveToken = createAction(
    '[Auth] Set Token',
    props<{ userToken: IUserToken }>()
);
export const unsetActiveToken = createAction('[Auth] Unset Token');

