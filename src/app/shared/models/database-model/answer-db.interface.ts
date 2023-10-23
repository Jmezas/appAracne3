export interface AnswerImageDb {
    answerImageDbId?: number, 
    logChecklistDbId: number,
    checklistId: number,
    questionPartId: string, 
    campaignName: string,
    imagePath: string
} 

export interface AnswerDb {
    answerDbId?: number,
    logChecklistDbId: number, 
    checklistId: number,
    questionId: number,
    answer: string,
    weightingValue: number,
    answerImage: string,
    userId: number,
    campaignId: number
}

export interface AnswerImageDbSyncResponse {
    success: boolean,
    questionPartId: string,
    imagePath: string,
    logChecklistDbId?: number, 
    checklistId?: number
}

export interface AnswerDbSyncRequest {
    answerDbId: number,
    logChecklistDbId: number, 
    checklistId: number,
    questionId: number,
    answer: string,
    weightingValue: number,
    answerImage: string,
    userId: number,
    campaignId: number,
    logChecklistId?: number
}

export interface AnswerDbSyncResponse {
    success: boolean
}