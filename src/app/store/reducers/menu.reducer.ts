import { createReducer, on } from '@ngrx/store';
import { IMenuItem } from 'src/app/shared/models/menu.interface';
import { populateMenuAction, tapMenuSelectedAction, setMainRouteBackAction, unsetMainRouteBackAction, selectedModule } from '../actions/menu.action';

export interface MenuState {
    menuItems: Array<IMenuItem>,
    selectedModule: IMenuItem,
    tabMenuSelected: number,
    tabRouterBack: number
}

export const initialState: MenuState = {
    menuItems: null,
    selectedModule: null,
    tabMenuSelected: 0,
    tabRouterBack: 0
};

const _menuReducer = createReducer(initialState,
    on(populateMenuAction, (state, { menuItems }) => ({ ...state, menuItems: [...menuItems] })),
    on(selectedModule, (state, { selectedModule }) => ({ ...state, selectedModule: selectedModule })),
    on(tapMenuSelectedAction, (state, { indexTab }) => ({ ...state, tabMenuSelected: indexTab })),
    on(setMainRouteBackAction, (state, { routerBackId }) => ({ ...state, tabRouterBack: routerBackId })),
    on(unsetMainRouteBackAction, (state) => ({ ...state, tabRouterBack: 0 }))
);

export const menuReducer = (state, action) => _menuReducer(state, action);
