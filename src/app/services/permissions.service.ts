import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private uri: string;
  constructor(private androidPermissions: AndroidPermissions) { }

  async checkPermission(permission): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      // if (Capacitor.isNativePlatform) {
        this.androidPermissions.checkPermission(permission)
          .then(result => {
            if (result.hasPermission) {
              resolve(true);
            }
            else {
              resolve(false);
            }
          }, error => {
            resolve(false);
          })
      // } else {
      //   resolve(false);
      // }
    });
  }

  

  async requestPermission(permission): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      this.androidPermissions.requestPermission(permission)
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
    })
  }


  async validatePermission(permission) {
    const result = await this.checkPermission(permission);
    if(!result) {
      const requestPermission = await this.requestPermission(permission);
      console.log(`RESULT PERMISSION ${permission} : `, requestPermission);
      if(!requestPermission) {
        console.log("Debe otorgar permisos para utilizar ", permission)
      }
      return requestPermission;
    }
    return result;
  }


  async validateCameraPermission() {
    return await this.validatePermission(this.androidPermissions.PERMISSION.CAMERA)
  }

  async validateReadContactsPermission() {
    return await this.validatePermission(this.androidPermissions.PERMISSION.READ_CONTACTS)
  }

  async validateLocationPermission() {
    return await this.validatePermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
  }
}
