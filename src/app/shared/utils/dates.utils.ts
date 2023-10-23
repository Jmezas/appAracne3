import * as moment from 'moment';
const formatDate = 'DD/MM/YYYY';

export const getListDatesBetweenTwoDates = (startDate:string, endDate:string) => {
    let dates: Array<string> = [];
    const nStartDate = moment(startDate, formatDate),
        nEndDate = moment(endDate, formatDate);
    let nowDate = nStartDate.clone();

    while (nowDate.isSameOrBefore(nEndDate)) {
        dates.push(nowDate.format(formatDate));
        nowDate.add(1, 'days');
    }
    return dates;
}

export const convertStringUnixToDate = (dateUnix: string) => {
    let dateTransform = dateUnix.replace(/\//g,'');
    return moment(dateTransform).zone('+02:00').format("DD/MM/YYYY");;
}

export const getCurrentDate = (format = 'DD/MM/YYYY LT') => {
    return moment().format(format)
}

export const getDateServer = (campaignId: string): string => {
    return "convert(date,SWITCHOFFSET(SYSDATETIMEOFFSET(),(SELECT ZonaHoraria FROM ARACNE2.DBO.M_Campañas WHERE IdCampaña = "+campaignId+")))";
}

export const getDatetimeServer = (campaignId: string): string => {
    return "convert(datetime,SWITCHOFFSET(SYSDATETIMEOFFSET(),(SELECT ZonaHoraria FROM ARACNE2.DBO.M_Campañas WHERE IdCampaña = "+campaignId+")))";
}


export const isTimeAndTimeZoneAutomatic = (): boolean => {  // Investigar si en ionic es viable
    return true
}

export const getOnlyHour = (date: string, format: string): string => {
    return moment(date, format).format("hh:mm a")
}

export const getOnlyHourFromUnix = (dateUnix: string) => {
    let dateTransform = dateUnix.replace(/\//g,'');
    return moment(dateTransform).zone('-05:00').format("hh:mm a");;
} 