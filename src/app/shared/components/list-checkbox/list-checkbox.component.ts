import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-list-checkbox',
  templateUrl: './list-checkbox.component.html',
  styleUrls: ['./list-checkbox.component.scss'],
})
export class ListCheckboxComponent implements OnInit {

  @Input() type: 'BUTTON' | 'TEXTBOX' = 'TEXTBOX';
  @Input() textTypeButton = 'ASIGNAR';
  @Input() id: string;
  @Input() set placeholder(val: string) { this.placeholderInput = (val == null || val.trim() == '' ? undefined : val); }
  // @Input() placeholder: string;
  @Input() label: string;
  @Input() titleModal: string;
  @Input() fullScreen: boolean;
  @Input() set valueSelected(values: Array<any>) {
    if (values != null && values.length > 0) {

    } else {
      this.itemSelected = null;
    }
  }
  @Output() itemsChecked = new EventEmitter<string | Array<any>>();

  placeholderInput: string = undefined;

  _data: Array<any>;
  listSelected: Array<any> = [];

  public itemSelected = '';
  public checkboxForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController
  ) { }

  @Input() set data(listData: Array<any>) {
    this._data = listData ? listData : [];

  };

  ngOnInit() {
    this.initCheckboxForm();
  }

  initCheckboxForm() {
    this.checkboxForm = this.formBuilder.group({
      checkboxArrayList: this.formBuilder.array([], [Validators.required])
    });
  }


  eventCloseModal() {
    this.modalCtrl.dismiss();
  }

  updateCheckControl(cal, o) {
    if (o.checked) {
      cal.push(new FormControl(o.value));
    } else {
      cal.controls.forEach((item: FormControl, index) => {
        if (item.value == o.value) {
          cal.removeAt(index);
          return;
        }
      });
    }
  }

  // onLoadCheckboxStatus() {
  //   const checkboxArrayList: FormArray = this.checkboxForm.get('checkboxArrayList') as FormArray;
  //   this._data.forEach(o => {
  //     this.updateCheckControl(checkboxArrayList, o);
  //   })
  // }

  onSelectionChange(e, i) {
    const checkboxArrayList: FormArray = this.checkboxForm.get('checkboxArrayList') as FormArray;
    this._data[i].checked = e.target.checked;
    this.updateCheckControl(checkboxArrayList, e.target);
  }

  submitForm() {
    if (this.checkboxForm.invalid) {
      console.log('Please provide all the required values!');
      return false;
    }

    console.log('VALUES : ', this.checkboxForm.value);

    this.itemSelected = this._data.filter(item => item.checked).map(item => item.value).join(', ');
    this.itemsChecked.emit(this.checkboxForm.get('checkboxArrayList').value);
    this.eventCloseModal();
  }

  onSearchChange($event) {

  }
}
