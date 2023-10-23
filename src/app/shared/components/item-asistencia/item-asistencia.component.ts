import { Component, Input, OnInit } from '@angular/core';
import { AsistenciaDBModel } from '../../models/asistencia.interface';
import { getOnlyHour } from '../../utils/dates.utils';

@Component({
  selector: 'app-item-asistencia',
  templateUrl: './item-asistencia.component.html',
  styleUrls: ['./item-asistencia.component.scss'],
})
export class ItemAsistenciaComponent implements OnInit {
  localData: AsistenciaDBModel;
  onlyHour: string;
  @Input() set dataAsistencia (data: AsistenciaDBModel) {
    this.localData = data;
    this.onlyHour = getOnlyHour(data.FechaHoraIni, 'DD/MM/YYYY hh:mm:ss a');
  }
  constructor() { }

  ngOnInit() {
    
  }

}
