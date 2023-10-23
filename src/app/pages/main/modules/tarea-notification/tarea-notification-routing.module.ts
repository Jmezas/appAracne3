import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TareaNotificationPage } from './tarea-notification.page';

const routes: Routes = [
  {
    path: '',
    component: TareaNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TareaNotificationPageRoutingModule {}
