import { createAction, props } from '@ngrx/store';

import { FormularioJornada } from '../../shared/models/formulario-jornada';
import { FormularioNormal } from '../../shared/models/formulario';

export const formSelectedAction = createAction(
    '[Forms] Selected',
    props<{ formSelected: FormularioJornada | FormularioNormal, isWorkDayForm: boolean }>()
);
export const formUnSelectedAction = createAction(
    '[Forms] UnSelected'
);
export const formValidToCompleted = createAction(
    '[Forms] Valid to Completed',
    props<{ validForm: boolean }>()
);