import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISearchBarConfig } from '../../models/config.interface';
import { IListSelectGeneric } from '../../models/UI.interface';

@Component({
  selector: 'app-list-select',
  templateUrl: './list-select.component.html',
  styleUrls: ['./list-select.component.scss'],
})
export class ListSelectComponent implements OnInit {
  @Input() id: string;
  @Input() set placeholder(val: string) { this.placeholderInput = (val == null || val.trim() == '' ? undefined : val); }
  // @Input() placeholder: string;
  @Input() label: string;
  @Input() type: string;
  // @Input() multiple: boolean;
  @Input() messageNotData = '';
  @Input() initOpenModal = false;
  @Input() textButton = 'ACEPTAR';
  @Input() useAdditionalBtn = false;
  @Input() searchBarConfig: ISearchBarConfig;
  @Input() buttonsHeader: TemplateRef<any>;
  @Input() set data(data: Array<IListSelectGeneric>) {
		this._dataResult = this._data = data ?  data.map(item => ({...item, checked: false})) : [];
	};
  @Input() set valueSelected(value: string) {
    if(value != null && value != ""){
      let result = this._dataResult.find((item: IListSelectGeneric) => item.id == value);
      this.itemSelected = result.value
    }else {
      this.itemSelected = value;
    }
  }
  @Output() selectResult = new EventEmitter<string | Array<any>>();
  @Output() eventAdditionalButton = new EventEmitter<any>();

  placeholderInput: string = undefined;

  _dataResult: Array<IListSelectGeneric | any>;
  _data: Array<IListSelectGeneric | any>;

  itemSelected='';
  listSelected: Array<any> = [];

  textInputSearch: string = '';

  constructor(
    public modalCtrl: ModalController
  ) {
  }

  

  ngOnInit() {
  }

  eventSelectItem($value) {
    // if(!this.multiple){
      this.itemSelected = $value.value;
      this.selectResult.emit($value.id);
      this.eventCloseModal();
    // }else {
      // this.populateListSelected($value);
    // }
  }

  populateListSelected($value) {
    this.listSelected.push($value);
  }

  eventCloseModal(){
    this.modalCtrl.dismiss();
  }

  /** Escuchar el input de buscar */
  onSearchChange($event) {
    this._data  =  this._dataResult.filter(
      (item: IListSelectGeneric) => item.value.toLowerCase().includes($event.toLowerCase())
    );
  }

  /** Enviar la lista de items seleccionados (LISTA MULTIPLE) */
  eventEmitListSelected() {
    this.itemSelected = this.listSelected.map(item => item.value).join(', ');
    this.selectResult.emit(this.listSelected);
    this.eventCloseModal();
  }

  /** Eviar click en el boton adicional (la logica se desarrollara en el padre) */
  eventEmitClick() {
    this.eventAdditionalButton.emit();
    this.eventCloseModal();
  }

  onWillDismiss($event) {
    this.data = this._dataResult;
  }
}
