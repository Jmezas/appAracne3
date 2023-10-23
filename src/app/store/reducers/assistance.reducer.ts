import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/assistance.action';

import { IRequestWorkDay } from '../../shared/models/jornada.interface';
import { CalendarAssistance } from '../../shared/models/assistance.interface';

export interface AssistanceState {
    laborAssistance: Array<IRequestWorkDay>,
    calendarAssistance: Array<CalendarAssistance>
}

export const assistanceState: AssistanceState = {
    laborAssistance: [],
    calendarAssistance: []
}

const _assistanceReducer = createReducer(assistanceState,
    on(actions.setLaborAssistance, (state, { laborAssistance }) => ({
        ...state,
        laborAssistance: [...state.laborAssistance, laborAssistance]
    })),
    on(actions.unsetLaborAssistance, state => ({
        ...state,
        laborAssistance: []
    })),
    on(actions.setCalendarAssistance, (state, { calendarAssistance }) => ({
        ...state, 
        calendarAssistance: [...state.calendarAssistance, calendarAssistance]
    })),
    on(actions.unSetCalendarAssistance, (state) => ({
        ...state,
        calendarAssistance: []
    }))
);

export const assistanceReducer = (state, action) => _assistanceReducer(state, action);