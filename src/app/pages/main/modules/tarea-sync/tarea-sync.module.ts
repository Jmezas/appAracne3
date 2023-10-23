import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TareaSyncPageRoutingModule } from './tarea-sync-routing.module';

import { TareaSyncPage } from './tarea-sync.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TareaSyncPageRoutingModule
  ],
  declarations: [TareaSyncPage]
})
export class TareaSyncPageModule {}
