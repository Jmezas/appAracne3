import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarPvPage } from './registrar-pv.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarPvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarPvPageRoutingModule {}
