import { Component, OnInit } from '@angular/core';

import { APP_NAME } from 'src/app/shared/constants/strings.constan';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  APP_NAME = APP_NAME;
  constructor() { }

  ngOnInit() { }

  eventAcceptPolicy() {
    window.history.back();
  }
}
