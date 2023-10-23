import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-card-offline',
  templateUrl: './item-card-offline.component.html',
  styleUrls: ['./item-card-offline.component.scss'],
})
export class ItemCardOfflineComponent implements OnInit {
  listLabels: Array<string>;
  _itemData: {[key: string]: string};
  @Input() set itemData (data: {[key: string]: string}) {
    if(data) {
      this.listLabels = Object.keys(data);
      this._itemData = data;
    }
  } 

  constructor() { }

  ngOnInit() {}

}
