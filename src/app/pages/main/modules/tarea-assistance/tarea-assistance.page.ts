import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BackgroundRunner } from '@capacitor/background-runner';
import { Position } from '@capacitor/geolocation';
import { Platform, AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subject, Subscription, interval } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { AsistenciaServiceAPI } from 'src/app/services/API/asistencia.api.service';
import { AuditoriaApiService } from 'src/app/services/API/auditoria.api.service';
import { FileUploadService } from 'src/app/services/API/file-upload.service';
import { FormularioJornadasService } from 'src/app/services/API/formulario-jornadas.service';
import { MasterDataService } from 'src/app/services/API/master-data.service';
import { CampaingService } from 'src/app/services/STORE/campaing.store.service';
import { AlertService } from 'src/app/services/UI/alert.service';
import { LoadingService } from 'src/app/services/UI/loading.service';
import { ModalService } from 'src/app/services/UI/modal.service';
import { ToastAlertService } from 'src/app/services/UI/toast-alert.service';
import { BatterryService } from 'src/app/services/batterry.service';
import { DatabaseImportService } from 'src/app/services/database/database-import.service';
import { TableFormService } from 'src/app/services/database/table-form.service';
import { TableUserService } from 'src/app/services/database/table-user.service';
import { TableWorkdayAssistanceService } from 'src/app/services/database/table-workday-assistance.service';
import { ExternalLibraryService } from 'src/app/services/external-library.service';
import { InternetConnectionService } from 'src/app/services/internet-connection.service';
import { LocationService } from 'src/app/services/location.service';
import { APP_CONFIG, ASSISTANCE_CONFIG_CAMPAING } from 'src/app/shared/constants/values.constants';
import { AssistanceType, AssistanceWorkResponse, CalendarAssistance, AssistanceWorkRequest } from 'src/app/shared/models/assistance.interface';
import { IItemCampaign } from 'src/app/shared/models/campaing.interface';
import { FileWriteData } from 'src/app/shared/models/filetransfer-form.interface';
import { CancelarJornadas } from 'src/app/shared/models/formulario-jornada';
import { InformationPDV, PdvsJornada } from 'src/app/shared/models/jornada.interface';
import { AddressCollection } from 'src/app/shared/models/location.interface';
import { IMarkerMap } from 'src/app/shared/models/map.interface';
import { MasterdataRequest } from 'src/app/shared/models/masterData.interface';
import { UserCampaign } from 'src/app/shared/models/user.interface';
import { User } from 'src/app/shared/models/user.model';
import { unSetCalendarAssistance, setCalendarAssistance } from 'src/app/store/actions/assistance.action';
import { setMainRouteBackAction, unsetMainRouteBackAction, tapMenuSelectedAction } from 'src/app/store/actions/menu.action';
import { clearSalespointSelected, setSalespointSelected } from 'src/app/store/actions/salespoint.action';
import { AppState } from 'src/app/store/app.reducer';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PushNotificationSchema, PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { JornadasService } from 'src/app/services/API/jornadas.service';
moment.locale('es');

declare var google;

@Component({
  selector: 'app-tarea-assistance',
  templateUrl: './tarea-assistance.page.html',
  styleUrls: ['./tarea-assistance.page.scss'],
})
export class TareaAssistancePage implements OnInit, OnDestroy {
  @ViewChild('assistanceMap', { read: ElementRef, static: false }) mapElement: ElementRef;
  map = null;
  infoWindow = null;
  isWithoutMap: boolean = false;
  keeperMarkers: any = {};

  userAuth: User = null;
  userReporterIcon: string = 'assets/svg/user.svg';
  userReporterConfig: UserCampaign = null;
  activeCampaign: IItemCampaign = null;
  salespointSelected: PdvsJornada = null;
  homeworks_icon: string = 'assets/svg/homework_button.svg';

  check_in_object: AssistanceType = undefined;
  check_in_icon: string = 'assets/svg/check_in.svg';
  check_in_icon_active: string = 'assets/svg/check_in_active.svg';
  check_in_marked: boolean = false;
  check_in_marked_loading: boolean = false;
  check_in_marked_hour: string = '';

  check_partial_object: Array<AssistanceType> = [];
  check_partial_title: string = '';
  check_partial_icon: string = 'assets/svg/check_partial.svg';
  check_partial_icon_active: string = 'assets/svg/check_partial_active.svg';
  check_partial_icon_stop: string = 'assets/svg/check_partial_stop.svg';
  check_partial_marked: boolean = false;
  check_partial_marked_final: boolean = false;
  check_partial_marked_loading: boolean = false;
  check_partial_inprogress: boolean = false;
  check_partial_marked_hour: string = '';
  check_partial_hour_keeper: Array<number> = [];

  check_out_object: AssistanceType = undefined;
  check_out_icon: string = 'assets/svg/check_out.svg';
  check_out_icon_active: string = 'assets/svg/check_out_active.svg';
  check_out_marked: boolean = false;
  check_out_marked_loading: boolean = false;
  check_out_marked_hour: string = '';

  lastAccessDate: Date = null;
  isLoading: boolean = false;
  sad_face: string = 'assets/svg/sad_face.svg';
  cancelJornada: string = 'assets/svg/cancel.svg';

  startedTimer$ = new Subject<void>();
  salespointSelectedSubs: Subscription;
  calendarAssistanceSubs: Subscription;
  timerSubs: Subscription;
  authUserSubs: Subscription;
  backgroundResumeSubs: Subscription;
  motivoCancelacion: any[] = []
  selectCacenlarJornada
  jornadaItem: any;
  decodeToken: any;
  isOpenModalCancel: boolean = false;
  enterAnimation: any;
  leaveAnimation: any;
  fileCancelarMotivo: File;
  fileCheckout: File;
  motivoCheckout: any[] = []
  selectedSegment: string = 'opcion1';
  isInlineList: boolean = false;
  selectCheckOutJornada: any
  idFileMotivoCheckOut: any
  loading: boolean = false
  isActivePDV: boolean = false
  labelFileCancelar = "Selecciona un archivo"
  labelFileCheckout = "Selecciona un archivo"
  infoPDV: InformationPDV = null;
  salesPointMapList: Array<IMarkerMap> = []
  fechaActual
  isCheckout: boolean = false;

  constructor(
    private platform: Platform,
    private store: Store<AppState>,
    private router: Router,
    private campaingService: CampaingService,
    private assistanceService: AsistenciaServiceAPI,
    private auditoriaService: AuditoriaApiService,
    private locationService: LocationService,
    private alertCtrl: AlertController,
    private loadingService: LoadingService,
    private internetService: InternetConnectionService,
    private batteryService: BatterryService,
    private alertService: AlertService,
    private tableUserService: TableUserService,
    private tableWorkdayAssistanceService: TableWorkdayAssistanceService,
    private tableFormService: TableFormService,
    private databaseImportService: DatabaseImportService,
    private externalLibraryService: ExternalLibraryService,
    private masterDataService: MasterDataService,
    private formularioJornadasService: FormularioJornadasService,
    private modalService: ModalService,
    private toastAlertService: ToastAlertService,
    private fileUploadService: FileUploadService,
    private geolocation: Geolocation,
    private jornadasService:JornadasService
  ) { }

  private getFileName(input: HTMLInputElement): string {
    const fileCount = input.files ? input.files.length : 0;

    if (fileCount > 1) {
      return (input.getAttribute('data-multiple-caption') || '').replace('{count}', fileCount.toString());
    } else {
      return input.value.split('\\').pop() || '';
    }
  }

  async ngOnInit() {
    this.init();
    await this.requestPosition();
    this.fechaActual = new Date();
    
    this.settingArgs();

    const inputs = document.querySelectorAll('.inputfile');

    Array.prototype.forEach.call(inputs, (input: HTMLInputElement) => {
      const label = input.nextElementSibling as HTMLElement;
      const labelVal = label.innerHTML;

      input.addEventListener('change', (e: Event) => {
        const fileName = this.getFileName(input);

        if (fileName) {
          label.querySelector('span').innerHTML = fileName;
        } else {
          label.innerHTML = labelVal;
        }
      });
    });
  }

  ionViewWillEnter() {
    this.initModule();
  }

  ionViewDidEnter() {
    this.backgroundResumeSubs = this.platform.resume.subscribe(() => {
      if (this.lastAccessDate != null) {
        // Si regresa del segundo plano y ya ha culminado el día, entonces, retornamos al calendario
        const today = moment().toDate();
        const compared = moment(today).diff(moment(this.lastAccessDate), 'days');

        if (compared >= 1) {
          this.store.dispatch(unSetCalendarAssistance());
          this.store.dispatch(clearSalespointSelected());
          this.router.navigate(['main', 'calendario']);
        }
      }
    });

    this.calendarAssistanceSubs = this.store.select('assistance').subscribe(({ calendarAssistance }) => {
      if (calendarAssistance.length === 0) {
        this.check_in_marked = false;
        this.check_in_marked_hour = '';
        this.check_partial_marked = false;
        this.check_partial_marked_final = false;
        this.check_out_marked = false;
        this.check_out_marked_hour = '';
        this.check_in_object = undefined;
        this.check_partial_object = [];
        this.check_out_object = undefined;
        this.isActivePDV = false;

        // Habilitamos el botón de volver dado que la ruta no esta en curso para el pdv seleccionado
        this.store.dispatch(setMainRouteBackAction({ routerBackId: 3 }));
        return;
      }

      if (this.userReporterConfig) {
        // Habilitamos el botón de volver dado está configurado como otro usuario para reportar
        this.store.dispatch(setMainRouteBackAction({ routerBackId: 3 }));
      } else {
        // Deshabilitamos el botón volver dado que ya esta en curso la ruta en el pdv seleccionado.
        this.store.dispatch(unsetMainRouteBackAction());
      }
      // Objetos de Marcación CheckIn
      const check_in_value = calendarAssistance.filter(x => x.assistanceType === 1);
      this.check_in_marked = (check_in_value.length > 0 ? true : false);
      this.check_in_marked_loading = (check_in_value.length > 0 ? false : this.check_in_marked_loading);
      this.check_in_marked_hour = (check_in_value.length > 0 ? check_in_value.map(y => moment(y.dateMarked).format('LT'))[0] : '');
      // Objetos de Marcación Parcial o de Descanso
      this.check_partial_marked = (calendarAssistance.filter(x => x.assistanceType === 2).length > 0 ? true : false);
      this.check_partial_marked_final = (calendarAssistance.filter(x => x.assistanceType === 3).length > 0 ? true : false);
      this.check_partial_marked_loading = (calendarAssistance.filter(x => x.assistanceType === 2 || x.assistanceType === 3).length > 0 ? false : this.check_partial_marked_loading);
      this.check_partial_title = (calendarAssistance.filter(x => x.assistanceType === 3).length > 0 ?
        this.check_partial_object.filter(x => x.idTipoAsistencia === 3).map(y => y.tipoAsistencia)[0] : this.check_partial_title);
      // Objetos de Marcación de CheckOut
      const check_out_value = calendarAssistance.filter(x => x.assistanceType === 4);
      this.check_out_marked = (check_out_value.length > 0 ? true : false);
      this.check_out_marked_loading = (check_out_value.length > 0 ? false : this.check_out_marked_loading);
      this.check_out_marked_hour = (check_out_value.length > 0 ? check_out_value.map(y => moment(y.dateMarked).format('LT'))[0] : '');

      const thisTime = moment().format('YYYY-MM-DDTHH:mm:ss');
      const partialAssistance = calendarAssistance.filter(x => x.assistanceType === 2).map(y => y.dateMarked)[0];
      const partialFinalAssistance = calendarAssistance.filter(x => x.assistanceType === 3).map(y => y.dateMarked)[0];

      //validar el checkin para visualizar los descanco, checkout y formularios
      if (this.check_in_marked) {
        this.isActivePDV = true;
      } else {
        this.isActivePDV = false;
      }

      if (partialAssistance && !partialFinalAssistance) {
        const duration = moment.utc(moment(thisTime).diff(moment(partialAssistance))).format('HH:mm:ss');
        const hours = parseInt(duration.substring(0, 2));
        const minutes = parseInt(duration.substring(3, 5));
        const seconds = parseInt(duration.substring(6, 8));

        this.runTimmerPartialCheckIn([hours, minutes, seconds, 0]);
      }

      if (partialAssistance && partialFinalAssistance) {
        this.startedTimer$.complete();
        this.timerSubs?.unsubscribe();
        this.check_partial_inprogress = false;
        this.check_partial_marked_hour = moment.utc(moment(partialFinalAssistance).diff(moment(partialAssistance))).format('HH:mm:ss');
      }

      // Si tiene una marcación Checkout y no tiene esta configurado como otro usuario podemos cerrar el punto de venta.
      if (!this.userReporterConfig && calendarAssistance.filter(x => x.assistanceType === 4).length > 0) {
        this.store.dispatch(unSetCalendarAssistance());
        this.store.dispatch(clearSalespointSelected());
        this.router.navigate(['main', 'calendario']);
      }
    });

    //this.initMap();
    this.store.dispatch(tapMenuSelectedAction({ indexTab: 3 }));
  }

  ionViewDidLeave() {
    this.backgroundResumeSubs?.unsubscribe();
    this.calendarAssistanceSubs?.unsubscribe();
    this.loadingService.stop();
  }

  ngOnDestroy(): void {
    this.salespointSelectedSubs?.unsubscribe();
    this.authUserSubs?.unsubscribe();
    this.timerSubs?.unsubscribe();
    this.loadingService.stop();
  }

  async settingArgs() {
    this.salespointSelectedSubs = this.store.select('salespoint').subscribe(({ salespointSelected }) => {
      this.salespointSelected = salespointSelected;

      if (this.salesPointMapList.length == 0) {
        this.salesPointMapList.push({
          title: this.salespointSelected.nombrePdv,
          infoWindow: this.salespointSelected.direccion,
          position: {
            lat: this.salespointSelected.latitud,
            lng: this.salespointSelected.longitud
          }
        })
      }
    });

    this.authUserSubs = this.store.select('auth').subscribe(({ user }) => {
      if (user != null) {
        this.userAuth = user;
      }
    });

    this.activeCampaign = await this.campaingService.getActiveCampaing();
  }

  async initModule() {
    this.isWithoutMap = false;
    this.isLoading = true;
    this.loadingService.show('Cargando asistencias...');
    this.lastAccessDate = moment().toDate();
    this.check_partial_hour_keeper = [];
    this.store.dispatch(unSetCalendarAssistance());

    this.enterAnimation = this.modalService.enterAnimation;
    this.leaveAnimation = this.modalService.leaveAnimation;

    // Verificamos si tiene un configuración de usuario reporteador
    const keyAppConfig = APP_CONFIG.UserReporter;
    const config = await this.tableUserService.getAppUserConfigCollection(parseInt(this.userAuth.uid), this.activeCampaign.idCampania, keyAppConfig);
    this.userReporterConfig = (config.length > 0 ? JSON.parse(config[0].valueObject) : null);

    setTimeout(() => { this.getAssistanceTypes(); this.loadingService.stop() }, 1000);
  }

  async getAssistanceTypes() {
    const connection = await this.internetService.getNetWorkStatus();
    const assistanceTypesDb = await this.tableWorkdayAssistanceService.getAssistanceTypeCollection(this.activeCampaign.idCampania);

    if (!connection.connected) {
      // Verificamos si tiene tipos de asistencias guardadas en el BD
      if (assistanceTypesDb.length > 0) {
        this.settingAssistanceTypesObject(assistanceTypesDb);
        this.validateStatusWordDay();
        return;
      }
      setTimeout(() => {
        this.isLoading = false;
        this.loadingService.stop();
        this.alertService.showAlert('no_wifi.svg', '¡Sin conexión a internet!', `No hay conexión a Internet.\r\ Por favor, verificar su conexión.`);
      }, 250);

      return;
    }

    //obtener informacion PDV 
    await this.assistanceService.getAracne3AssistanceInfoPdv(this.salespointSelected.idPdv).subscribe((res) => {
      this.infoPDV = res
    })

    const assistanceTypeSubs = this.assistanceService.getAracne3AssistanceType().subscribe(async (response) => {
      if (response && response.length > 0) {
        this.settingAssistanceTypesObject(response);

        // Guardamos los tipos de asistencia para la funcionalidad offline
        const assistanceTypes = response.map(x => ({ ...x, idCampania: this.activeCampaign.idCampania }));
        await this.tableWorkdayAssistanceService.addAssistanceTypeCollection(assistanceTypes);

        this.validateStatusWordDay();
      } else {
        if (assistanceTypesDb.length > 0) {
          this.settingAssistanceTypesObject(assistanceTypesDb);
          this.validateStatusWordDay();
        } else {
          setTimeout(() => {
            this.isLoading = false;
            this.loadingService.stop();
            this.alertService.showAlert(null, 'Error', 'Ocurrio un error al cargar la asistencia.\r\ Vuelve al Calendario e ingresa nuevamente al punto de venta.');
          }, 250);
        }
      }

      setTimeout(() => { assistanceTypeSubs?.unsubscribe(); }, 250);
    });
  }

  settingAssistanceTypesObject(assistanceTypes: Array<AssistanceType>) {
    this.check_in_object = assistanceTypes.filter(x => x.idTipoAsistencia === 1)[0];
    this.check_partial_title = assistanceTypes.filter(x => x.idTipoAsistencia === 2).map(y => y.tipoAsistencia)[0];
    this.check_partial_object = assistanceTypes.filter(x => x.idTipoAsistencia !== 1 && x.idTipoAsistencia !== 4);
    this.check_out_object = assistanceTypes.filter(x => x.idTipoAsistencia === 4)[0];
  }

  async validateStatusWordDay() {
    const connection = await this.internetService.getNetWorkStatus();
    const { idJornada, idPdv } = this.salespointSelected;
    const assistancesDb = await this.tableWorkdayAssistanceService.getAssistanceWorkday(this.activeCampaign.idCampania, idJornada, idPdv);

    if (!connection.connected) {
      this.settingCalendarAssistance(assistancesDb);
      this.infoPDV = await this.tableWorkdayAssistanceService.getInformacionPdv(this.salespointSelected.idPdv)
      setTimeout(() => { this.isLoading = false; this.loadingService.stop(); }, 250);
      return;
    }

    const assistenceStatusSubs = this.assistanceService.getAracne3AssistancesForWorkDay(idJornada, idPdv).subscribe(async (response) => {
      if (response && response.length > 0) {
        // Guardamos las asistencias para la funcionalidad offline
        const assistances = response.map(x => ({ ...x, idCampania: this.activeCampaign.idCampania }));
        await this.tableWorkdayAssistanceService.addAssistanceWorkday(assistances);

        this.settingCalendarAssistance(response);
      } else {
        // Intentamos setear los objetos offline
        this.settingCalendarAssistance(assistancesDb);
      }

      setTimeout(() => { assistenceStatusSubs?.unsubscribe(); this.isLoading = false; this.loadingService.stop(); }, 250);
    });
  }

  settingCalendarAssistance(assistances: Array<AssistanceWorkResponse>) {
    assistances.forEach(item => {
      const checkInAssistance: CalendarAssistance = {
        assistanceType: item.idTipoAsistencia,
        comments: null,
        photo: null,
        dateMarked: item.fechaHora
      };
      this.store.dispatch(setCalendarAssistance({ calendarAssistance: checkInAssistance }));
    });
  }

  // Assistance Register
  async onCheckIn() {
    if (this.check_in_marked) {
      return;
    }

    this.check_in_marked = true;
    this.check_in_marked_loading = true;
    this.onRegisteredAssistanceWork(1);
  }

  async onCheckInPartial() {
    if (!this.check_in_marked || this.check_partial_marked || this.check_partial_marked_final || this.check_out_marked) {
      return;
    }

    this.check_partial_marked = true;
    this.check_partial_marked_hour = '00:00:00';
    this.check_partial_marked_loading = true;
    this.onRegisteredAssistanceWork(2);
  }

  runTimmerPartialCheckIn(initialTime: Array<number> = []) {
    this.startedTimer$.next();

    let d = new Date();
    if (initialTime.length > 0) {
      d.setHours(initialTime[0], initialTime[1], initialTime[2], initialTime[3]);
    } else {
      d.setHours(0, 0, 0, 0);
    }

    this.timerSubs = interval(1000).pipe(
      takeUntil(this.startedTimer$),
      map(() => {
        d = moment(d).add(1, 'seconds')['_d'];
        return moment(d).add().format('HH:mm:ss');
      })).subscribe(cd => this.check_partial_marked_hour = cd.toString());


    this.check_partial_marked = true;
    this.check_partial_title = 'En descanso...';
    this.check_partial_inprogress = true;
  }

  async onStopIntervalCheckInPartial() {
    if (this.check_partial_marked_final) {
      return;
    }

    this.check_partial_marked_final = true;
    const confirmAssistance = await this.showAlertConfirmAssistance('Fin del descanso', '¿Seguro que desea finalizar el descanso?', 'alert_check_partial.svg');

    if (confirmAssistance) {
      this.onRegisteredAssistanceWork(3);
    } else {
      this.check_partial_marked_final = false;
    }
  }

  async onCheckOut() {
    this.loading = true;

    if (this.selectCheckOutJornada === undefined) {
      this.toastAlertService.warning("Es necesario seleccionar como estuvo su visita")
      return;
    }

    if (this.check_out_marked || !this.check_in_marked || (this.check_partial_object.length > 0 && this.check_partial_marked && !this.check_partial_marked_final)) {
      return;
    }

    this.check_out_marked = true;
    this.check_out_marked_loading = true;

    const confirmAssistance = await this.showAlertConfirmAssistance('Finalizar asistencia', '¿Seguro de finalizar su asistencia de esta visita?', 'check_out.svg');

    if (confirmAssistance) {
      if (this.fileCheckout) {
        const blob = new Blob([this.fileCheckout], { type: this.fileCheckout.type })
        const fileData: Array<FileWriteData> = [{
          identifer: this.fileCheckout.name.split('.')[0],
          fileBlob: blob
        }]
        const filePathData = await this.fileUploadService.writeFiles(fileData);

        const fileServer = await this.fileUploadService.uploadFileAracne3(this.activeCampaign.bbddCampania.replace(/_/g, ''), 'CancelarJornada', filePathData[0].filePath, this.fileCheckout.name.split('.')[0], "")

        this.idFileMotivoCheckOut = fileServer.idFileBlob
      }

      await this.onRegisteredAssistanceWork(4).then(() => {
        this.loading = false
        this.isOpenModalCancel = false;
        this.selectCheckOutJornada = null;
      });

      if (this.isCheckout == true) {
        this.toastAlertService.success("Se registro el Check-out correctamente")
        setTimeout(() => {
          this.router.navigate(['main', 'calendario']);
        }, 250);
      }
    } else {
      await this.resolveUIErrorAssitance(4);
    }
  }

  async onRegisteredAssistanceWork(assistanceType: number) {
    const momentDay = moment();
    const thisTimeDateMoment = momentDay.toDate();
    const thisTimeMoment = momentDay.format('YYYY-MM-DDTHH:mm:ss');

    if (this.check_partial_inprogress) {
      this.check_partial_hour_keeper = this.check_partial_marked_hour.split(':').map(x => parseInt(x));
    }

    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      this.resolveUIErrorAssitance(assistanceType);
      this.alertService.showAlert('no_wifi.svg', '¡Sin conexión a internet!', `Por favor, verificar su conexión y volver a intentarlo.`);
      return;
    }

    if (assistanceType === 4) {
      const listWorkdayForms = await this.tableFormService.getFormListCollection(this.activeCampaign.idCampania, this.salespointSelected.idJornada, this.salespointSelected.idPdv, []);

      if (listWorkdayForms.some(x => x.obligatorio && !x.isCompleted) && !this.userReporterConfig) {
        this.resolveUIErrorAssitance(assistanceType);
        this.isCheckout = false;
        this.alertService.showAlert('uncompleted_form.svg', 'Sin respuestas', 'Existen formularios obligatorios que no han sido completados');
        return;
      } else {
        this.isCheckout = true;
      }
    }

    const batteryLevel = await this.batteryService.getBatterryStatus();
    const batteryLevelValue = (batteryLevel < 1 ? parseInt((batteryLevel * 100).toFixed(0)) : batteryLevel);

    const geopositionPromise: Position = await this.locationService.getGeoposition();

    if (geopositionPromise == null) {
      this.resolveUIErrorAssitance(assistanceType);
      this.alertService.showAlert('not_geolocation.svg', '¡Sin señal de GPS!', 'Debe permitir el uso de localización y activar el GPS para poder continuar.');
      return;
    }

    const currentAddressPromise: AddressCollection = await this.locationService.getCurrentAddress(geopositionPromise.coords.latitude, geopositionPromise.coords.longitude);

    const distanceRequired: number = this.salespointSelected.distancia;
    const distancePosition = await this.locationService.getGeopositionDistance(
      {
        latitude: this.salespointSelected.latitud,
        longitude: this.salespointSelected.longitud
      },
      {
        latitude: currentAddressPromise.latitude,
        longitude: currentAddressPromise.longitude
      });

    let checkoutNoObligatorio: boolean = false; // por defecto es false

    if (assistanceType === 4) {
      //Verificamos si tiene un checkout no obligatorio
      //Si tiene un checkout no obligatorio, puedo hacer un checkout sin sin la distancia requerida
      let configAssisanceResponse = await this.assistanceService.getAracne3AssistanceTypeCheckConfig().toPromise();

      if (configAssisanceResponse && configAssisanceResponse.length > 0) {
        const checkOutNoObligatorioConfig = configAssisanceResponse.find(
          (x) => x.idConfigCampaña === ASSISTANCE_CONFIG_CAMPAING.CHECKOUT_NO_BLIGATORIO);
        checkoutNoObligatorio = checkOutNoObligatorioConfig ? checkOutNoObligatorioConfig.activo : false;
      }
    }

    if (!checkoutNoObligatorio) {
      if (!this.userReporterConfig && distancePosition > distanceRequired) {
        this.resolveUIErrorAssitance(assistanceType);
        this.alertService.showAlert('outside_map.svg', '¡Geolocalización distante!', `Asegúrese de estar al menos a ${distanceRequired} metros del punto de venta.`);
        return;
      }
    }

    const requestAssistance: AssistanceWorkRequest = {
      idJornada: this.salespointSelected.idJornada,
      idPdv: this.salespointSelected.idPdv,
      idTipoAsistencia: assistanceType,
      fechaHora: thisTimeMoment,
      latitud: currentAddressPromise.latitude.toString(),
      longitud: currentAddressPromise.longitude.toString(),
      direccionGoogle: currentAddressPromise.address,
      observaciones: '',
      foto: '',
      nivelBateria: (batteryLevel ? batteryLevelValue : null),
      distanciaPdv: parseInt(distancePosition.toFixed(2)),
      ubicacionFalsa: '',
      esAutomatico: false,
      usCreacion: parseInt(this.userAuth.uid),
      idMotivoCheckout: this.selectCheckOutJornada,
      idFileMotivoCheckout: this.idFileMotivoCheckOut
    };

    const assistanceRegisterSubs = this.assistanceService.postAracne3AssistanceRegister(requestAssistance).subscribe(async (response) => {
      if (response && response.statusCode === 200) {
        // Guardamos las asistencias para la funcionalidad offline
        await this.databaseImportService.importAssistenceStatus(this.activeCampaign.idCampania, this.salespointSelected.idJornada, [this.salespointSelected.idPdv]);

        if (assistanceType === 1) {
          const presentRolId: number = (this.userReporterConfig ? this.userReporterConfig.idRol : this.activeCampaign.idRol);
          const presentUserId: number = (this.userReporterConfig ? this.userReporterConfig.idUsuario : parseInt(this.userAuth.uid));

          await this.databaseImportService.importNormalForms(this.activeCampaign.idCampania, presentRolId,
            [{ id: this.salespointSelected.idPdv, name: this.salespointSelected.nombrePdv }]);
          await this.databaseImportService.importWorkdayForms(this.activeCampaign.idCampania, presentUserId, presentRolId,
            this.salespointSelected.idJornada, [{ id: this.salespointSelected.idPdv, name: this.salespointSelected.nombrePdv }]);
          await this.databaseImportService.importFilterDependencyTheme(5, this.activeCampaign.idCampania);

          this.isActivePDV = true;
          this.toastAlertService.success("Se inicio la sistencia correctamente")
        }

        // Solo para descanso una vez confirmada el registro corre el cronometro
        if (assistanceType === 2) {
          this.runTimmerPartialCheckIn();
          this.toastAlertService.success("Se inicio el descanso correctamente")
        }

        if (assistanceType === 3) {
          this.startedTimer$.complete();
          this.timerSubs?.unsubscribe();
          this.check_partial_inprogress = false;
          this.check_partial_marked_final = true;
          this.check_partial_title = this.check_partial_object.filter(x => x.idTipoAsistencia == 3).map(y => y.tipoAsistencia)[0];
          this.toastAlertService.success("Se termino el descanso correctamente")
        }

        const assistanceMarked: CalendarAssistance = {
          assistanceType,
          comments: null,
          photo: null,
          dateMarked: thisTimeDateMoment
        };
        this.store.dispatch(setCalendarAssistance({ calendarAssistance: assistanceMarked }));

        // Auditoria de nivel de batería
        this.auditoriaService.putUpdateBatteryLevel(parseInt(this.userAuth.uid), requestAssistance.nivelBateria);

      } else {
        this.resolveUIErrorAssitance(assistanceType);
        this.alertService.showAlert(null, 'Ocurrio un error', response.response);
      }
      assistanceRegisterSubs?.unsubscribe();
    });
  }

  resolveUIErrorAssitance(assistanceType: number) {
    switch (assistanceType) {
      case 1:
        this.check_in_marked = false;
        this.check_in_marked_loading = false;
        this.isActivePDV = false;
        break;
      case 2:
        this.check_partial_marked = false;
        this.check_partial_marked_loading = false;
        break;
      case 3:
        const partialHourKeeper = this.check_partial_hour_keeper;
        this.runTimmerPartialCheckIn([partialHourKeeper[0], partialHourKeeper[1], partialHourKeeper[2], 0]);
        this.check_partial_marked_final = false;
        this.check_partial_marked_loading = false;
        break;
      case 4:
        this.check_out_marked = false;
        this.check_out_marked_loading = false;
        break;
      default:
        break;
    }
  }

  async showAlertConfirmAssistance(header: string, message: string, icon: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        mode: 'ios',
        header,
        message,
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              alert.onDidDismiss().then(_ => resolve(false));
            }
          },
          {
            text: 'Sí',
            role: 'confirm',
            handler: () => {
              alert.onDidDismiss().then(_ => resolve(true));
            }
          }
        ]
      });

      alert.present();

      let alertIconHtml = document.createElement("img");
      alertIconHtml.src = `../../../assets/svg/${icon}`;
      alertIconHtml.style.maxWidth = '75px';
      alertIconHtml.style.marginTop = '1rem';

      let alertHtml = document.getElementsByClassName('alert-wrapper')[0];
      alertHtml.insertAdjacentElement('afterbegin', alertIconHtml);
      alertHtml.setAttribute('style', 'align-items: center;');
    });
  }

  async onShowModalCancelacion(item) {
    const connection = await this.internetService.getNetWorkStatus();
    if (!connection.connected) {
      setTimeout(() => {
        this.isLoading = false;
        this.alertService.showAlert('no_wifi.svg', '¡Sin conexión a internet!', `No hay conexión a Internet.\r\ Por favor, verificar su conexión.`);
      }, 250);
      return;
    }

    this.jornadaItem = item;
    this.isOpenModalCancel = true;
    if (this.motivoCancelacion.length == 0) {
      this.getMotivoCancelacion();
    }
  }

  async onCancelSalespoint() {
    if (this.selectCacenlarJornada == undefined || this.selectCacenlarJornada == null) {
      this.toastAlertService.warning("Seleccione un motivo de cancelación")
      return;
    }

    this.loading = true;
    let idFileMotivoCancelacion
    if (this.fileCancelarMotivo) {
      const blob = new Blob([this.fileCancelarMotivo], { type: this.fileCancelarMotivo.type })

      const fileData: Array<FileWriteData> = [{
        identifer: this.fileCancelarMotivo.name.split('.')[0],
        fileBlob: blob
      }]
      const filePathData = await this.fileUploadService.writeFiles(fileData);

      const fileServer = await this.fileUploadService.uploadFileAracne3(this.activeCampaign.bbddCampania.replace(/_/g, ''), 'CancelarJornada', filePathData[0].filePath, this.fileCancelarMotivo.name.split('.')[0], "")

      idFileMotivoCancelacion = fileServer.idFileBlob
    }

    let data: CancelarJornadas = {
      idJornada: [this.jornadaItem.idJornada],
      idPV: [this.jornadaItem.idPdv],
      idMotivoCancelacion: this.selectCacenlarJornada,
      idUsuario: parseInt(this.userAuth.uid),
      idFileMotivoCancelacion: idFileMotivoCancelacion
    }

    this.formularioJornadasService.postCancelarJornada(data).subscribe((res: any) => {
      this.store.dispatch(setSalespointSelected({ salespointSelected: null }));
      this.isOpenModalCancel = false;
      this.selectCacenlarJornada = null;

      this.toastAlertService.success(res.response)
      this.loading = false;
      setTimeout(() => {
        this.router.navigate(['main', 'calendario']);
      }, 10);

    }, (err) => {
      this.toastAlertService.warning("Ocurrió un error al cancelar la jornada en el pdv.")
    })
  }

  getMotivoCancelacion() {
    let data: MasterdataRequest = {
      tableName: "M_Motivo_Cancelacion",
      identifier: "idMotivoCancelacion",
      descriptor: "MotivoCancelacion",
      where: "Activo = 1",
      orderBy: "idMotivoCancelacion",
    }
    this.masterDataService.getMasterDataByDynamicRequestType(data).subscribe((res) => {
      this.motivoCancelacion = res;
    })
  }

  loadImageCheckout($event) {
    this.fileCheckout = $event.target.files[0];
    this.labelFileCheckout = this.fileCheckout.name
  }

  loadImageCancelar($event) {
    this.fileCancelarMotivo = $event.target.files[0];
    this.labelFileCancelar = this.fileCancelarMotivo.name
  }

  async onModalCheckOut() {
    const connection = await this.internetService.getNetWorkStatus();
    if (!connection.connected) {
      setTimeout(() => {
        this.isLoading = false;
        this.alertService.showAlert('no_wifi.svg', '¡Sin conexión a internet!', `No hay conexión a Internet.\r\ Por favor, verificar su conexión.`);
      }, 250);
      return;
    }
    if (this.check_out_marked || !this.check_in_marked || (this.check_partial_object.length > 0 && this.check_partial_marked && !this.check_partial_marked_final)) {
      return;
    }
    this.isOpenModalCancel = true;
    if (this.motivoCheckout.length == 0) {
      this.getMotivoCheckout();
    }
  }

  getMotivoCheckout() {
    let data: MasterdataRequest = {
      tableName: "M_Motivo_Checkout_Pdv",
      identifier: "idMotivoCheckout",
      descriptor: "motivoCheckout",
      where: "Activo = 1",
      orderBy: "idMotivoCheckout",
    }
    this.masterDataService.getMasterDataByDynamicRequestType(data).subscribe((res) => {
      this.motivoCheckout = res;
    })
  }

  async init() {
    try {
      const permissions = await BackgroundRunner.requestPermissions({
        apis: ['notifications', 'geolocation'],
      });
      console.log('permissions', permissions);
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }
  user: any = null;
  // Test the background fetch
  async performBackgroundFetch() {
    const result = await BackgroundRunner.dispatchEvent({
      label: 'com.aracnereport.aracne3.check',
      event: 'fetchTest',
      details: {},
    });
    console.log("result",result)
    this.user = result;
  }

  // Schedule a notification from background
  async scheduleNotification() {
    await BackgroundRunner.dispatchEvent({
      label: 'com.aracnereport.aracne3.check',
      event: 'notificationTest',
      details: {},
    });
  }

  // Test the KV Store
  async testSave() {
    const result = await BackgroundRunner.dispatchEvent({
      label: 'com.aracnereport.aracne3.check',
      event: 'testSave',
      details: {},
    });
    console.log('save result', result);
  }

  async testLoad() {
    const result = await BackgroundRunner.dispatchEvent({
      label: 'com.capacitor.background.check',
      event: 'testLoad',
      details: {},
    });
    console.log('load result', result);
  }

  requestPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('resp geo', resp);
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => { 
      console.log('Error getting location', error);
     });}

  async newRequest() {
    let watch = this.geolocation.watchPosition();
  
    watch.subscribe(async (data:any) => {
      const { latitude, longitude } = data.coords; 
  
      // Invocar servicio
    // await this.invokeJornadasService();
  
      // Notificar ubicación
      this.notifyLocation(latitude, longitude);
    });
     
    console.log('watch', watch);
   
    LocalNotifications.addListener('localNotificationActionPerformed', async (notification) => {
      console.log('notification.........', notification);
      if (notification.actionId === 'tap') {
        const data = notification.notification.extra?.data;
        console.log('data notificacion', data);
        if (data) {
          const { title, message } = data;
          this.alertService.showAlert('ic_notification_color.svg', title, message);
        }
      }
    });
  }
  
  private async invokeJornadasService() {
    let dataPrueba = {
      usuario:135298,
      idJornada: 338
    }
    //parseInt(this.userAuth.uid), this.salespointSelected.idJornada
    this.jornadasService.getEnvioCorreoGeoPermanencia(dataPrueba.usuario, dataPrueba.idJornada)
      .subscribe(res => {
        console.log("Respuesta del servicio:", res);
      });
  }
  
  private notifyLocation(latitude: number, longitude: number) {
    const title = "Notificación de Aracne";
    const message = `${latitude} ${longitude}`;
    const notificationData = {
      title: title,
      message: message
    };
  
    LocalNotifications.schedule({
      notifications: [{
        smallIcon: 'notification_icon',
        largeIcon: 'notification_icon',
        title: title,
        body: message,
        id: 1,
        extra: {
          data: notificationData
        },
        schedule: {
          every: "minute",
          count: 1
        }
      }]
    });
  } 
}
