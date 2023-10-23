import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { PermissionService } from '../permissions.service';
import { DeviceService } from '../UTILS/device.service';

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

const REQUEST_CAMERA_PERMISSION = 'CAMERA';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  public photos: UserPhoto[] = [];
  options: CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.CAMERA,
    saveToPhotoAlbum: true
  };

  ORIGIN_CAMERA = this.camera.PictureSourceType.CAMERA;
  ORIGIN_LIBRARY = this.camera.PictureSourceType.PHOTOLIBRARY;


  constructor(
    private camera: Camera,
    private deviceService: DeviceService,
    private permissionService: PermissionService
    ) {}

  public capturePhoto(): Promise<string>{
    if(!this.deviceService.isPlatformMobile()){
      return null
    }
    return this.camera.getPicture(this.options).then(
      (imageData) => {
        return  imageData;
      },
      (err) => {
        console.error('ERROR CAPTURANDO IMAGEN : ', err);
        return null;
      }
    );
  }

  capturePhotoFromOrigin(origin: number ): Promise<string> {
    if(!this.deviceService.isPlatformMobile()){
      return null
    }
    const newOptions = {...this.options, sourceType: origin == 0 ? this.ORIGIN_CAMERA : this.ORIGIN_LIBRARY}
    return this.camera.getPicture(newOptions).then(
      (imageData) => {
        return  imageData;
      },
      (err) => {
        console.error('ERROR CAPTURANDO IMAGEN : ', err);
        return null;
      }
    );
  }
}
