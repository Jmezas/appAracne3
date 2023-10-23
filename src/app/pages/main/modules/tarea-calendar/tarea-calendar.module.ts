import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { IonicModule } from '@ionic/angular';

import { TareaCalendarPageRoutingModule } from './tarea-calendar-routing.module';
import { SharedModule } from '../../../../shared/shared.module';

import { TareaCalendarPage } from './tarea-calendar.page';

import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TareaCalendarPageRoutingModule,
    SharedModule,
    CalendarModule,
    ScrollingModule,
  ],
  declarations: [
    TareaCalendarPage
  ]
})
export class TareaCalendarPageModule { }
