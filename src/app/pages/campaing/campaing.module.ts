import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaingPageRoutingModule } from './campaing-routing.module';

import { CampaingPage } from './campaing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampaingPageRoutingModule
  ],
  declarations: [CampaingPage]
})
export class CampaingPageModule {}
