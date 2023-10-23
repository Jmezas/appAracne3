import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BackgroundRunner } from '@capacitor/background-runner';
import { Position } from '@capacitor/geolocation';
import { AlertService } from 'src/app/services/UI/alert.service';
import { LoadingService } from 'src/app/services/UI/loading.service';
import { DeviceService } from 'src/app/services/UTILS/device.service';
import { ExternalLibraryService } from 'src/app/services/external-library.service';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { LocationService } from 'src/app/services/location.service';
import { IMarkerMap } from 'src/app/shared/models/map.interface';
declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  // @ViewChild('assistanceStartMap', { read: ElementRef, static: false }) mapElement: ElementRef;
  @ViewChild('assistanceMap', { read: ElementRef, static: false }) mapElement: ElementRef;
  @Input() collections: Array<IMarkerMap> = [];

  isLoading: boolean = false;
  isWithoutMap: boolean = false;
  sad_face: string = 'assets/svg/sad_face.svg';
  map = null;
  infoWindow = null;
  keeperMarkers: any = {};
  isEnabledNotPull: boolean = false;
  constructor(
    private internetService: InternetConnectionService,
    private locationService: LocationService,
    private externalLibraryService: ExternalLibraryService,
    private deviceService: DeviceService,
    private alertService: AlertService,
    private loadingService: LoadingService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.collections.currentValue.length > 0) {
      this.initMap();
     // this.loadCheckins();
    }
  }

  ngOnInit() {
    // this.initMap()
  }
  ngOnDestroy(): void {
    this.map = null;
  }

  async initMap() {
    this.isLoading = true;

    const connection = await this.internetService.getNetWorkStatus();
    if (!connection.connected) {
      this.isWithoutMap = true;
      return;
    }

    const position = await this.preparedCoords();
    if (position == null) {
      this.alertService.showAlert('not_geolocation.svg', 'Sin señal GPS', 'No se pudo cargar la información de coordenadas.');
      return;
    }

    this.isWithoutMap = false;
    // create a new map by passing HTMLElement
    const mapElement: HTMLElement = document.getElementById('assistanceMap');
    // create LatLng object
    const centerPosition = {
      lat: position.latitude,
      lng: position.longitude
    };

    try {
      // create map
      this.map = new google.maps.Map(mapElement, {
        center: centerPosition,
        zoom: 12,
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeControl: false
      });

      this.infoWindow = new google.maps.InfoWindow();

      this.map.addListener('click', () => {
        if (this.infoWindow) {
          this.infoWindow.close();
        }
      });

      let markers: Array<IMarkerMap> = [];

      this.collections.forEach(item => {
        markers.push({
          position: {
            lat: parseFloat(item.position.lat as string),
            lng: parseFloat(item.position.lng as string),
          },
          title: item.title,
          infoWindow: `<p style="margin: unset !important;"><strong>${item.title}</strong></p><br><p style="margin: unset !important;">${item.infoWindow}</p>`
        })
      });

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        if (markers.length > 0) {
          this.renderMarkers(markers);
        }

        mapElement.classList.add('show-map');
      });

      // disabled scrolling refresh when map drag
      google.maps.event.addListener(this.map, 'dragstart', () => {
        this.isEnabledNotPull = true;
      });

      google.maps.event.addListener(this.map, 'dragend', () => {
        this.isEnabledNotPull = false;
      });

      this.markerMyPosition();
      this.isLoading = false;
    } catch (error) {
      console.log('ERROR GOOGLE MAPS MapComponent', error);
      this.externalLibraryService.loadGoogleMaps();
      setTimeout(() => { this.initMap(); this.isLoading = false; this.loadingService.stop(); }, 500);
    }
  }

  async preparedCoords(): Promise<{ latitude: number, longitude: number }> {
    return new Promise(async (resolve, reject) => {
      if (this.collections.length == 0) {
        if (this.deviceService.isPlatformMobile()) {
          const geopositionPromise: Position = await this.locationService.getGeoposition();

          if (geopositionPromise != null) {
            resolve({
              latitude: geopositionPromise.coords.latitude,
              longitude: geopositionPromise.coords.longitude
            });
          } else {
            resolve(null);
          }
        } else {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            });
          }
        }
      } else {
        resolve({
          latitude: parseFloat(this.collections[0].position.lat as string),
          longitude: parseFloat(this.collections[0].position.lng as string)
        })
      }
    });
  }

  renderMarkers(markers: Array<IMarkerMap>) {
    markers.forEach(marker => {
      this.addMarker(marker);
    });
  }
  addMarker(marker: IMarkerMap) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title,
      draggable: false,
      animation: google.maps.Animation.DROP
    });
  }
  markerMyPosition() {
    const ionButton = document.createElement('ion-button');
    const ionIcon = document.createElement('ion-icon');
    ionIcon.name = 'locate-outline';
    ionIcon.slot = 'icon-only';
    ionButton.color = 'light';
    ionButton.append(ionIcon);

    this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(ionButton);

    ionButton.addEventListener('click', async () => {
      const position: Position = await this.locationService.getGeoposition();

      if (position != null) {
        if (this.keeperMarkers['myPosition']) {
          this.keeperMarkers['myPosition'].setMap(null);
        }

        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const myPosition = new google.maps.Marker({
          id: 'myPosition',
          position: pos,
          icon: 'assets/svg/person_mark.svg',
          map: this.map
        });

        this.keeperMarkers['myPosition'] = myPosition;
        this.map.setZoom(14);
        this.map.setCenter(pos);

        return;
      }

      this.handleLocationError(true, this.infoWindow, this.map.getCenter()!);
    });
  }
  handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: any,
    pos: any
  ) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(this.map);
  }

  /*pruebas!!! */
  checkins: any[] = [];
  loadCheckIn = async () => {
    console.log('checkin inciar.........');
    const mapElement: HTMLElement = document.getElementById('assistanceMap');
    console.log('checkin inciar.........',mapElement);
  
    const result = await BackgroundRunner.dispatchEvent({
      label: 'com.aracnereport.aracne3.check',
      event: 'checkIn',
      details: {},
    });
    console.log('my result 1', result);
  }
  loadCheckins = async () => {
    console.log('loadCheckins inciar.........');
    const mapElement: HTMLElement = document.getElementById('assistanceMap');
    console.log('loadCheckins inciar.........',mapElement);
    const result = await BackgroundRunner.dispatchEvent({
      label: 'com.aracnereport.aracne3.check',
      event: 'loadCheckins',
      details: {},
    }); 
    console.log('my result 2', result);
    
  };
}
