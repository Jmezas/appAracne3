import { createReducer, on } from '@ngrx/store';

import { setActiveUser, unsetActiveUser, setActiveToken, unsetActiveToken } from '../actions/auth.action'; 

import { User } from 'src/app/shared/models/user.model';
import { IUserToken } from '../../shared/models/user.interface';

export interface State {
    user: User;
    token: IUserToken;
}

export const initialState: State = {
    user: null,
    token: null
};

const _activeUserReducer = createReducer(initialState,
    on(setActiveUser, (state, { user }) => ({ ...state, user: { ...user } })),
    on(unsetActiveUser, (state) => ({ ...state, user: null })),
    on(setActiveToken, (state, { userToken }) => ({ ...state, token: { ...userToken } })),
    on(unsetActiveToken, (state) => ({ ...state, token: null }))
);

export const activeUserReducer = (state, action) => _activeUserReducer(state, action);
