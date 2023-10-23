import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarea-notification',
  templateUrl: './tarea-notification.page.html',
  styleUrls: ['./tarea-notification.page.scss'],
})
export class TareaNotificationPage implements OnInit {
  notification_working: string = 'assets/svg/notification_working.svg'; 
  
  constructor() { }

  ngOnInit() {
  }

}
