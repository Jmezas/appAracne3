import { ActionReducerMap } from '@ngrx/store';
import * as AUTH from './reducers/auth.reduce';
import * as SPLASH from './reducers/splash.reducer';
import * as SIDEMENU from './reducers/menu.reducer';
import * as CAMPAING from './reducers/campaing.reducer';
import * as ROLES from './reducers/roles.reducer';
import { IMenuState } from '../shared/models/menu.interface';
import * as ASSISTANCE from './reducers/assistance.reducer';
import * as CHECKLIST from './reducers/checklist.reducer';
import * as ROUTERNAV from './reducers/router-navigate.reducer';
import * as SALESPOINT from './reducers/salespoint.reducer';
import * as FORM from './reducers/form.reducer';
import * as JORNADA from './reducers/jornada.reduce';
import { IRolesState } from '../shared/models/roles.interface';

export interface AppState {
   auth: AUTH.State;
   splash: SPLASH.State;
   sideMenu: SIDEMENU.MenuState;
   campaing: CAMPAING.State;
   rolesMaster: IRolesState;
   assistance: ASSISTANCE.AssistanceState;
   checklist: CHECKLIST.ChecklistState;
   routernav: ROUTERNAV.RouterNavigateState;
   salespoint: SALESPOINT.SalespointState;
   form: FORM.FormState;
   jornada: JORNADA.State;
}

export const appReducers: ActionReducerMap<AppState> = {
   auth: AUTH.activeUserReducer,
   splash: SPLASH.splashReducer,
   sideMenu: SIDEMENU.menuReducer,
   campaing: CAMPAING.campaingReducer,
   rolesMaster: ROLES.rolesReducer,
   assistance: ASSISTANCE.assistanceReducer,
   checklist: CHECKLIST.checklistReducer,
   routernav: ROUTERNAV.routerNavigateReducer,
   salespoint: SALESPOINT.salespointReducer,
   jornada: JORNADA.jornadaReducer,
   form: FORM.formReducer
};
