import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TareaListPage } from './tarea-list.page';

const routes: Routes = [
  {
    path: '',
    component: TareaListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TareaListPageRoutingModule {}
