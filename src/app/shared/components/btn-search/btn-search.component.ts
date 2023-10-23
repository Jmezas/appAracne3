import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IListSelectGeneric } from '../../models/UI.interface';

@Component({
  selector: 'app-btn-search',
  templateUrl: './btn-search.component.html',
  styleUrls: ['./btn-search.component.scss'],
})
export class BtnSearchComponent implements OnInit {
  @Input() searchLabel = 'Buscar...';
  @Input() set data(data: Array<IListSelectGeneric>) {
		this._dataResult = this._data = data ?  data : [];
	};

  @Output() listResult = new EventEmitter<Array<IListSelectGeneric>>();

  _dataResult: Array<IListSelectGeneric>;
  isOpenSearch = false;
  _data: Array<IListSelectGeneric>;

  constructor() { }

  ngOnInit() {}

  onSearchChange($event) {
    this._data  =  this._dataResult.filter( (item: IListSelectGeneric) => item.value.toLowerCase().includes($event.detail.value.toLowerCase()));
    this.listResult.emit(this._data);
  }

  expandSearchBar() {
    this.isOpenSearch = true;
  }

  onCancel(event) {
    this.isOpenSearch = false;
  }
}
