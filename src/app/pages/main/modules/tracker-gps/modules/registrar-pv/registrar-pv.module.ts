import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarPvPageRoutingModule } from './registrar-pv-routing.module';

import { RegistrarPvPage } from './registrar-pv.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarPvPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [RegistrarPvPage]
})
export class RegistrarPvPageModule {}
