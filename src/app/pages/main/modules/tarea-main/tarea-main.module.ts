import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TareaMainPageRoutingModule } from './tarea-main-routing.module';
import { SharedModule } from '../../../../shared/shared.module';

import { TareaMainPage } from './tarea-main.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TareaMainPageRoutingModule,
    SharedModule,
    ScrollingModule
  ],
  declarations: [TareaMainPage]
})
export class TareaMainPageModule {}
