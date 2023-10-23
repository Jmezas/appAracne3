import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-time-select',
  templateUrl: './time-select.component.html',
  styleUrls: ['./time-select.component.scss'],
})

export class TimeSelectComponent implements OnInit {
  @Input() id: string;
  @Input() label: string;
  @Input() set valueSelected (value: string) {
    if(value != null && value != "") {
      //Agregar codigo si es que se necesita inicializar el componente
    }else {
      this.timeSelected = value;
    }
  }
  @Output() selectResult = new EventEmitter<string>();

  timeSelected: string;

  constructor(
  ) { }

  ngOnInit() {}

  eventSelectItem($event) {
    this.timeSelected = moment($event.detail.value).format('HH:mm:ss');
    this.selectResult.emit(this.timeSelected);
  }
}
