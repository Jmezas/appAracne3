import { createReducer, on } from '@ngrx/store';
import { stopSplash } from '../actions/splash.action';

export interface State {
    stopSplash: boolean;
}

export const initialState: State = {
    stopSplash: false,
};

const _splashReducer = createReducer(initialState,
    on( stopSplash, state => ({ ...state, stopSplash: true}) ),

);

export const  splashReducer = (state, action) => _splashReducer(state, action);
