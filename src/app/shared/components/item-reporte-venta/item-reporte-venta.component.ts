import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ReportModel } from '../../models/report.interface';

interface ProductModify {
  sales?: number,
  stock?: number,
  price?: number
}
@Component({
  selector: 'app-item-reporte-venta',
  templateUrl: './item-reporte-venta.component.html',
  styleUrls: ['./item-reporte-venta.component.scss'],
})
export class ItemReporteVentaComponent implements OnInit {
  @Input() dataReport: ReportModel;
  @Input() set collectData (indicator: boolean) {
    if(indicator===true) {

      this.dataModified.emit(this.validateifExistChange(this.dataProductModify));
    }
  };
  @Output() dataModified = new EventEmitter<ProductModify>();

  dataProductModify:ProductModify = {} 

  constructor(
    private alertController: AlertController
  ) { }

  ngOnInit() {}

  async openModalInputValue(titleAlert: string, placeholder: string, control: string, maxValue: number) {
    const alert = await this.alertController.create({
      header: titleAlert,
      cssClass: 'alert-aboradaje',
      inputs: [
        {
          type: 'number',
          name: 'captureNumber',
          placeholder: placeholder,
          min: 0,
          cssClass: 'input-item-reporte'
        },
      ],
      buttons: [
        {
          text: 'ACEPTAR',
          cssClass: 'btn-item-reporte  btn-block',
          handler: (data) => {
            this.dataProductModify[control] = data.captureNumber;
          },
        },
      ]
    });
    await alert.present();

    const inputRef:any = document.querySelector('.input-item-reporte');
    const btnAlertReport = document.querySelector('.btn-item-reporte');
    inputRef.setAttribute('maxlength', `${maxValue}`)
    btnAlertReport.setAttribute('disabled', 'true');
    inputRef.addEventListener('input', (evt) => {
      if(inputRef.value<=0 || inputRef.value>=maxValue) {
        btnAlertReport.setAttribute('disabled', 'true');
      }else {
        btnAlertReport.removeAttribute('disabled');
      }
    })
  }

  validateifExistChange(product: ProductModify) {
    return product && Object.keys(product).length>0 ? product : null;
  }

}
