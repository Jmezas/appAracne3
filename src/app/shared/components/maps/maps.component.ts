import { Component, Input, OnInit } from '@angular/core';
import { IMarkerMap } from '../../models/map.interface';
declare var google;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {
  _lsMarkers: Array<IMarkerMap> = [];
  @Input() set lsMarkers(markers: Array<IMarkerMap>) {
    if(markers && markers.length>0) {
      console.log("MY markers : ", markers);
      this._lsMarkers = markers;
      this.renderMarkers(markers);
    }
  }
  @Input() set myPosition(position: IMarkerMap) {
    if (position) {
      this.renderMarkers(new Array(position));
    }
  }
  @Input() isContentModal: boolean = false;

  map = null;

  constructor() { }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create LatLng object
    const myLatLng = { lat: 4.670306, lng: -74.056786 };
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 14
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.renderMarkers(this._lsMarkers);
      mapEle.classList.add('show-map');
    });
    console.log('DISTANCE ; ', google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng('-12.1859614,-76.9770514'), new google.maps.LatLng('-12.184600,-76.975589')));

  }

  /** FUNCION: Crea Markers a partir de la lista que llega del INPUT */
  renderMarkers(lsMarkers: Array<IMarkerMap>) {
    lsMarkers.forEach((marker: IMarkerMap) => {
      this.buildMarker(marker)
    })
  }

  /** FUNCION: Crea un marker completo con infowindow */
  buildMarker(markerData: IMarkerMap) {
    const newInfoWindow = this.initInfoWindow(markerData.infoWindow);
    const marker = this.initNewMarker(markerData);
    this.setInfoWindowsToMarker(marker, newInfoWindow)
  }

  /** Crear nueva ventana INFOWINDOW */
  initInfoWindow(contentString: string) {
    return new google.maps.InfoWindow({
      content: contentString
    })
  }

  /** Crear nuevo MARKER */
  initNewMarker(marker: IMarkerMap) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title,
      icon: {
        url: marker.IconMarker, // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
      }
    })
  }

  /** Emparejar MARKER con INFOWINDOW */
  setInfoWindowsToMarker(marker, infowindow) {
    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map: this.map,
        shouldFocus: false,
      });
    });
  }
}
