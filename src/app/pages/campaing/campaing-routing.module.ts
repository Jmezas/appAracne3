import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaingPage } from './campaing.page';

const routes: Routes = [
  {
    path: '',
    component: CampaingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaingPageRoutingModule {}
