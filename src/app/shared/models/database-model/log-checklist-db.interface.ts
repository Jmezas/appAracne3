export interface LogChecklistDb {
    logChecklistDbId: number,
    checklistId: number,
    userId: number,
    accessCounter: number,
    lastAccessDate: string,
    date: string,
    completedPercent: number,
    score?: number,
    recordDate: string,
    userSelectionId?: number,
    salespointSelectionId?: number,
    timing?: string
}

export interface LogChecklistDbSyncResponse {
    success: boolean,
    logChecklistDbId: number,
    logChecklistId?: number
}