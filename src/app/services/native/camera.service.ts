import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActionPhoto } from '../../shared/constants/values.constants';
import { FileDataObject } from '../../shared/models/fileData.interface';
import {
  Camera, CameraPermissionType, CameraPluginPermissions,
  CameraResultType, CameraSource, PermissionStatus, Photo
} from '@capacitor/camera';
@Injectable({
  providedIn: 'root'
})
export class CameraService {
  constructor(
    private alertCtrl: AlertController
  ) { }
  onSelectSourceType(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: 'Seleccione un tipo de fuente',
        inputs: [
          {
            type: 'radio',
            label: 'Cámara',
            handler: () => {
              this.alertCtrl.dismiss();
              resolve(ActionPhoto.camera)
            }
          },
          {
            type: 'radio',
            label: 'Galería',
            handler: () => {
              this.alertCtrl.dismiss();
              resolve(ActionPhoto.gallery)
            }
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'purple',
            handler: () => {
              resolve(null);
            }
          }
        ],
        backdropDismiss: false
      });
      alert.present();
    });
  }
  validStatusPermission(typeSource: ActionPhoto): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const status: PermissionStatus = await Camera.checkPermissions();
      const result: boolean = ((typeSource === ActionPhoto.camera && status.camera === 'granted') ? true :
        ((typeSource === ActionPhoto.gallery && (status.photos === 'granted' || status.photos === 'limited')) ? true : false));
      resolve(result);
    });
  }
  requestPermission(typeSource: ActionPhoto): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const permissionType: CameraPermissionType[] = (typeSource === ActionPhoto.camera ? ['camera'] : ['photos']);
      const plugPermission: CameraPluginPermissions = { permissions: permissionType };
      await Camera.requestPermissions(plugPermission);
      const result: boolean = await this.validStatusPermission(typeSource);
      resolve(result);
    });
  }
  onPhotoSourceApply(typeSource: ActionPhoto): Promise<Photo> {
    return Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: (typeSource === ActionPhoto.camera ? CameraSource.Camera : CameraSource.Photos)
    });
  }
  validAndResizeImage(webPath: string, name: string, mimeType: string): Promise<FileDataObject> {
    return new Promise((resolve, reject) => {
      const img: HTMLImageElement = new Image();
      img.src = webPath;
      img.onload = async () => {
        const width = img.width;
        const height = img.height;
        
        const orientation = width > height ? 'horizontal' : 'vertical';

        const numeratorProp: number = (orientation === 'vertical' ? 3 : 4);
        const denominatorProp: number = (orientation === 'vertical' ? 4 : 3);
        // Vertical --> Change apply to height 
        // Horizontal --> Change apply to Width 
        const newWidth: number = (width === height ? width :
          (orientation === 'horizontal' ? Math.round((numeratorProp * height) / denominatorProp) : width));
        const newHeight: number = (height === width ? height :
          (orientation === 'vertical' ? Math.round((denominatorProp * width) / numeratorProp) : height));

        const imageData: FileDataObject = await this.resizeImage(webPath, mimeType, newWidth, newHeight)
          .then((resultImage: Blob) => {
            const result: FileDataObject = {
              file: resultImage,
              fileName: name,
              fileType: mimeType
            };
            return result;
          });
        resolve(imageData);
      };
    });
  }
  async resizeImage(path: string, mimeType: string, newWidth: number, newHeight: number): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      let img = new Image();
      img.src = path;
      img.onload = async function (e) {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        let snapshotCtx = canvas.getContext("2d");
        snapshotCtx.drawImage(img, 0, 0, newWidth, newHeight);
        canvas.toBlob(blob => {
          const newBlob = (blob ? blob : null);
          resolve(newBlob);
        }, mimeType);
      }
    });
  }
}