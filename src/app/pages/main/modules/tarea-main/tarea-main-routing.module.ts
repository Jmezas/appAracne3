import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TareaMainPage } from './tarea-main.page';

const routes: Routes = [
  {
    path: '',
    component: TareaMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TareaMainPageRoutingModule {}
