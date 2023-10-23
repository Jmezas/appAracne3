export interface IMarkerMap {
  position: IMarkerCoord
  title: string;
  infoWindow?: string;
  IconMarker?: string
}

export interface IMarkerCoord {
  lat: (number | string);
  lng: (number | string);
}