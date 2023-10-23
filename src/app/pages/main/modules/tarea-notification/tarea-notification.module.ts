import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TareaNotificationPageRoutingModule } from './tarea-notification-routing.module';

import { TareaNotificationPage } from './tarea-notification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TareaNotificationPageRoutingModule
  ],
  declarations: [TareaNotificationPage]
})
export class TareaNotificationPageModule {}
