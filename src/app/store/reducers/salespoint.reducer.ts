import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/salespoint.action';
import { PdvsJornada } from '../../shared/models/jornada.interface';

export interface SalespointState {
    salespointSelected: PdvsJornada,
    idSalespointChecklist: number
}

export const salespointState: SalespointState = {
    salespointSelected: null,
    idSalespointChecklist: 0
}

const _salespointReducer = createReducer(salespointState, 
    on(actions.setSalespointSelected, (state, { salespointSelected }) => ({ ...state, salespointSelected })),
    on(actions.clearSalespointSelected, (state) => ({ ...state, salespointSelected: null })),
    on(actions.setSalespointChecklist, (state, { idSalespointChecklist }) => ({
        ...state,
        idSalespointChecklist: idSalespointChecklist
    }))
);

export const salespointReducer = (state, action) => _salespointReducer(state, action);
