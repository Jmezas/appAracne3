import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { IncidenciaText } from '../../constants/strings.constan';
import { EmitIncidenciaId } from '../../models/config.interface';
import { Incidencia } from '../../models/Incidencia.interface';

@Component({
  selector: 'app-item-incidence',
  templateUrl: './item-incidence.component.html',
  styleUrls: ['./item-incidence.component.scss'],
})
export class ItemIncidenceComponent implements OnInit {
  localData: Incidencia;
  @Input() set dataIncidence (data: Incidencia) {
    this.localData = data;
  }
  @Input() activeDelete: boolean = true;
  @Output() IncidenciaIdToDelete = new EventEmitter<EmitIncidenciaId>();

  constructor(
    private alertController: AlertController,
  ) { }

  ngOnInit() {}

  async confirmDeleteAlert() {
    const alert = await this.alertController.create({
      subHeader: IncidenciaText.ALERT_DELETE,
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
            this.IncidenciaIdToDelete.emit({
              remoteId: this.localData.IdIncidencia,
              localId: this.localData.IdLocal
            })
          },
        },
      ],
    });
    await alert.present();
  }
}
