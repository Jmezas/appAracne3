import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TareaSyncPage } from './tarea-sync.page';

const routes: Routes = [
  {
    path: '',
    component: TareaSyncPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TareaSyncPageRoutingModule {}
