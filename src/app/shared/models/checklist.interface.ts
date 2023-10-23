export interface LogChecklistRequest {
        checklistId: number,
        userId: number,
        accessCounter: number,
        lastAccessDate: string,
        date: string,
        completePercent: number,
        notes: string,
        recordDate: string,
        timing?: string,
        userSelection: number,
        salespointSelection?: number
}

export interface LogChecklistResponse {
        IdLogEncuestaLocalDb?: number,
        IdLogEncuestaUsuario?: number,
        IdEncuesta?: number,
        Encuesta?: string,
        IdUsuario?: number,
        ContadorAccesos?: number,
        FechaUltimoAcceso?: string,
        Fecha?: string,
        PorcentajeRealizacion?: number,
        Nota?: number,
        FechaGrabacion?: string,
        IdUsuarioSeleccion?: number,
        IDPVSeleccion?: number,
        Tiempo?: string
}

export interface AnswerChecklistRequest {
        questionId: number, 
        logUserChecklistId: number, 
        answer: string, 
        markvalue: number, 
        filePhotoPath: string,
        userId: number,
        campaignId: number,
        assistanceId?: number
}

export interface ImageChecklistRequest {
        logUserChecklistId: number,
        checklistId: number,
        questionImagePartId: string,
        campaignName: string,
        actionPath: string,
        imagePath: any,
        imageBase64?: string
}

export interface ImageChecklistResponse {
        success: boolean;
        questionImagePartId: string;
        imagePath?: string;
        imageBase64?: string
} 

export interface ChecklistResponse {
        success: boolean;
}

export interface ChecklistCollection {
        IdEncuesta: number,
        IdCampaña: number,
        TituloChecklist: string,
        NroPreguntas: number,
        Introduccion: string,
        Despedida: string,
        FechaCreacion?: string
}

export interface QuestionAnswersChecklist {
        IdPregunta: number,
        IdEncuesta: number,
        TipoPregunta: string,
        TituloBloque: string,
        Pregunta: string,
        Orden: number,
        Obligatoria: boolean,
        Activo: boolean,
        IdTipoPregunta: number,
        IdBloqueEncuesta: number,
        DescripcionBloque: string,
        Imagen: number,
        RutaImagen: string,
        IdCampania: number,
        Campania: string,
        OrdenBloque: number,
        CantImgRespuesta: number,
        Respuestas?: string,
        RespuestaImagen?: string,
        QuestionValues?: QuestionChecklistValue[],
        ImageCollection?: ImageCollection[]
}

export interface QuestionChecklistValue {
        IdValorPregunta: number,
        IdPregunta: number,
        Valor: string,
        PonderacionValor: number,
        Activo: boolean,
        Seleccion?: boolean
}

export interface ImageCollection {
        controlImageId: string,
        image: string,
        imageData: any
}

export interface ChecklistHistory {
        IdEncuesta: number, 
        IdCampaña: number, 
        'Título CheckList': string, 
        Introduccion: string, 
        Despedida: string, 
        Programada: number, 
        FechaInicioEncuesta: Date, 
        FechaFinEncuesta: Date, 
        Activo: number,
        'Fecha Modificación': string, 
        'Usuario Creación': string, 
        'Fecha Creación': string,
        'Nº Preguntas': number 
        IdUsuario: number  
}