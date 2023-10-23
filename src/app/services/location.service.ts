import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Platform } from '@ionic/angular';

import { environment } from '../../environments/environment';

import { AddressCollection, GoogleMapsGeocode } from '../shared/models/location.interface';

import { HttpService } from './http.service';
import { ToastAlertService } from './UI/toast-alert.service';

import {
  Geolocation, Position, PermissionStatus,
  GeolocationPermissionType, GeolocationPluginPermissions
} from '@capacitor/geolocation';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import {
  NativeGeocoder, NativeGeocoderResult,
  NativeGeocoderOptions
} from '@awesome-cordova-plugins/native-geocoder/ngx';

import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

declare var google;

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(
    private platform: Platform,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private nativeGeocoder: NativeGeocoder,
    private toastService: ToastAlertService,
    private httpService: HttpService
  ) { }

  async getGeoposition(): Promise<Position> {
    return new Promise(async (resolve, reject) => {
      const locationEnabled = await this.checkLocationEnabled();

      if (!locationEnabled) {
        this.toastService.warning('Active el GPS e intentelo nuevamente');
        return resolve(null);
      }

      const location: Position = await this.getCurrentPosition();

      if (!location || location.coords.latitude == undefined || location.coords.longitude == undefined) {
        this.toastService.danger('Ocurrio un error al obtener la ubicación, salga al exterior y vuelve a intentarlo');
        return resolve(null);
      }

      resolve(location);
    });
  }

  async getCurrentAddress(latitude, longitude): Promise<AddressCollection> {
    let result: AddressCollection = null;

    const params = new HttpParams()
      .set('latlng', `${latitude},${longitude}`)
      .set('key', environment.APIKEY_MAPS)

    this.httpService.setExternalUri('https://maps.googleapis.com/maps/api/geocode/json');

    return this.httpService.getWithParams(params).pipe(
      map((response: GoogleMapsGeocode) => {
        if (response.results != undefined && response.results.length > 0) {
          result = {
            address: response.results[0].formatted_address,
            latitude: response.results[0].geometry.location.lat.toString(),
            longitude: response.results[0].geometry.location.lng.toString(),
            postal_code: response.results[0].address_components.filter(x => x.types.some(y => y == 'postal_code')).map(z => z.long_name)[0]
          }

          return result;
        }

        return result;
      }),
      catchError(error => {
        return of(result);
      })
    ).toPromise();
  }

  getGeopositionDistance(geoposition1: AddressCollection, geoposition2: AddressCollection): Promise<number> {
    return new Promise((resolve, reject) => {
      const distancePosition: number = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng({
          lat: parseFloat(geoposition1.latitude),
          lng: parseFloat(geoposition1.longitude)
        }),
        new google.maps.LatLng({
          lat: parseFloat(geoposition2.latitude),
          lng: parseFloat(geoposition2.longitude)
        }));

      // resultado en metros
      resolve(distancePosition);
    });
  }

  // Others services
  validateStatusPermission(status: PermissionStatus): boolean {
    if (status.location == 'granted') {
      return true;
    }
    return false;
  }

  checkGPSPermission(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (this.platform.is('android')) {
        await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
          .then(
            result => {
              if (result.hasPermission) {
                resolve(true);
              }
              else {
                resolve(false);
              }
            },
            error => {
              resolve(false);
            }
          );

        return;
      }

      if (this.platform.is('ios')) {
        await Geolocation.checkPermissions()
          .then(status => {
            const result = this.validateStatusPermission(status);
            resolve(result);
          })
          .catch(error => {
            console.log('Geolocation CheckPermissions Error', error);
            resolve(false);
          });
      }
    });
  }

  requestGPSPermission(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (this.platform.is('android')) {
        await this.locationAccuracy.canRequest()
          .then((canRequest: boolean) => {
            if (canRequest) {
              resolve(true);
            } else {
              this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                .then((result) => {
                  if (result.hasPermission) {
                    resolve(true);
                  }
                  else {
                    resolve(false);
                  }
                }, error => {
                  resolve(false);
                })
            }
          });

        return;
      }

      if (this.platform.is('ios')) {
        const permissions: GeolocationPermissionType[] = ['location'];
        const permissionType: GeolocationPluginPermissions = { permissions }

        await Geolocation.requestPermissions(permissionType)
          .then(status => {
            const result = this.validateStatusPermission(status);
            resolve(result);
          })
          .catch(error => {
            console.log('Geolocation RequestPermissions Error', error);
            resolve(false);
          })
        return;
      }
    })
  }

  turnOnGPS(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const canRequestResult = await this.locationAccuracy.canRequest();
      if (!canRequestResult) {
        return resolve(false);
      }

      await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
        .then(
          () => {
            resolve(true);
          }, error => {
            console.log('LOCATION ACCURACY ERROR', error);
            resolve(false);
          }
        )
        .catch(error => {
          console.log('LOCATION ACCURACY ERROR CATCH', error);
          resolve(false);
        });
    });
  }

  getCurrentPosition(): Promise<Position> {
    return new Promise(async (resolve, reject) => {
      if (this.platform.is('android')) {
        const position = await Geolocation.getCurrentPosition();
        return resolve(position);
      }

      if (this.platform.is('ios')) {
        const options = { enableHighAccuracy: true };

        const id = await Geolocation.watchPosition(options, (position, error) => {
          Geolocation.clearWatch({ id });

          if (error) {
            return resolve(null);
          }

          resolve(position);
        })
      }
    });
  }

  async getLocationFromAddress(address: string): Promise<AddressCollection[]> {
    let addressCollection: AddressCollection[] = [];
    return await this.nativeGeocoder.forwardGeocode(address, this.options)
      .then((result: NativeGeocoderResult[]) => {
        if (result.length == 1) {
          const addressObject = this.generateAddress(result[0]);
          addressCollection.push(addressObject);
          return addressCollection;
        } else {
          result.forEach(item => {
            let addressObject = this.generateAddress(item);
            addressCollection.push(addressObject);
          });
          return addressCollection;
        }
      }, error => {
        return addressCollection;
      });
  }

  generateAddress(geocoderObject: NativeGeocoderResult): AddressCollection {
    let addressCollection: AddressCollection = null;

    if (geocoderObject.latitude == '' || geocoderObject.longitude == '') {
      return addressCollection;
    } else {
      let subThoroughfare = ((geocoderObject.subThoroughfare != '' && geocoderObject.thoroughfare != '') ? ` ${geocoderObject.subThoroughfare},` : '');
      let locality = (geocoderObject.locality != '' ? ` ${geocoderObject.locality},` : '');
      let postalCode = ((geocoderObject.postalCode != '' && geocoderObject.locality != '') ? ` ${geocoderObject.postalCode},` : '');
      let contryName = (geocoderObject.countryName != '' ? ` ${geocoderObject.countryName},` : '');

      return addressCollection = {
        address: `${geocoderObject.thoroughfare}${subThoroughfare}${locality}${postalCode}${contryName}`.slice(0, -1),
        latitude: geocoderObject.latitude,
        longitude: geocoderObject.longitude
      }
    }
  }

  checkLocationEnabled(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const checkPermission = await this.checkGPSPermission();

      if (!checkPermission) {
        const requestPermission = await this.requestGPSPermission();

        if (!requestPermission) {
          this.toastService.warning('Debe permitir el acceso a su ubicación para continuar');
          return resolve(false);
        }

        if (this.platform.is('android')) {
          const resultTurnOn = await this.turnOnGPS();
          return resolve(resultTurnOn);
        }

        return resolve(requestPermission);
      }

      if (this.platform.is('android')) {
        const resultTurnOn = await this.turnOnGPS();
        resolve(resultTurnOn);
        return;
      }

      resolve(checkPermission);
    });
  }
}
