import { IResponseItemAvailableReportPV, IResponseItemSalePoint, IResponseItemSalePointReport, IResponsePVsInformeAsistencia } from '../models/salePoint.interface';
import { IListSelectGeneric, ISelectGeneric } from '../models/UI.interface';
import { IItemUserResponse } from '../models/user.interface';
import { distanceBetweenLocations } from './maps.util';

export const reduceArrayDataToSelectData = (data: Array<any>, idKey: string, valueKey: string): Array<ISelectGeneric> => {
    return data.map((item: any) => ({
        id: item[idKey],
        value: item[valueKey]
    }))
}

export const reduceUserResponseToSelectData = (data: Array<IItemUserResponse> ): Array<IListSelectGeneric> => {
    return data.map((item: IItemUserResponse) => ({
        id: `${item.IdUsuario}`,
        value: item.Nombre_Completo,
        subTitle: item.Rol,
        image: 'assets/images/user-image.png'
    }));
};

export const reduceSalePointResponseToSelectData = (data: Array<IResponseItemSalePoint>): Array<IListSelectGeneric> => {
    return data.map((item: IResponseItemSalePoint) => ({
        id: item.IDPV,
        value: item.NombreCentro,
        subTitle: item.Direccion,
    }))
}

export const reduceAvailableSalePointResponseToSelectData = (data: Array<IResponseItemAvailableReportPV>): Array<IListSelectGeneric> => {
    return data.map((item: IResponseItemAvailableReportPV) => ({
        id: `${item.IDPV}`,
        value: item.NombreCentro,
        subTitle: `${item.IDPV}`,
        mapperData: item
    }))
}

export const reduceSalePointReportResponseToSelectData = (data: Array<IResponseItemSalePointReport>, position: {coords: {latitude: any , longitude: any}}): Array<IListSelectGeneric> => {
    return data.map((item: IResponseItemSalePointReport) => {
        const isInRange = distanceBetweenLocations({lat: parseFloat(item.Latitud),lon: parseFloat(item.Longitud)}, {lat: position.coords.latitude, lon: position.coords.longitude}) <item.Distancia;
        return {
        id: item.IDPV,
        value: item.Punto_Venta,
        subTitle: `Tipo: ${item['Tipo Jornada']}`,
        subTitle2: `Geo: ${buildGeoTitle(isInRange, false)}`, //item.error
        // image: 'assets/icon/info.png',
        configIcon: buildConfigIcon( item , isInRange),
        mapperData: item,
        enable: isInRange
    }})
}

export const reduceSalePointAssistanceReportToSelecData = (data: Array<IResponsePVsInformeAsistencia>) : Array<IListSelectGeneric> => {
    return data.map((item: IResponsePVsInformeAsistencia) => ({
        id: `${item.IDPV}`,
        value: item['Punto de Venta'],
        subTitle: item.Direccion,
        image: 'assets/icon/PV_pin_informeAsistencia.png',
        mapperData: item
    }))
}


export const reduceCampaingsToSelectData = (data: Array<any>) :Array<ISelectGeneric> => {
return;
}


const buildConfigIcon = ( item : IResponseItemSalePointReport, itemEnable: boolean) => {
    if(item.Estado != null){
        switch(item.Estado) {
            case 'No Reportado': return {color: itemEnable ? 'secondary' : 'danger', icon: 'information-circle'};
            case 'Reportado' : return {color: 'success', icon: 'information-circle'}
        }
    }
    return null;
} 

const buildGeoTitle = (isInRange, isError) => {
    return isInRange ? 'En Rango' : (isError ? 'Error coordenadas PV' : 'Fuera de Rango') 
}
