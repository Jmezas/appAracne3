import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashComponent } from './components/splash/splash.component';
import { IonicModule } from '@ionic/angular';
import { ListSelectComponent } from './components/list-select/list-select.component';
import { SelectComponent } from './components/select/select.component';
import { TimeSelectComponent } from './components/time-select/time-select.component';
import { DateSelectComponent } from './components/date-select/date-select.component';
import { HeaderModulesComponent } from './components/header-modules/header-modules.component';
import { ChartPieComponent } from './components/chart-pie/chart-pie.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartBarsComponent } from './components/chart-bars/chart-bars.component';
import { MapsComponent } from './components/maps/maps.component';
import { ListCheckboxComponent } from './components/list-checkbox/list-checkbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConnectionStatusComponent } from './components/connection-status/connection-status.component';
import { ContentOfflineComponent } from './components/content-offline/content-offline.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ItemCardOfflineComponent } from './components/item-card-offline/item-card-offline.component';
import { BtnSearchComponent } from './components/btn-search/btn-search.component';
import { TrackerStatusComponent } from './components/tracker-status/tracker-status.component';
import { CaptureFotoModalComponent } from './components/capture-foto-modal/capture-foto-modal.component';
import { ItemExhibicionComponent } from './components/item-exhibicion/item-exhibicion.component';
import { ItemReporteVentaComponent } from './components/item-reporte-venta/item-reporte-venta.component';
import { ShowImageModalComponent } from './components/show-image-modal/show-image-modal.component';
import { ViewMessageComponent } from './components/view-message/view-message.component';
import { ItemIncidenceComponent } from './components/item-incidence/item-incidence.component';
import { MatIconModule } from '@angular/material/icon';
import { ItemAsistenciaComponent } from './components/item-asistencia/item-asistencia.component';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  declarations: [
    BtnSearchComponent,
    SplashComponent,
    ListSelectComponent,
    SelectComponent,
    TimeSelectComponent,
    DateSelectComponent,
    HeaderModulesComponent,
    ChartPieComponent,
    ChartBarsComponent,
    HeaderModulesComponent,
    MapsComponent,
    ListCheckboxComponent,
    ConnectionStatusComponent,
    ContentOfflineComponent,
    ItemCardOfflineComponent,
    TrackerStatusComponent,
    CaptureFotoModalComponent,
    ItemExhibicionComponent,
    ItemIncidenceComponent,
    ItemReporteVentaComponent,
    ShowImageModalComponent,
    ViewMessageComponent,
    ItemAsistenciaComponent
  ],
  exports: [
    BtnSearchComponent,
    SplashComponent,
    ListSelectComponent,
    SelectComponent,
    TimeSelectComponent,
    DateSelectComponent,
    HeaderModulesComponent,
    ChartPieComponent,
    ChartBarsComponent,
    HeaderModulesComponent,
    MapsComponent,
    ListCheckboxComponent,
    ConnectionStatusComponent,
    ContentOfflineComponent,
    ItemCardOfflineComponent,
    TrackerStatusComponent,
    CaptureFotoModalComponent,
    ItemExhibicionComponent,
    ItemIncidenceComponent,
    ItemReporteVentaComponent,
    ShowImageModalComponent,
    ViewMessageComponent,
    ItemAsistenciaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    IonicModule.forRoot({
      platform: {
        /** The default `desktop` function returns false for devices with a touchscreen.
         * This is not always wanted, so this function tests the User Agent instead.
         **/
        desktop: (win) => {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(win.navigator.userAgent);
          return !isMobile;
        }
      },
    }),
    CalendarModule,
    NgChartsModule,
    MatTabsModule
  ],
  providers: []
})
export class SharedModule { }
