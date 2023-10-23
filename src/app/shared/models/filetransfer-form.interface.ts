export interface FileTransferForm {
    filePath: string,
    fileName: string,
    fileKey: string,
    dataMerged?: any
}

export interface FileWriteData {
    identifer?: number|string;
    fileBlob?: Blob;
}

export interface FileWritePathResponse {
    identifer?: number;
    filePath: string;
}