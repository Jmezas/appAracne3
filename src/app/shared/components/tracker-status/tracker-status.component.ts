import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tracker-status',
  templateUrl: './tracker-status.component.html',
  styleUrls: ['./tracker-status.component.scss'],
})
export class TrackerStatusComponent implements OnInit {
  isTrackerActive: boolean = true;
  constructor() { }

  ngOnInit() {}

}
