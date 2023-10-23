import { createReducer, on } from '@ngrx/store';
import { setRouterNavigate } from '../actions/router-navigate.actions';

export interface RouterNavigateState {
    initRouter?: string; 
    intermediaRouter?: string; 
    finalRouter?: string;
}

export const routerNavigateState: RouterNavigateState = {
    initRouter: null,
    intermediaRouter: null,
    finalRouter: null
}

const _routerNavigateReducer = createReducer(routerNavigateState, 
    on(setRouterNavigate, (state, { initRouter, intermediaRouter, finalRouter }) => ({
        ...state,
        initRouter,
        intermediaRouter, 
        finalRouter
    }))
);

export const routerNavigateReducer = (state, action) => _routerNavigateReducer(state, action);