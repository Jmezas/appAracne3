import { createReducer, on } from '@ngrx/store';
import { FormularioJornada } from '../../shared/models/formulario-jornada';
import { formSelectedAction, formUnSelectedAction, formValidToCompleted } from '../actions/form.action';
import { FormularioNormal } from '../../shared/models/formulario';

export interface FormState {
    formSelected: FormularioJornada | FormularioNormal,
    isWorkDayForm: boolean,
    validToCompleted: boolean
}

export const formInitalState: FormState = {
    formSelected: null,
    isWorkDayForm: false,
    validToCompleted: false
}

const _formReducer = createReducer(formInitalState, 
    on(formSelectedAction, (state, { formSelected, isWorkDayForm }) => ({ ...state, formSelected, isWorkDayForm })),
    on(formUnSelectedAction, (state) => ({ ...state, formSelected: null, isWorkDayForm: false })),
    on(formValidToCompleted, (state, { validForm }) => ({ ...state, validToCompleted: validForm }))
);

export const formReducer = (state, action) => _formReducer(state, action);