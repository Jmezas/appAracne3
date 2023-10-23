import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TareaConfigPage } from './tarea-config.page';

const routes: Routes = [
  {
    path: '',
    component: TareaConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TareaConfigPageRoutingModule {}
