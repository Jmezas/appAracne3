import { createAction, props } from "@ngrx/store";

import { ChecklistCollection, LogChecklistResponse } from '../../shared/models/checklist.interface';

export const saveLogChecklist = createAction(
    '[Checklist] Save Log Checklist',
    props<{ log: LogChecklistResponse }>()
);
export const clearLogChecklist = createAction(
    '[Checklist] Clear Log Checklist'
);
export const isChecklistAttached = createAction(
    '[Checklist] Is Checklist Attached',
    props<{ isChecklistAttach: boolean }>()
);
export const selectedChecklist = createAction(
    '[Checklist] Checklist Selected',
    props<{ selected: ChecklistCollection }>()
);