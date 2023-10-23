import { createAction, props } from '@ngrx/store';
import { IMenuItem } from 'src/app/shared/models/menu.interface';

export const populateMenuAction = createAction(
    '[UI Component] LoadMenu',
    props<{menuItems: Array<IMenuItem>}> ()
);
export const selectedModule = createAction(
    '[UI Component] Select module from menu',
    props<{selectedModule: IMenuItem}> ()
);
export const tapMenuSelectedAction = createAction(
    '[UI Tab Menu] Selected Menu',
    props<{ indexTab: number }>()
);
export const setMainRouteBackAction = createAction(
    '[UI Tab Menu] Set Router Back Navigation',
    props<{ routerBackId: number }>()
);
export const unsetMainRouteBackAction= createAction(
    '[UI Tab Menu] Unset Router Back Navigation'
);