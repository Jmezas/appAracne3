import { colorSyncStatusEdited, colorSyncStatusOffline, colorSyncStatusSynced } from '../constants/colors.constant';

export const getSyncColor = (idLocal: string, idServer: string) => {
    let color: string =  colorSyncStatusSynced;
    if(idLocal !== ('')){
        if(idServer !== (''))
            {color = colorSyncStatusEdited;}
        else
            {color = colorSyncStatusOffline;}
    }
    return color;
};
