import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ISelectGeneric } from '../../models/UI.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input() data: Array<ISelectGeneric>;
  @Input() label: string;
  @Input() type: string;
  @Input() multiple = false;
  @Output() selectResult = new EventEmitter<string>();

  _valueSelected: string;

  constructor() { }

  @Input() set valueSelected(value: string) {
    this._valueSelected = value;
  }


  ngOnInit() {
  }

  eventSelectItem($value) {
    this.selectResult.emit($value.detail.value);
  }

}
