import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

interface dataOffline {
  [key: string]: string
}

@Component({
  selector: 'app-content-offline',
  templateUrl: './content-offline.component.html',
  styleUrls: ['./content-offline.component.scss'],
})
export class ContentOfflineComponent implements OnInit {
  lsDataPending: Array<dataOffline>  = [
    {
      'Fecha': '12/12/12',
      'PDV': 'PROBADNO',
      'Tipo Jornada': 'Jornada Completa'
    },
    {
      'Fecha': '12/12/12',
      'PDV': 'PROBADNO',
      'Tipo Jornada': 'Jornada Completa'
    },
    {
      'Fecha': '12/12/12',
      'PDV': 'PROBADNO',
      'Tipo Jornada': 'Jornada Completa'
    },
    {
      'Fecha': '12/12/12',
      'PDV': 'PROBADNO',
      'Tipo Jornada': 'Jornada Completa'
    },
  ];
  lsDataError: Array<dataOffline> = [
    {
      fecha: '13/12/12',
      PDV: 'PROBADNO',
      tipo_Jornada: 'Jornada Completa'
    },
    {
      fecha: '14/12/12',
      PDV: 'PROBADNO',
      tipo_Jornada: 'Jornada Completa'
    },
    {
      fecha: '15/12/12',
      PDV: 'PROBADNO',
      tipo_Jornada: 'Jornada Completa'
    },
    {
      fecha: '16/12/12',
      PDV: 'PROBADNO',
      tipo_Jornada: 'Jornada Completa'
    },
  ];

  selected = new FormControl(0);

  constructor() { }

  ngOnInit() {}

  eventErrorItem() {
    console.log("Enviar dato!");
    
  }

}
