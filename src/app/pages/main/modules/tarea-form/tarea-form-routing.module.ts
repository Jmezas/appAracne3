import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TareaFormPage } from './tarea-form.page';

const routes: Routes = [
  {
    path: '',
    component: TareaFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TareaFormPageRoutingModule {}
