import { createAction, props } from '@ngrx/store';

export const setRouterNavigate = createAction(
    '[Router Nav] Set Routes',
    props<{ initRouter?: string, intermediaRouter?: string, finalRouter?: string }>()
);