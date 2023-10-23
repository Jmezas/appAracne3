import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import { tapMenuSelectedAction, unsetMainRouteBackAction } from '../../../../store/actions/menu.action';

import { AuthServiceStore } from '../../../../services/STORE/auth.store.service';
import { CampaingService } from '../../../../services/STORE/campaing.store.service';
import { LoadingService } from '../../../../services/UI/loading.service';
import { AsistenciaServiceAPI } from '../../../../services/API/asistencia.api.service';
import { JornadasService } from '../../../../services/API/jornadas.service';
import { LocationService } from '../../../../services/location.service';
import { InternetConnectionService } from '../../../../services/internet-connection.service';

import { IUserAuth, UserCampaign } from '../../../../shared/models/user.interface';
import { IItemCampaign } from '../../../../shared/models/campaing.interface';
import { IMarkerMap } from '../../../../shared/models/map.interface';
import { AddressCollection } from '../../../../shared/models/location.interface';
import { DataPdvRutaInsert, PdvRutaInsertRequest, PdvRutaLibre, PdvsJornada, Rutas } from '../../../../shared/models/jornada.interface';
import { AssistanceWorkResponse } from '../../../../shared/models/assistance.interface';
import { APP_CONFIG } from '../../../../shared/constants/values.constants';

import { TableFormService } from '../../../../services/database/table-form.service';
import { TableUserService } from '../../../../services/database/table-user.service';
import { TableWorkdayRouteService } from '../../../../services/database/table-workday-route.service';
import { TableWorkdayAssistanceService } from '../../../../services/database/table-workday-assistance.service';

import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { CalendarComponentOptions } from 'ion2-calendar';
import { IonSlides } from '@ionic/angular';
import { User } from 'src/app/shared/models/user.model';
import { Position } from '@capacitor/geolocation';
import { setSalespointSelected } from 'src/app/store/actions/salespoint.action';
import { AlertService } from 'src/app/services/UI/alert.service';
import { ExternalLibraryService } from 'src/app/services/external-library.service';
import { DeviceService } from 'src/app/services/UTILS/device.service';
import { ModalService } from 'src/app/services/UI/modal.service';
moment.locale('es');
declare var google;
@Component({
  selector: 'app-tarea-main',
  templateUrl: './tarea-main.page.html',
  styleUrls: ['./tarea-main.page.scss'],
})
export class TareaMainPage implements OnInit, OnDestroy {
  userId: number = 0;
  userName: string = '';
  userReporterConfig: UserCampaign = null;
  activeCampaign: IItemCampaign = null;
  reporter_by: string = 'assets/svg/theme_form.svg';
  notification_message: string = 'assets/svg/notification_message.svg';
  notification_without_message: string = 'assets/svg/notification_without_message.svg';
  notificationCounter: number = 3;
  workday_progress: string = '';
  workday_percent: number = 0;
  calendar: string = 'assets/svg/calendar.svg';

  isExistsWorkday: boolean = false;
  isExistsIncompletedForms: boolean = false;
  objetive_route: string = '';
  route: string = '';
  routes_percent: string = '';
  routes_percent_width: string = '';
  isBigger40percent: boolean = false;
  isRouteWorkday: boolean = false;

  lsDataMarkers: Array<IMarkerMap> = [];
  myPosition: IMarkerMap;
  campaignSubs: Subscription;


  @ViewChild('slideElement', { read: IonSlides }) slides: IonSlides;
  @ViewChild('calendarMaps', { read: ElementRef, static: false }) mapElement: ElementRef;

  userAuth: User = null;
  userReporterIcon: string = 'assets/svg/user.svg';
  startDayOfWork: string = moment().startOf('month').format('MM-DD-YYYY');
  endDayOfWork: string = moment().endOf('month').format('MM-DD-YYYY');
  moduleTitle: '';
  workDayTitle: string = '';
  workDayMonthTitle: string = '';
  workMonthTitle: string = '';
  calendar_button: string = 'assets/svg/month_button.svg';
  indexSelected: number = 0;
  isLoadingSlide: boolean = true;
  routeCollection: Array<Rutas> = [];
  salespointOfWork: Array<PdvsJornada> = [];
  routeSelected: Rutas = null;
  button_add: string = 'assets/svg/add_icon.svg';
  button_add_simple: string = 'assets/svg/add_simple.svg';
  salespointFree: Array<PdvRutaLibre> = [];
  salespointFreeChecked: Array<number> = [];
  isOpenModalSalespoint: boolean = false;
  sad_face: string = 'assets/svg/sad_face.svg';
  completed_icon: string = 'assets/svg/complete.svg';
  authUserSubs: Subscription;
  calendarAssistanceSubs: Subscription;
  documentClickSubs: Subscription;
  workdayCancell_icon: string = 'assets/svg/cancelled.svg';
  cancelJornada: string = 'assets/svg/cancel.svg';
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    spaceBetween: 15,
    allowTouchMove: false
  };

  calendarOptions: CalendarComponentOptions = {
    weekdays: ['Dom.', 'Lun.', 'Mar.', 'Mie.', 'Jue.', 'Vie.', 'Sab.'],
    weekStart: 1
  }

  isMonth: boolean = false;
  map = null;
  infoWindow = null;
  isWithoutMap: boolean = false;

  isEnabledNotPull: boolean = false;
  presentDayValidator: string = '';
  presentRouteDayValidator: string = '';
  keeperMarkers: any = {};

  enterAnimation: any;
  leaveAnimation: any;
  motivoCancelacion: any[] = []
  jornadaItem: any;
  selectCacenlarJornada: any;
  file: File;
  salesPointMapList: Array<IMarkerMap> = []
  fechaActual

  totalPDV: number = 0
  numPDVCompleted: number = 0
  constructor(
    private authServiceStore: AuthServiceStore,
    private campaingService: CampaingService,
    private loadingService: LoadingService,
    private store: Store<AppState>,
    private router: Router,
    private workdayService: JornadasService,
    private assistanceService: AsistenciaServiceAPI,
    private tableFormService: TableFormService,
    private tableUserService: TableUserService,
    private tableWorkdayRouteService: TableWorkdayRouteService,
    private tableWorkdayAssistanceService: TableWorkdayAssistanceService,
    private locationService: LocationService,
    private internetService: InternetConnectionService,
    private alertService: AlertService,
    private externalLibraryService: ExternalLibraryService,
    private deviceService: DeviceService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    this.fechaActual = new Date();
    this.settingArgs();
  }
  ionViewWillEnter() {
    this.initModule();
  }

  ionViewDidEnter() {
    this.store.dispatch(unsetMainRouteBackAction());
    this.store.dispatch(tapMenuSelectedAction({ indexTab: 1 }));
  }

  ngAfterViewInit(): void {
    this.calendarAssistanceSubs = this.store.select('assistance').subscribe(({ calendarAssistance }) => {
      // Si se encuentra en proceso de asistencia retornar a page asistencia
      if (calendarAssistance.length > 0) {
        this.router.navigate(['main', 'asistencia']);
      }
    });
  }


  ionViewDidLeave() {
    this.loadingService.stop();
  }

  ngOnDestroy(): void {
    this.authUserSubs?.unsubscribe();
    this.calendarAssistanceSubs?.unsubscribe();
    this.campaignSubs?.unsubscribe();
    this.map = null;
  }

  async settingArgs() {
    this.authUserSubs = this.store.select('auth').subscribe(({ user }) => {
      if (user != null) {
        this.userAuth = user;
      }
    });
    const { nombre, uid } = (await this.authServiceStore.getActiveUser()) as IUserAuth;
    this.userId = parseInt(uid);
    this.userName = nombre;

    this.campaignSubs = this.store.select('campaing').subscribe(async (campaing) => {
      this.activeCampaign = campaing.activeCampaign;
    });
  }

  async initModule() {
    this.validateWorkDay();
    this.isWithoutMap = false;
    this.isLoadingSlide = true;
    this.loadingService.show('Cargando calendario...');
    this.enterAnimation = this.modalService.enterAnimation;
    this.leaveAnimation = this.modalService.leaveAnimation;

    // Iniciamos obteniendo las jornada mensual y +- 1 mes.
    this.startDayOfWork = moment().add(-1, 'months').startOf('month').format('MM-DD-YYYY');
    this.endDayOfWork = moment().add(1, 'months').endOf('month').format('MM-DD-YYYY');

    // Verificamos si tiene un configuración de usuario reporteador
    const keyAppConfig = APP_CONFIG.UserReporter;
    const config = await this.tableUserService.getAppUserConfigCollection(parseInt(this.userAuth.uid), this.activeCampaign.idCampania, keyAppConfig);
    this.userReporterConfig = (config.length > 0 ? JSON.parse(config[0].valueObject) : null);
    this.getRutasByUsuario();

  }

  async validateWorkDay() {
    const presentDay: string = moment().format('YYYY-MM-DD');
    const presentUserId: number = (this.userReporterConfig ? this.userReporterConfig.idUsuario : this.userId);

    this.isExistsWorkday = false;
    this.isExistsIncompletedForms = false;
    this.isRouteWorkday = false;

    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      // Verificamos si tiene un jornada importada para trabajar offline
      const routeForDay = await this.tableWorkdayRouteService.getWorkdayRouteCollection(this.activeCampaign.idCampania, presentUserId);
      const routeOffLine = routeForDay.filter(x => x.fechaJornada.substring(0, 10) === presentDay);

      if (routeOffLine.length > 0) {
        this.configureMainIndicators(routeOffLine[0]);
      }

      return;
    }

    const workdaySubs = this.workdayService.getRutasByUsuario(presentUserId, presentDay, presentDay).subscribe(response => {
      if (response && response.length > 0) {
        const workDayResult = response[0];
        this.configureMainIndicators(workDayResult);
      }

      setTimeout(() => { workdaySubs?.unsubscribe(); this.loadingService.stop(); }, 1000);
    });
  }

  configureMainIndicators(route: Rutas) {
    this.isExistsWorkday = true;

    if (route.pdvsJornada.filter(x => x.asistenciaCompleta == 1).length == route.pdvsJornada.length) {
      this.workday_percent = 100;
      this.workday_progress = 'assets/svg/workday_success.svg';
    } else {
      // Validar formularios obligatorios
      this.workday_percent = 0;
      this.workday_progress = 'assets/svg/calendar_progress.svg';
    }

    if (route.pdvsJornada.some(x => x.asistenciaCompleta == 0)) {
      // validar si tiene formularios incompletos
      this.validateTareasForms();
    }

    // Validar distancias Totales y Realizadas
    if (route.pdvsJornada.length > 1) {
      this.validateDistanceOfWorkDay(route.idJornada, route.pdvsJornada);
    }
  }

  async validateTareasForms() {
    // Valida si tiene un pdv activo seleccionado
    const salespointSelectedSubs = this.store.select('salespoint').subscribe(async ({ salespointSelected }) => {
      if (salespointSelected != null) {
        // Obtenemos la lista de formularios
        const formListCollection = await this.tableFormService.getFormListCollection(this.activeCampaign.idCampania, salespointSelected.idJornada, salespointSelected.idPdv, []);
        // Obtienemos la lista de formularios con su detalle para validar si estan completados
        const formCollections = await this.tableFormService.getFormCollection(this.activeCampaign.idCampania, salespointSelected.idJornada, salespointSelected.idPdv, []);

        formListCollection.forEach(item => {
          const collection = formCollections.filter(x => x.idFormularioJornada == item.idFormularioJornada);
          if (collection.length > 0) {
            item.isCompleted = (collection[0].detalleTema.length == collection[0].detalleTema.filter(x => x.isCompleted == true).length ? true : false);
          }
        });

        if (formListCollection.some(x => x.obligatorio == true && x.isCompleted == false)) {
          this.isExistsIncompletedForms = true;
        }
      }

      setTimeout(() => { salespointSelectedSubs?.unsubscribe(); }, 1000);
    });
  }

  async validateDistanceOfWorkDay(workDayId: number, salespoint: Array<PdvsJornada>) {
    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      return;
    }

    const assistanceSubs = this.assistanceService.getAracne3AssistancesForWorkDay(workDayId).subscribe(response => {
      if (response && response.length > 0) {
        this.configureDistanceOfWorkDay(response, salespoint);
      }

      setTimeout(() => { assistanceSubs?.unsubscribe(); }, 1000);
    });
  }

  configureDistanceOfWorkDay(assistances: Array<AssistanceWorkResponse>, salespoint: Array<PdvsJornada>) {
    let distanceTotalPromise = [];
    let distanceTotal = 0;
    let distanceFinishedPromise = [];
    let distanceFinal = 0;
    let percentOfDistance = 0;

    const salespointSorted = salespoint.sort((x, y) => parseInt(x.ordenVisita) - parseInt(y.ordenVisita));
    const assistanceSort = assistances.filter(x => x.idTipoAsistencia == 1).sort((x, y) => Number(new Date(x.fechaHora)) - Number(new Date(y.fechaHora)));

    // ordenamiento segun la fecha hora de asistencia inicial
    assistanceSort.forEach((item, i) => {
      const index = salespointSorted.findIndex(x => x.idPdv == item.idPdv);
      const objectKeeper = salespointSorted.filter(x => x.idPdv == item.idPdv)[0];
      salespointSorted.splice(index, 1);
      salespointSorted.splice(i, 0, objectKeeper);
    });

    const workDayTotalSalespoint: Array<AddressCollection> = salespointSorted.map(x => ({ address: x.direccion, latitude: x.latitud, longitude: x.longitud }));

    const workDayWithAssistancePdv: Array<PdvsJornada> = salespointSorted.reduce((prev, value, index, array) => {
      if (index == 0 && value.asistenciaCompleta == 1) {
        prev.push(value);
      }
      if (index != 0 && index < array.length - 1 && assistanceSort.some(x => x.idPdv == value.idPdv)) {
        prev.push(value);
      }
      if (index != 0 && index == array.length - 1 && value.asistenciaCompleta == 1) {
        prev.push(value);
      }
      return prev;
    }, []);

    const workDayFinishedSalespoint: Array<AddressCollection> = workDayWithAssistancePdv.map(x => ({ address: x.direccion, latitude: x.latitud, longitude: x.longitud }));

    workDayTotalSalespoint.forEach((item, i, array) => {
      if (array.length > i + 1) {
        distanceTotalPromise.push(this.locationService.getGeopositionDistance(item, array[i + 1]));
      }
    });

    this.getAllDistancePosition(distanceTotalPromise).then(result => {
      // Obtenemos la distancia total entre todos los puntos de venta
      const distanceTotalPrev = result.reduce((acc, value) => { return acc + value; }, 0);
      distanceTotal = (distanceTotalPrev / 1000);

      this.objetive_route = distanceTotal.toFixed(2);

      if (workDayFinishedSalespoint.length > 1) {
        workDayFinishedSalespoint.forEach((item, i, array) => {
          if (array.length > i + 1) {
            distanceFinishedPromise.push(this.locationService.getGeopositionDistance(item, array[i + 1]));
          }
        });
      }

      this.getAllDistancePosition(distanceFinishedPromise).then(result => {
        // Obtenemos la distancia entre los puntos de venta visitados
        const distanceFinalPrev = result.reduce((acc, value) => { return acc + value; }, 0);
        distanceFinal = (distanceFinalPrev / 1000);
        percentOfDistance = (Number.isNaN(distanceFinal / distanceTotal) ? 0 : ((distanceFinal / distanceTotal) * 100));

        this.routes_percent = `${percentOfDistance.toFixed(0)}%`;
        this.routes_percent_width = (percentOfDistance <= 10 ? '15%' : `${percentOfDistance}%`);
        this.isBigger40percent = (percentOfDistance > 40 ? true : false);
        this.route = (distanceFinal > 0 ? distanceFinal.toFixed(2) : distanceFinal.toString());
        this.isRouteWorkday = true;
      });
    });
  }


  async getAllDistancePosition(distances: Array<any>): Promise<Array<number>> {
    let result: Array<number> = [];

    if (distances.length > 0) {
      await Promise.all(distances)
        .then((response: Array<number>) => {
          result = response;
        });

      return result;
    }
    return result;
  }
  
  //Google Maps
  async initMap(routeThisDay: Rutas) {
    const connection = await this.internetService.getNetWorkStatus();
    if (!connection.connected) {
      this.isWithoutMap = true;
      return;
    }

    const position = await this.preparedCoords(routeThisDay);
    if (position == null) {
      this.alertService.showAlert('not_geolocation.svg', 'Sin señal GPS', 'Debe permitir el uso de localización para poder continuar.');
      return;
    }

    this.isWithoutMap = false;
    // create a new map by passing HTMLElement
    const mapElement: HTMLElement = document.getElementById('calendarMaps');
    // create LatLng object
    const centerPosition = {
      lat: position.latitude,
      lng: position.longitude
    };

    try {
      // create map
      this.map = new google.maps.Map(mapElement, {
        center: centerPosition,
        zoom: 12,
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeControl: false
      });

      this.infoWindow = new google.maps.InfoWindow();

      this.map.addListener('click', () => {
        if (this.infoWindow) {
          this.infoWindow.close();
        }
      });

      let markers: Array<IMarkerMap> = [];

      routeThisDay.pdvsJornada.forEach(item => {
        markers.push({
          position: {
            lat: parseFloat(item.latitud),
            lng: parseFloat(item.longitud),
          },
          title: item.nombrePdv,
          infoWindow: `<p style="margin: unset !important;"><strong>${item.nombrePdv}</strong></p><br><p style="margin: unset !important;">${item.direccion}</p>`
        })
      });

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        if (markers.length > 0) {
          this.renderMarkers(markers);
        }

        mapElement.classList.add('show-map');
      });

      // disabled scrolling refresh when map drag
      google.maps.event.addListener(this.map, 'dragstart', () => {
        this.isEnabledNotPull = true;
      });

      google.maps.event.addListener(this.map, 'dragend', () => {
        this.isEnabledNotPull = false;
      });

      this.markerMyPosition();
    } catch (error) {
      console.log('ERROR GOOGLE MAPS Main', error);
      this.externalLibraryService.loadGoogleMaps();
      setTimeout(() => { this.initMap(routeThisDay); }, 500);
    }
  }

  async preparedCoords(routeThisDay: Rutas): Promise<{ latitude: number, longitude: number }> {
    return new Promise(async (resolve, reject) => {
      if (routeThisDay.pdvsJornada.length == 0) {
        if (this.deviceService.isPlatformMobile()) {
          const geopositionPromise: Position = await this.locationService.getGeoposition();

          if (geopositionPromise != null) {
            resolve({
              latitude: geopositionPromise.coords.latitude,
              longitude: geopositionPromise.coords.longitude
            });
          } else {
            resolve(null);
          }
        } else {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            });
          }
        }
      } else {
        resolve({
          latitude: parseFloat(routeThisDay.pdvsJornada[0].latitud),
          longitude: parseFloat(routeThisDay.pdvsJornada[0].longitud)
        })
      }
    });
  }

  renderMarkers(markers: Array<IMarkerMap>) {
    markers.forEach(marker => {
      this.addMarker(marker);
    });
  }

  addMarker(marker: IMarkerMap) {
    const markerInput = new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title,
      draggable: false,
      animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(markerInput, "click", () => {
      this.infoWindow.setContent(marker.infoWindow);
      this.infoWindow.open(this.map, markerInput);
    });

    return markerInput;
  }

  markerMyPosition() {
    const ionButton = document.createElement('ion-button');
    const ionIcon = document.createElement('ion-icon');
    ionIcon.name = 'locate-outline';
    ionIcon.slot = 'icon-only';
    ionButton.color = 'light';
    ionButton.append(ionIcon);

    this.map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(ionButton);

    ionButton.addEventListener("click", async () => {
      const position: Position = await this.locationService.getGeoposition();

      if (position != null) {
        if (this.keeperMarkers['myPosition'] != undefined) {
          this.keeperMarkers['myPosition'].setMap(null);
        }

        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const myPosition = new google.maps.Marker({
          id: 'myPosition',
          position: pos,
          icon: 'assets/svg/person_mark.svg',
          map: this.map
        });

        this.keeperMarkers['myPosition'] = myPosition;
        this.map.setZoom(14);
        this.map.setCenter(pos);

        return;
      }

      this.handleLocationError(true, this.infoWindow, this.map.getCenter()!);
    });
  }

  handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: any,
    pos: any
  ) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(this.map);
  }

  // Get Rutas
  async getRutasByUsuario() {
    const connection = await this.internetService.getNetWorkStatus();
    const userId = (this.userReporterConfig ? this.userReporterConfig.idUsuario : parseInt(this.userAuth.uid));

    const routeForDay = await this.tableWorkdayRouteService.getWorkdayRouteCollection(this.activeCampaign.idCampania, userId);
    const routeOffLine = routeForDay.filter(x => x.fechaJornada.substring(0, 10) === moment().format('YYYY-MM-DD'));

    if (!connection.connected) {
      // Verificamos si tiene un jornada importada para trabajar offline
      this.routeCollection = routeOffLine;

      if (routeOffLine.length > 0) {
        this.renderRouteOfDay();
        this.renderCalendarOfMonth();
        return;
      }

      setTimeout(() => {
        this.loadingService.stop();
        this.alertService.showAlert('no_wifi.svg', '¡Sin conexión a internet!', `No hay conexión a Internet.\r\ Por favor, verificar su conexión.`);
      }, 250);
      return;
    }

    const getRutasByUsuarioSub = this.workdayService.getRutasByUsuario(userId, this.startDayOfWork, this.endDayOfWork).subscribe(response => {
      if (response && response.length > 0) {
        this.routeCollection = response.sort((x, y) => Number(new Date(x.fechaJornada)) - Number(new Date(y.fechaJornada)));
        this.renderRouteOfDay();
        this.renderCalendarOfMonth();
      } else {
        this.routeCollection = routeOffLine;

        if (routeOffLine.length > 0) {
          this.renderRouteOfDay();
          this.renderCalendarOfMonth();
          return;
        }

        setTimeout(() => {
          this.loadingService.stop();
          this.alertService.showAlert(null, 'Sin Rutas', `Es posible que no tenga rutas asignadas, comuníquese con su BackOffice y vuelve a intentarlo, refrescando esta vista.`);
        }, 250);
      }

      setTimeout(() => { getRutasByUsuarioSub?.unsubscribe(); }, 250);
    });
  }

  // Lista de ruta para el presente día
  async renderRouteOfDay() {
    const selectedDay: string = moment().format('YYYY-MM-DD');
    const routeThisDay: Array<Rutas> = this.routeCollection.filter(x => x.fechaJornada.substring(0, 10) === selectedDay);

    this.presentDayValidator = selectedDay;
    this.presentRouteDayValidator = selectedDay;

    // Si no encuentra ruta para la fecha actual
    if (routeThisDay.length === 0) {
      this.preparedTemporalWorkDay();
      return;
    }

    const routePdvs: Array<PdvsJornada> = routeThisDay.reduce((prev, curr) => {
      curr.pdvsJornada.forEach((item) => { prev.push(item); });
      return prev;
    }, []);

    // Guardamos la ruta y sus pdv para la funcionalidad offline
    await this.tableWorkdayRouteService.addWorkdayRouteCollection(routeThisDay, this.activeCampaign.idCampania);
    await this.tableWorkdayRouteService.addWorkdayRouteSalespointCollection(routePdvs, this.activeCampaign.idCampania);

    const listaRuta = await this.tableWorkdayRouteService.getWorkdayRouteCollection(this.activeCampaign.idCampania, parseInt(this.userAuth.uid))
    //obtener informacion PDV  
    for (let index = 0; index < routePdvs.length; index++) {
      const element = routePdvs[index];
      await this.assistanceService.getAracne3AssistanceInfoPdv(element.idPdv).subscribe(async (res) => {
        await this.tableWorkdayAssistanceService.addInformacionPdvTypeCollection(res, element.idPdv)
      })
    }

    setTimeout(() => {
      this.map = null;
      this.infoWindow = null;
      this.initMap(routeThisDay[0]);
      this.preparedWorkDayList(selectedDay, routeThisDay[0]);
    }, 500);
  }

  onBackDayChangeDay() {
    if (this.indexSelected === 0) {
      return;
    }

    const selectedDay = this.routeCollection[this.indexSelected - 1].fechaJornada.substring(0, 10);
    const routeThisDay: Rutas = this.routeCollection.filter(x => x.fechaJornada.substring(0, 10) == selectedDay)[0];

    this.map = null;
    this.infoWindow = null;
    this.initMap(routeThisDay);
    this.preparedWorkDayList(selectedDay, routeThisDay);
    this.presentRouteDayValidator = routeThisDay.fechaJornada.substring(0, 10);
  }

  onForwardDayChangeDay() {
    if ((this.indexSelected + 1) === this.routeCollection.length) {
      return;
    }

    const selectedDay = this.routeCollection[this.indexSelected + 1].fechaJornada.substring(0, 10);
    const routeThisDay: Rutas = this.routeCollection.filter(x => x.fechaJornada.substring(0, 10) == selectedDay)[0];

    this.map = null;
    this.infoWindow = null;
    this.initMap(routeThisDay);
    this.preparedWorkDayList(selectedDay, routeThisDay);
    this.presentRouteDayValidator = routeThisDay.fechaJornada.substring(0, 10);
  }

  // preparamos la UI
  preparedWorkDayList(selectedDay: string, routeThisDay: Rutas) {
    // Retomamos al index de la ruta donde se quedo desde que selecciono un pdv
    if (this.routeSelected && this.userReporterConfig) {
      const { fechaJornada } = this.routeSelected;
      const routeIndex = this.routeCollection.findIndex(x => x.fechaJornada === fechaJornada);

      if (routeIndex !== -1) {
        this.indexSelected = routeIndex;
        this.workDayTitle = moment(fechaJornada).format('dddd DD');
        this.workDayMonthTitle = moment(fechaJornada).format('MMMM');
        this.workMonthTitle = moment(fechaJornada).format('MMM YYYY');
        this.salespointOfWork = this.routeCollection[routeIndex].pdvsJornada.filter(x => x.activo == true).sort((x, y) => parseInt(x.ordenVisita) - parseInt(y.ordenVisita));
        this.salesPointMapList = this.salespointOfWork.map(x => ({
          title: x.nombrePdv,
          infoWindow: x.direccion,
          position: {
            lat: x.latitud,
            lng: x.longitud
          }
        }))
        this.totalPDV = this.salespointOfWork.length;
        this.numPDVCompleted = 0;
        this.salespointOfWork.forEach((item) => {
          if (item.asistenciaCompleta == 1) {
            this.numPDVCompleted = this.numPDVCompleted + 1
          }
        })
        setTimeout(() => { this.isLoadingSlide = false; this.loadingService.stop(); this.routeSelected = null; }, 250);
        return;
      }
    }

    this.indexSelected = this.routeCollection.findIndex(x => x.fechaJornada.substring(0, 10) == selectedDay);
    this.workDayTitle = moment(routeThisDay.fechaJornada).format('dddd DD');
    this.workDayMonthTitle = moment(routeThisDay.fechaJornada).format('MMMM');
    this.workMonthTitle = moment(routeThisDay.fechaJornada).format('MMM YYYY');
    this.salespointOfWork = routeThisDay.pdvsJornada.filter(x => x.activo == true).sort((x, y) => parseInt(x.ordenVisita) - parseInt(y.ordenVisita));
    this.salesPointMapList = this.salespointOfWork.map(x => ({
      title: x.nombrePdv,
      infoWindow: x.direccion,
      position: {
        lat: x.latitud,
        lng: x.longitud
      }
    }))

    //
    this.totalPDV = this.salespointOfWork.length;
    this.numPDVCompleted = 0;
    this.salespointOfWork.forEach((item) => {
      if (item.asistenciaCompleta == 1) {
        this.numPDVCompleted = this.numPDVCompleted + 1
      }
    })

    // validamos si tienes asistencias en la fecha actual
    if (selectedDay == moment().format('YYYY-MM-DD')) {
      this.validateStatusWorkDay(routeThisDay.idJornada);
    }
  }

  // ruta temporal sin jornada y pdv solo para fines de UI
  preparedTemporalWorkDay() {
    const presentUser: number = (this.userReporterConfig ? this.userReporterConfig.idUsuario : parseInt(this.userAuth.uid));

    this.routeCollection.push({
      idRuta: 9999,
      idJornada: 9999,
      idTipoRuta: 3,
      tipoRuta: 'Fuera Ruta',
      idUsuario: presentUser,
      nombreRuta: 'Sin ruta',
      fechaJornada: moment().format('YYYY-MM-DDTHH:mm:ss'),
      horaEntrada: '09:00:00',
      horaSalida: '23:00:00',
      pdvsJornada: []
    });

    this.routeCollection = [...this.routeCollection].sort((x, y) => Number(new Date(x.fechaJornada)) - Number(new Date(y.fechaJornada)));

    setTimeout(() => {
      const selectedDay: string = moment().format('YYYY-MM-DD');
      const routeThisDay: Rutas = this.routeCollection.filter(x => x.fechaJornada.substring(0, 10) === selectedDay)[0];

      this.indexSelected = this.routeCollection.findIndex(x => x.fechaJornada.substring(0, 10) === selectedDay);
      this.workDayTitle = moment(routeThisDay.fechaJornada).format('dddd DD');
      this.workDayMonthTitle = moment(routeThisDay.fechaJornada).format('MMMM');
      this.workMonthTitle = moment(routeThisDay.fechaJornada).format('MMM YYYY');
      this.salespointOfWork = [];

      this.map = null;
      this.infoWindow = null;
      this.initMap(routeThisDay);
      this.isLoadingSlide = false;
      this.loadingService.stop();
    }, 500);
  }

  // Validación para estatus de la asistencia si alguna esta en progreso selecciona automaticamente el pdv y lo deriva al page de asistencia
  async validateStatusWorkDay(workDayId: number) {
    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      const assistances = await this.tableWorkdayAssistanceService.getAssistanceWorkday(this.activeCampaign.idCampania, workDayId);

      if (assistances.length > 0) {
        this.configSalespointAssistance(workDayId, assistances);
        return;
      }
      setTimeout(() => { this.isLoadingSlide = false; this.loadingService.stop(); }, 250);
      return;
    }

    const assistanceStatusSubs = this.assistanceService.getAracne3AssistancesForWorkDay(workDayId).subscribe(response => {
      if (response && response.length > 0) {
        this.configSalespointAssistance(workDayId, response);
      } else {
        setTimeout(() => { this.isLoadingSlide = false; this.loadingService.stop(); }, 250);
      }

      assistanceStatusSubs?.unsubscribe();
    });
  }

  configSalespointAssistance(workdayId: number, assistances: Array<AssistanceWorkResponse>) {
    const assistanceResult = assistances.filter(x => x.idTipoAsistencia == 1);
    const assistanceSort = assistanceResult.sort((x, y) => Number(new Date(x.fechaHora)) - Number(new Date(y.fechaHora)));

    const routeOfDay = this.routeCollection.filter(x => x.idJornada == workdayId).map(y => y.pdvsJornada)[0];

    // ordenamiento segun la fecha hora de asistencia inicial
    assistanceSort.forEach((item, i) => {
      const index = routeOfDay.findIndex(x => x.idPdv == item.idPdv);
      const objectKeeper = routeOfDay.filter(x => x.idPdv == item.idPdv)[0];
      routeOfDay.splice(index, 1);
      routeOfDay.splice(i, 0, objectKeeper);
    });

    this.salespointOfWork = routeOfDay;

    this.salesPointMapList = this.salespointOfWork.map(x => ({
      title: x.nombrePdv,
      infoWindow: x.direccion,
      position: {
        lat: x.latitud,
        lng: x.longitud
      }
    }))

    let salespointId: number = 0;
    let salespointWithAssistance: PdvsJornada = null;

    for (let route of routeOfDay) {
      const existsPdv = assistances.filter(x => x.idPdv == route.idPdv);
      const salespointAssistances = existsPdv.some(y => y.idTipoAsistencia == 4);
      // Si no tiene la asistencia completada seteamos el pdv en proceso
      if (existsPdv.length > 0 && !salespointAssistances) {
        salespointId = existsPdv[0].idPdv;
        break;
      }
    }

    if (salespointId != 0) {
      salespointWithAssistance = routeOfDay.filter(x => x.idPdv == salespointId)[0];
    }

    setTimeout(() => {
      if (salespointWithAssistance) {
        this.onSelectSalespoint(salespointWithAssistance);
      }

      this.isLoadingSlide = false;
      this.loadingService.stop();
    }, 250);
  }

  async onSelectSalespoint(salespointSelected: PdvsJornada) {
    const thisDay: string = moment().format('YYYY-MM-DD');
    const workdayDay: string = this.routeCollection[this.indexSelected].fechaJornada.substring(0, 10);
    const diferrenceOfDays: number = moment(workdayDay).diff(moment(thisDay), 'days');

    if (this.userReporterConfig && (diferrenceOfDays === 0 || diferrenceOfDays > 0)) {
      this.alertService.showAlert('outside_map.svg', 'Ruta en proceso', 'No puede acceder a la ruta de hoy, hasta que finalice el día.');
      return;
    }

    if (!this.userReporterConfig && workdayDay !== thisDay) {
      this.alertService.showAlert('outside_map.svg', 'Ruta no habilitada', 'No tiene asignada esta ruta para el día de hoy.');
      return;
    }

    this.routeSelected = this.routeCollection[this.indexSelected];
    this.store.dispatch(setSalespointSelected({ salespointSelected }));
    this.router.navigate(['main', 'asistencia']);
  }

  // Calendar
  renderCalendarOfMonth() {
    // Incluir validacion si a cumplido o no con su jornada
    setTimeout(() => {
      const elements = document.querySelectorAll('.days-btn');

      elements.forEach((element) => {
        const ariaLabelOfElement = element.ariaLabel;

        const parent = this.routeCollection.filter(x => {
          const momentPart = moment(x.fechaJornada);
          momentPart.locale('en');
          return momentPart.format('MMMM DD, YYYY') == ariaLabelOfElement;
        });

        if (parent.length > 0) {
          // validar si la asistencia es completa en todos sus puntos de venta.
          const salespointForRoute = parent[0].pdvsJornada.length;
          const salespointCompleted = parent[0].pdvsJornada.filter(x => x.asistenciaCompleta == 1).length;

          if (parent[0].pdvsJornada.length == 0) {
            return;
          }

          if (salespointCompleted == salespointForRoute) {
            element.firstElementChild.classList.add('work_done');
          } else {
            element.firstElementChild.classList.add('work_not_done');
          }
          // habilitamos los días que tienen jornada y pdvs
          element.removeAttribute('disabled');
        }
      });
    }, 500);
  }

  onBackMonthChangeDay() {
    const backButtom = document.querySelectorAll<HTMLElement>("ion-button.back")
    backButtom[0].click();
    this.renderCalendarOfMonth();
  }

  onForwardMonthChangeDay() {
    const fordwardButtom = document.querySelectorAll<HTMLElement>("ion-button.forward")
    fordwardButtom[0].click();
    this.renderCalendarOfMonth();
  }

  monthChangeEvent(event: any) {
    const month = event.newMonth.string;
    this.workMonthTitle = moment(month).format('MMM YYYY');
  }

  onSelectedDayCalendar($event) {
    const selectedDay: string = moment($event, 'DD-MM-YYYY').format('YYYY-MM-DD');
    const routeThisDay: Rutas[] = this.routeCollection.filter(x => moment(x.fechaJornada).format('DD-MM-YYYY') == $event);

    if (routeThisDay.length <= 0) {
      return;
    }

    this.slideChange();
    this.map = null;
    this.infoWindow = null;
    this.initMap(routeThisDay[0]);
    this.preparedWorkDayList(selectedDay, routeThisDay[0]);
  }

  async slideChange() {
    const activeIndex = await this.slides.getActiveIndex();
    const newActiveIndex = (activeIndex == 0 ? 1 : 0);

    this.slides.slideTo(newActiveIndex, 400);
    this.calendar_button = (newActiveIndex == 1 ? 'assets/svg/day_button.svg' : 'assets/svg/month_button.svg');
    this.isMonth = (newActiveIndex == 1 ? true : false);
  }

  async onviewCalendar() {
    const activeIndex = await this.slides.getActiveIndex();
    this.calendar_button = (activeIndex == 0 ? 'assets/svg/month_button.svg' : 'assets/svg/day_button.svg');
    this.isMonth = (activeIndex == 1 ? true : false);
  }

  refreshSlideWorkDay(event) {
    this.getRutasByUsuario();
    setTimeout(() => { event.target.complete(); }, 2500);
  }

  async getSalespointFreeForRoute() {
    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      this.alertService.showAlert('no_wifi.svg', '¡Sin conexión a internet!', `No se pudo obtener los puntos de venta.\r\ Por favor, verificar su conexión y volver a intentarlo.`);
      return;
    }

    const selectedDay: string = moment().format('YYYY-MM-DD');
    const routeThisDay: Rutas = this.routeCollection.filter(x => x.fechaJornada.substring(0, 10) == selectedDay)[0];
    const presentUser: number = (this.userReporterConfig ? this.userReporterConfig.idUsuario : parseInt(this.userAuth.uid));

    const salespointFreeSubs = this.workdayService.getAvailableSalespointForRoute(presentUser, routeThisDay.idJornada).subscribe(response => {
      if (response && response.length > 0) {
        this.salespointFree = response;
        this.isOpenModalSalespoint = true;
      } else {
        this.alertService.showAlert('outside_map.svg', '¡Sin puntos de venta!', `No se encontró más puntos de venta asignados.`);
      }
      setTimeout(() => { salespointFreeSubs?.unsubscribe(); }, 500);
    });
  }

  onCheckedSalespointFree(event, salespointId: number) {
    if (!event.detail.checked) {
      this.salespointFreeChecked = this.salespointFreeChecked.filter(x => x != salespointId);
    } else {
      this.salespointFreeChecked.push(salespointId);
    }
  }

  async addSalespointFreeForRoute() {
    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      this.alertService.showAlert('no_wifi.svg', '¡Sin conexión a internet!', `No se pudo agregar los puntos de venta.\r\ Por favor, verificar su conexión y volver a intentarlo.`);
      return;
    }

    const selectedDay: string = moment().format('YYYY-MM-DD');
    const routeThisDay: Rutas = this.routeCollection.filter(x => x.fechaJornada.substring(0, 10) == selectedDay)[0];
    const lastOrderSalespoint: number = Math.max(...routeThisDay.pdvsJornada.map(x => parseInt(x.ordenVisita)));

    let dataRequest: Array<DataPdvRutaInsert> = [];
    let newSalespointOrder: number = lastOrderSalespoint;

    this.salespointFreeChecked.forEach((item, i) => {
      dataRequest.push({
        idJornada: routeThisDay.idJornada,
        idPdv: item,
        ordenVisita: (newSalespointOrder += 1),
        usCreacion: parseInt(this.userAuth.uid)
      });
    });

    if (dataRequest.length > 0) {
      const request: PdvRutaInsertRequest = {
        dataInsertJornadasPuntoDeVenta: dataRequest
      }

      const addSalespointSubs = this.workdayService.postSalespointOffRoute(request).subscribe(response => {
        if (response && response.statusCode == 200) {
          this.isLoadingSlide = true;
          this.loadingService.show('Cargando calendario...');

          this.getRutasByUsuario();
          this.isOpenModalSalespoint = false;
        } else {
          this.alertService.showAlert(null, 'Ocurrió un error', `No se pudo agregar ${(dataRequest.length === 1 ? 'el' : 'los')} puntos de venta.`);
        }

        setTimeout(() => { addSalespointSubs?.unsubscribe(); }, 250);
      });
    }
  }
}
