import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TareaFormPageRoutingModule } from './tarea-form-routing.module';
import { SharedModule } from '../../../../shared/shared.module';

import { TareaFormPage } from './tarea-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TareaFormPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [TareaFormPage]
})
export class TareaFormPageModule {}
