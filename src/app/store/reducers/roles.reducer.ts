import { createReducer, on } from '@ngrx/store';
import { IRolesState } from 'src/app/shared/models/roles.interface';
import { setMasterRoles } from '../actions/roles.action';

export const initialState: IRolesState = {
    rolesItems: null
};


const _rolesReducer = createReducer(initialState,
    on( setMasterRoles, (state, { rolesItems }) => ({ ...state, rolesItems: [...rolesItems]}) )
);

export const rolesReducer = (state, action) => _rolesReducer(state, action);
