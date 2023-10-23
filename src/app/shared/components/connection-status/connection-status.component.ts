import { Component, OnInit } from '@angular/core';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';

@Component({
  selector: 'app-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss'],
})
export class ConnectionStatusComponent implements OnInit {

  public isConnectedStatus= false;
  constructor(
    private internetConnectionService: InternetConnectionService,
  ) { }

  ngOnInit() {
    this.subscribeConnectionStatus();
  }

  subscribeConnectionStatus(){
    this.internetConnectionService.$isConnected.subscribe(
      isconnected => {
        this.isConnectedStatus = isconnected;
      }
    )
  }
}
