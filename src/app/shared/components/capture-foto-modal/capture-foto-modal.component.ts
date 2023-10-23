import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CameraService } from 'src/app/services/UI/camera.service'; 
declare var window: any;

@Component({
  selector: 'app-capture-foto-modal',
  templateUrl: './capture-foto-modal.component.html',
  styleUrls: ['./capture-foto-modal.component.scss'],
})
export class CaptureFotoModalComponent implements OnInit {

  imageResult: string;
  imageConvert;
  constructor(
    private cameraService: CameraService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  async clickToTakePhoto() {
    this.imageResult= await this.cameraService.capturePhoto();
    if(this.imageResult){
      this.imageConvert = window.Ionic.WebView.convertFileSrc(this.imageResult);
    }
    console.log("IMAGE RESULT : ", this.imageResult)
  }

  aceptarBtn() {
    this.modalCtrl.dismiss({imageResult: this.imageResult});
  }

}
