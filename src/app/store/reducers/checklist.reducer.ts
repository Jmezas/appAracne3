import { createReducer, on } from '@ngrx/store';

import * as actions from '../actions/checklist.action';
import { ChecklistCollection, LogChecklistResponse } from '../../shared/models/checklist.interface';

export interface ChecklistState {
    logChecklist: LogChecklistResponse[],
    isChecklistAttach: boolean,
    checklistSelected: ChecklistCollection
}

export const checklistState: ChecklistState = {
    logChecklist: [],
    isChecklistAttach: false,
    checklistSelected: null
}

const _checklistReducer = createReducer(checklistState,
    on(actions.saveLogChecklist, (state, { log }) => ({
        ...state,
        logChecklist: addObjectToObjectOfState(state.logChecklist, log, 'IdEncuesta')
    })),
    on(actions.clearLogChecklist, state => ({
        ...state,
        logChecklist: []
    })),
    on(actions.isChecklistAttached, (state, { isChecklistAttach }) => ({
        ...state,
        isChecklistAttach: isChecklistAttach
    })),
    on(actions.selectedChecklist, (state, { selected }) => ({
        ...state,
        checklistSelected: selected
    }))
); 

const addObjectToObjectOfState = (objectState: Array<any>, newObject: any, filtered: any): Array<any> => {
    const objectFilterState: Array<any> = objectState.filter(x => x[filtered] != newObject[filtered]);
    const newObjectState: Array<any> = [...objectFilterState, newObject];
    return newObjectState;
}

export const checklistReducer = (state, action) => _checklistReducer(state, action);
