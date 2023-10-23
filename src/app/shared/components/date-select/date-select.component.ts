import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar';
import * as moment from 'moment';

@Component({
  selector: 'app-date-select',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.scss'],
})
export class DateSelectComponent implements OnInit {
  @Input() id: string;
  @Input() set placeholder(val: string) { this.placeholderInput = (val == null || val.trim() == '' ? undefined : val); }
  // @Input() placeholder: string;
  @Input() label: string;
  @Input() isRange = false;
  @Input() set valueSelected(value: string) {
    if (value != null && value != "") {
      // this.dateSelected 
    } else {
      this.dateSelected = value;
    }
  }
  @Output() selectResult = new EventEmitter<any>();

  placeholderInput: string = undefined;

  startDate: string;
  endDate: string;
  type: 'string';
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
    color: 'dark'
  };

  dateSelected: string;
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  onChange($event) {
    console.log($event);
    this.startDate = moment($event.from).format('DD/MM/YYYY');
    if (this.isRange) {
      this.endDate = moment($event.to).format('DD/MM/YYYY');
    }

    // else {
    //   this.startDate = moment($event).format('DD/MM/YYYY');
    //   console.log('EVENTO CALENDARio : ', $event);
    // }
    // this.modalCtrl.dismiss();
  }

  cancelEvent() {
    this.selectResult.emit(null);
    this.dateSelected = '';
    this.modalCtrl.dismiss();
  }

  acceptEvent() {
    this.dateSelected = null;
    if (this.isRange) {
      this.dateSelected = this.validateDatesRange();
      if (!this.dateSelected) {
        return;
      }
      this.selectResult.emit({
        startDate: this.startDate,
        endDate: this.endDate
      });

    } else {
      this.dateSelected = `${this.startDate}`;
      this.selectResult.emit({
        startDate: this.startDate
      });
    }
    this.modalCtrl.dismiss();
  }

  validateDatesRange(): string {
    let resultDateString = "";
    if (this.startDate && this.endDate) {
      if (this.startDate == this.endDate) {
        resultDateString = `${this.startDate}`;
      } else {
        resultDateString = `${this.startDate} - ${this.endDate}`;
      }
    } else {
      resultDateString = null;
    }

    return resultDateString;
  }
}
