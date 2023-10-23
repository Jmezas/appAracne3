import { createAction, props } from '@ngrx/store';
import { JornadaPVModel } from 'src/app/shared/models/jornada.interface';

export const setActiveJornada = createAction('[Jornadas] set active Jornadas', props<{ selectedJornada: JornadaPVModel }>())
export const removeActiveJornada = createAction('[Jornadas] Remove active Jornadas');