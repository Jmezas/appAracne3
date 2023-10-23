import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { SyncStatus } from '../../constants/strings.constan';
import { EmitExhibicionId } from '../../models/config.interface';
import { Exhibicion } from '../../models/Exhibicion.interface';

@Component({
  selector: 'app-item-exhibicion',
  templateUrl: './item-exhibicion.component.html',
  styleUrls: ['./item-exhibicion.component.scss'],
})

export class ItemExhibicionComponent implements OnInit {
  localData: Exhibicion;
  @Input() set dataExhibition (data: Exhibicion) {
    this.localData = data;
    this.localData.FeCreacion
  }
  @Input() activeDelete: boolean = true;
  @Output() ExhibitionIdToDelete = new EventEmitter<EmitExhibicionId>();

  constructor(
    private alertController: AlertController
  ) { }

  ngOnInit() {}

  async confirmDeleteAlert() {
    const alert = await this.alertController.create({
      subHeader: '¿Está seguro de querer eliminar esta Exhibicion?',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          handler: () => {
            console.log("Solo cerrar el alert");
          },
        },
        {
          text: 'ACEPTAR',
          role: 'confirm',
          handler: () => {
            this.ExhibitionIdToDelete.emit({
              remoteId: this.localData.IdFoto, // this.localData.,
              localId: null // this.localData.IdLocal
            })
          },
        },
      ],
    });
    await alert.present();
  }

  classStatus(status: string){
    switch(status) {
      case SyncStatus.SYNC: return 'card-status-sync'
      case SyncStatus.INSERTED: return 'card-status-inserted'
    }
  }

}
