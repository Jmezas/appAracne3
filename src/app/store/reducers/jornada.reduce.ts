import { createReducer, on } from '@ngrx/store';
import { JornadaPVModel } from 'src/app/shared/models/jornada.interface';
import { setActiveJornada, removeActiveJornada} from '../actions/jornada.action';

export interface State {
    selectedJornada: JornadaPVModel
}

export const initialState: State = {
    selectedJornada: null
};

const _jornadaReducer = createReducer(initialState,
    on(setActiveJornada, (state, { selectedJornada }) => ({ ...state, selectedJornada })),
    on(removeActiveJornada, state => ({ ...state, selectedJornada: null })),
);

export const jornadaReducer = (state, action) => _jornadaReducer(state, action);
