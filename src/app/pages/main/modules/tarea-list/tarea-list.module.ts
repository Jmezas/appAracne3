import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../../shared/shared.module';
import { TareaListPageRoutingModule } from './tarea-list-routing.module';

import { TareaListPage } from './tarea-list.page';
import { FormListComponent } from './components/form-list/form-list.component';
import { FormKpiComponent } from './components/form-kpi/form-kpi.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TareaListPageRoutingModule,
    SharedModule
  ],
  declarations: [
    TareaListPage,
    FormListComponent,
    FormKpiComponent
  ]
})
export class TareaListPageModule {}
