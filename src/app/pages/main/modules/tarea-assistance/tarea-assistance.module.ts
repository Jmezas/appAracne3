import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TareaAssistancePageRoutingModule } from './tarea-assistance-routing.module';

import { TareaAssistancePage } from './tarea-assistance.page';
import { MapComponent } from './components/map/map.component';
import { FormListComponent } from './components/form-list/form-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TareaAssistancePageRoutingModule
  ],
  declarations: [
    TareaAssistancePage,
    MapComponent,
    FormListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TareaAssistancePageModule {}
