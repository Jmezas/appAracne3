import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('./modules/tarea-main/tarea-main.module').then( m => m.TareaMainPageModule)
      },
      {
        path: 'notificacion',
        loadChildren: () => import('./modules/tarea-notification/tarea-notification.module').then( m => m.TareaNotificationPageModule)
      },
      {
        path: 'calendario',
        loadChildren: () => import('./modules/tarea-calendar/tarea-calendar.module').then( m => m.TareaCalendarPageModule)
      },
      {
        path: 'asistencia',
        loadChildren: () => import('./modules/tarea-assistance/tarea-assistance.module').then( m => m.TareaAssistancePageModule)
      },
      {
        path: 'tarea-list',
        loadChildren: () => import('./modules/tarea-list/tarea-list.module').then( m => m.TareaListPageModule)
      },
      {
        path: 'tarea-form',
        loadChildren: () => import('./modules/tarea-form/tarea-form.module').then( m => m.TareaFormPageModule)
      },
      {
        path: 'configuracion',
        loadChildren: () => import('./modules/tarea-config/tarea-config.module').then( m => m.TareaConfigPageModule)
      },
      
      {
        path: 'sincronizacion',
        loadChildren: () => import('./modules/tarea-sync/tarea-sync.module').then( m => m.TareaSyncPageModule)
      }
    ]
  },
    
  {
    path: 'tracker-gps',
    loadChildren: () => import('./modules/tracker-gps/tracker-gps.module').then( m => m.TrackerGPSPageModule)
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }
