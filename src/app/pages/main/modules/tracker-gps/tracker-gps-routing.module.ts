import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackerGPSPage } from './tracker-gps.page';

const routes: Routes = [
  {
    path: '',
    component: TrackerGPSPage
  },
  {
    path: 'registrar-pv',
    loadChildren: () => import('./modules/registrar-pv/registrar-pv.module').then( m => m.RegistrarPvPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackerGPSPageRoutingModule {}
