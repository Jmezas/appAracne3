import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TareaCalendarPage } from './tarea-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: TareaCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TareaCalendarPageRoutingModule {}
