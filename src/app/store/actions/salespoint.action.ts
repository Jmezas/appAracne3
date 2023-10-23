import { createAction, props } from '@ngrx/store';
import { PdvsJornada } from '../../shared/models/jornada.interface';

export const setSalespointSelected = createAction(
    '[Salespoint] Set Salespoint Of Work',
    props<{ salespointSelected: PdvsJornada }>()
);
export const clearSalespointSelected = createAction(
    '[Salespoint] Clear Salespoint Of Work'
);

export const setSalespointChecklist = createAction(
    '[Salespoint] Set PDV Checklist',
    props<{ idSalespointChecklist: number }>()
);