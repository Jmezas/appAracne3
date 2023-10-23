interface ICoords {
  lat: number,
  lon: number
}

export const createInfoWindowToReportsMap = (location:string, manager: string) => {
    return `<strong>${location}</strong><br>${manager}<br>`;
}

export const distanceBetweenLocations = (myLocation: ICoords, pvLocation: ICoords) => {
    let R = 6371; // km
    let dLat = toRadians(pvLocation.lat-myLocation.lat);
    let dLon = toRadians(pvLocation.lon-myLocation.lon);
    let myLat = toRadians(myLocation.lat);
    let pvLat = toRadians(pvLocation.lat);

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(myLat) * Math.cos(pvLat); 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c;
    console.log("DISTANCIA RESULTANTE : ", d);
    
    return d;
}

// Converts numeric degrees to radians
const toRadians = degrees => degrees * Math.PI / 180;