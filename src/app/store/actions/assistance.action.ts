import { createAction, props } from '@ngrx/store';

import { IRequestWorkDay } from '../../shared/models/jornada.interface';
import { CalendarAssistance } from '../../shared/models/assistance.interface';

export const setLaborAssistance = createAction(
    '[Assistance] Set Labor Assistance',
    props<{ laborAssistance: IRequestWorkDay }>()
);

export const unsetLaborAssistance = createAction(
    '[Assistance] Unset Labor Assistance'
); 

export const setCalendarAssistance = createAction(
    '[Assistance] Set Calendar Assistance',
    props<{ calendarAssistance: CalendarAssistance }>()
);
export const unSetCalendarAssistance = createAction(
    '[Assitance] UnSet Calendar Assitance'
);