import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackerGPSPageRoutingModule } from './tracker-gps-routing.module';

import { TrackerGPSPage } from './tracker-gps.page';
import { SharedModule } from 'src/app/shared/shared.module';

import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackerGPSPageRoutingModule,
    SharedModule,
    MatMenuModule,
    MatIconModule
  ],
  declarations: [TrackerGPSPage]
})
export class TrackerGPSPageModule {}
