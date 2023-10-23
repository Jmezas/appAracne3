import { Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertController, IonAccordionGroup, MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import { setMainRouteBackAction, tapMenuSelectedAction } from '../../../../store/actions/menu.action';
import { formValidToCompleted } from '../../../../store/actions/form.action';
import { unSetCalendarAssistance } from '../../../../store/actions/assistance.action';
import { clearSalespointSelected } from '../../../../store/actions/salespoint.action';

import { TableUserService } from '../../../../services/database/table-user.service';
import { TableFormService } from '../../../../services/database/table-form.service';
import { TableNormalFormService } from '../../../../services/database/table-normal-form.service';
import { DatabaseImportService } from '../../../../services/database/database-import.service';
import { DatabaseFormSyncService } from '../../../../services/database/database-form-sync.service';
import { FormularioJornadasService } from '../../../../services/API/formulario-jornadas.service';
import { FormularioService } from '../../../../services/API/formulario.service';
import { CampaingService } from '../../../../services/STORE/campaing.store.service';
import { FileUploadService } from '../../../../services/API/file-upload.service';
import { BatterryService } from '../../../../services/batterry.service';
import { InternetConnectionService } from '../../../../services/internet-connection.service';
import { CameraService } from '../../../../services/native/camera.service';
import { LoadingService } from '../../../../services/UI/loading.service';
import { AlertService } from '../../../../services/UI/alert.service';

import { User } from '../../../../shared/models/user.model';
import { UserCampaign } from '../../../../shared/models/user.interface';
import { IItemCampaign } from '../../../../shared/models/campaing.interface';
import { PdvsJornada } from '../../../../shared/models/jornada.interface';
import {
  DependencyThemeForm, DetalleTema, FilterDependencyThemeForm,
  FilterDependencyThemeFormOptions, FormThemeType, Formulario, FormularioImageResponse,
  FormularioJornada, FormularioRespuesta
} from '../../../../shared/models/formulario-jornada';
import {
  DataInsertReporteFormulario,
  FormularioLibre, FormularioLibreRequest, FormularioNormal,
  Respuesta, RespuestaImageResponse
} from '../../../../shared/models/formulario';
import { FileWriteData } from '../../../../shared/models/filetransfer-form.interface';
import { FORMS_ICON, APP_CONFIG, FileMimeType } from '../../../../shared/constants/values.constants';

import { Photo } from '@capacitor/camera';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

declare var window: any;

@Component({
  selector: 'app-tarea-form',
  templateUrl: './tarea-form.page.html',
  styleUrls: ['./tarea-form.page.scss'],
})
export class TareaFormPage implements OnInit, OnDestroy {
  @ViewChild('questionAccordion', { static: true }) accordionGroup: IonAccordionGroup;

  userAuth: User = null;
  userReporterIcon: string = 'assets/svg/user.svg';
  userReporterConfig: UserCampaign = null;
  activeCampaign: IItemCampaign = null;
  questionForm: FormGroup;
  salespointSelected: PdvsJornada = null;
  workDayFormSelected: FormularioJornada = null;
  normalFormSelected: FormularioNormal = null;
  formNameSelected: string = '';
  completedIcon: string = 'assets/svg/completed.svg';
  questionList: Array<DetalleTema> = [];
  questionNormalList: Array<FormularioLibre> = [];
  isWorkDayFormSelected: boolean = true;
  isEnabledNotPull: boolean = true;
  isLoadingForm: boolean = false;
  isCompletedValidToCompleted: boolean = false;
  isSaveNormalFormLoading: boolean = false;
  customAlertSelectOptions = {
    header: 'Seleccione',
    translucent: true,
  }
  lastAccessDate: Date = null;
  formFiltersKeeper: Array<DependencyThemeForm> = [];
  formFilters: Array<FilterDependencyThemeForm> = [];
  isEnabledFilterApply: boolean = true;
  isEnabledFinishForm: boolean = false;
  authUserSubs: Subscription;
  salespointSelectedSubs: Subscription;
  validFormSubs: Subscription;
  backgroundResumeSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private campaignService: CampaingService,
    private workDayFormService: FormularioJornadasService,
    private normalFormService: FormularioService,
    private tableUserService: TableUserService,
    private tableFormService: TableFormService,
    private tableNormalFormService: TableNormalFormService,
    private databaseImportService: DatabaseImportService,
    private databaseFormSync: DatabaseFormSyncService,
    private fb: FormBuilder,
    private router: Router,
    private alertCtrl: AlertController,
    private zone: NgZone,
    private loadingService: LoadingService,
    private internetService: InternetConnectionService,
    private cameraService: CameraService,
    private fileUploadService: FileUploadService,
    private batterryService: BatterryService,
    private alertService: AlertService,
    private menuFilterCtrl: MenuController,
    private platform: Platform,
    private domSanitizer: DomSanitizer) {
    this.questionForm = this.fb.group({});
  }

  ngOnInit() {
    this.settingArgs();
  }

  ionViewWillEnter() {
    this.isLoadingForm = true;
    this.loadingService.show('Cargando formulario...');
    this.lastAccessDate = moment().toDate();
    this.initFormPage();
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
          this.router.navigate(['main/calendario']);
        }
      }
    });

    // router in LIST_MENU_MAIN constant
    this.store.dispatch(setMainRouteBackAction({ routerBackId: 5 }));
    this.store.dispatch(tapMenuSelectedAction({ indexTab: 4 }));
  }

  ionViewDidLeave() {
    this.loadingService.stop();
    this.questionList = [];
    this.questionNormalList = [];
    this.isCompletedValidToCompleted = false;
    this.store.dispatch(formValidToCompleted({ validForm: false }));
    this.backgroundResumeSubs?.unsubscribe();
    this.validFormSubs?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.authUserSubs?.unsubscribe();
    this.salespointSelectedSubs?.unsubscribe();
  }

  async settingArgs() {
    this.activeCampaign = await this.campaignService.getActiveCampaing();

    this.authUserSubs = this.store.select('auth').subscribe(({ user }) => {
      if (user != null) {
        this.userAuth = user;
      }
    });

    this.salespointSelectedSubs = this.store.select('salespoint').subscribe(({ salespointSelected }) => {
      this.salespointSelected = salespointSelected;
    });
  }

  async initFormPage() {
    // Verificamos si tiene un configuración de usuario reporteador
    const keyAppConfig = APP_CONFIG.UserReporter;
    const config = await this.tableUserService.getAppUserConfigCollection(parseInt(this.userAuth.uid), this.activeCampaign.idCampania, keyAppConfig);
    this.userReporterConfig = (config.length > 0 ? JSON.parse(config[0].valueObject) : null);

    // Obtenemos el formulario seleccionado
    const formSelectedSubs = this.store.select('form').subscribe(({ formSelected, isWorkDayForm }) => {
      this.isWorkDayFormSelected = isWorkDayForm;

      if (formSelected != null) {
        if (isWorkDayForm) {
          const workDayForm: FormularioJornada = (formSelected) as FormularioJornada;
          this.workDayFormSelected = workDayForm;
          this.formNameSelected = workDayForm.nombreFormulario;
          this.getQuestionByForm();
        } else {
          const workDayForm: FormularioNormal = (formSelected) as FormularioNormal;
          this.normalFormSelected = workDayForm;
          this.formNameSelected = workDayForm.nombreFormulario;
          this.getQuestionByNormalForm();
        }
      }

      setTimeout(() => { formSelectedSubs?.unsubscribe(); }, 500);
    });


    this.validFormSubs = this.store.select('form').subscribe(({ validToCompleted }) => {
      if (validToCompleted && !this.isCompletedValidToCompleted) {
        this.isCompletedValidToCompleted = true;
        this.validFormAndBackToWorkList();
      }
    });
  }

  async refreshQuestionByForm(event, isWorkdayForm: boolean) {
    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      setTimeout(() => { event.target.complete(); }, 500);
      return;
    }

    this.isEnabledNotPull = true;

    if (isWorkdayForm) {
      this.questionFormOnline();
      setTimeout(() => { event.target.complete(); }, 2500);
      return;
    }

    this.questionNormalFormOnline();
    setTimeout(() => { event.target.complete(); }, 2500);
  }

  // Renderización de formulario jornada
  async getQuestionByForm() {
    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      this.questionFormOffline();
      return;
    }

    this.questionFormOnline();
  }

  async questionFormOnline() {
    // validar si existe el formulario registrado en la base de datos local
    const formListSQL = await this.tableFormService.getFormListCollection(this.activeCampaign.idCampania, this.salespointSelected.idJornada,
      this.salespointSelected.idPdv, [this.workDayFormSelected.idFormularioJornada]);
    const formSQL = await this.tableFormService.getFormCollection(this.activeCampaign.idCampania, this.salespointSelected.idJornada,
      this.salespointSelected.idPdv, [this.workDayFormSelected.idFormularioJornada]);

    const downloadPromises: Array<Promise<FileWriteData>> = [];

    const formSubs = this.workDayFormService.getCamposFormularioJornada(this.workDayFormSelected.idFormularioJornada).subscribe(async (formulario) => {
      if (formulario === null) {
        if (formSQL.length > 0) {
          this.renderQuestionForm(formSQL[0]);
          setTimeout(() => { formSubs?.unsubscribe(); }, 250);
          return;
        }

        setTimeout(() => {
          formSubs?.unsubscribe();
          this.isEnabledNotPull = false;
          this.isLoadingForm = false;
          this.loadingService.stop();
          this.alertService.showAlert('uncompleted_form.svg', '¿Sin Preguntas?', 'Es posible que no haya cargado correctamente el formulario, intente conectándose a internet y refresque esta vista, deslizando hacia abajo.');
        }, 250);
      }

      const formIcon = FORMS_ICON[formListSQL[0].temaFormulario];
      // agregamos valores a los objetos faltantes
      formulario.idJornada = this.salespointSelected.idJornada;
      formulario.idPdv = this.salespointSelected.idPdv;
      // validamos si el formulario tiene imagen de tema
      formulario.detalleTema.forEach(item => {
        if (item.imagenTema !== null && item.imagenTema.trim() !== '') {
          downloadPromises.push(this.fileUploadService.downloadFileTemaAracne3(item.idDetalleTema, item.imagenTema));
        } else {
          item.imagenTema = formIcon;
        }
      });

      if (downloadPromises.length === 0) {
        this.saveFormInDatabase(formulario);
        this.renderQuestionForm(formulario);
        setTimeout(() => { formSubs?.unsubscribe(); }, 250);
        return;
      }

      // obtenemos las imagenes del tema
      await this.downloadFileThemes(downloadPromises)
        .then(async (result) => {
          const resultSuccess = result.filter(x => x.identifer !== null);
          const resultNullable = result.filter(x => x.identifer === null);

          // Si ocurre un error de descarga asignamos el icono del tema como imagen del tema.
          resultNullable.forEach(item => {
            const index = formulario.detalleTema.findIndex(x => x.idDetalleTema == item.identifer);
            formulario.detalleTema[index].imagenTema = formIcon;
          });

          if (resultSuccess.length > 0) {
            await this.fileUploadService.writeFiles(resultSuccess)
              .then(async (fileUrl) => {
                this.zone.run(() => {
                  fileUrl.forEach(file => {
                    const index = formulario.detalleTema.findIndex(x => x.idDetalleTema == file.identifer);

                    if (index != -1) {
                      const webViewUrl = window.Ionic.WebView.convertFileSrc(file.filePath);
                      formulario.detalleTema[index].imagenTema = webViewUrl;
                    }
                  });

                  this.saveFormInDatabase(formulario);
                  this.renderQuestionForm(formulario);
                });
              })
              .catch(error => {
                this.saveFormInDatabase(formulario);
                this.renderQuestionForm(formulario);
              });

            setTimeout(() => { formSubs?.unsubscribe(); }, 250);
          }
        });
    });
  }

  async questionFormOffline() {
    const formSQL = await this.tableFormService.getFormCollection(this.activeCampaign.idCampania, this.salespointSelected.idJornada, this.salespointSelected.idPdv, [this.workDayFormSelected.idFormularioJornada]);

    if (formSQL.length == 0) {
      setTimeout(() => {
        this.isEnabledNotPull = false;
        this.isLoadingForm = false;
        this.loadingService.stop();
        this.alertService.showAlert('uncompleted_form.svg', '¿Sin Preguntas?', 'Es posible que no haya cargado correctamente el formulario, intente conectándose a internet y refresque esta vista, deslizando hacia abajo.');
      }, 250);
      return;
    }

    this.renderQuestionForm(formSQL[0]);
  }

  saveFormInDatabase(formulario: Formulario) {
    // agregamos el formulario a la base de datos local para su uso en modo offline
    const requestTableSQL: Array<Formulario> = [];
    formulario.campaignId = this.activeCampaign.idCampania;
    setTimeout(() => {
      requestTableSQL.push(formulario);
      setTimeout(() => { this.tableFormService.addFormDetailCollection(requestTableSQL); }, 250);
    }, 250);
  }

  renderQuestionForm(formulario: Formulario) {
    Object.keys(this.questionForm.value).forEach(key => {
      this.questionForm.removeControl(key);
    });

    // isVisible: sirve para ocultar o hace visible el campoDetalleTema y aplicar para los filtros
    this.questionList = formulario.detalleTema.map(x => ({ ...x, isVisible: true }));

    const formStructure = this.questionList.map(x => x.campos).reduce((prv, acc) => {
      const campo = acc.map(x => ({ ...x }));
      prv.push(...campo);
      return prv;
    }, []);

    for (let control of formStructure) {
      const newFormControl = new FormControl();

      if (control.obligatorio) {
        newFormControl.setValidators(Validators.required);
        newFormControl.setValue((control.idTipoCampo == 4 || control.idTipoCampo == 9 ? false : null))
      }

      this.questionForm.addControl(control.idControl, newFormControl);
    }

    this.validateAnswers();
    this.getFilterForms(formulario.idTemaFormulario);
  }

  async validateAnswers() {
    const { idJornada, idPdv } = this.salespointSelected;
    const { idFormularioJornada } = this.workDayFormSelected;
    const answersSQL = await this.tableFormService.getAnswersFormById(this.activeCampaign.idCampania, idJornada, idPdv, idFormularioJornada);

    answersSQL.forEach(item => {
      const index = this.questionList.findIndex(x => x.idDetalleTema == item.idDetalleTema);
      const indexControl = this.questionList[index].campos.findIndex(x => x.idControl == item.idControl);
      const typeControl = this.questionList[index].campos.filter(x => x.idControl == item.idControl).map(y => y.idTipoCampo)[0];

      switch (typeControl) {
        // input text
        case 1:
          this.questionForm.controls[item.idControl].setValue(item.valor[0]);
          break;
        // input date
        case 2:
          this.questionForm.controls[item.idControl].setValue(item.valor[0]);
          break;
        // input number
        case 3:
          this.questionForm.controls[item.idControl].setValue(item.valor[0]);
          break;
        // input checkbox
        case 4:
          const value4 = (item.valor[0] == 'true' ? true : false);
          this.questionForm.controls[item.idControl].setValue(value4);
          break;
        // input select
        case 5:
          this.questionForm.controls[item.idControl].setValue(parseInt(item.valor[0]));
          break;
        // input textarea
        case 6:
          this.questionForm.controls[item.idControl].setValue(item.valor[0]);
          break;
        // input select multiple
        case 7:
          const value7 = item.valor.map(str => { return Number(str); });
          this.questionForm.controls[item.idControl].setValue(value7);
          break;
        // input file
        case 8:
          this.questionList[index].campos[indexControl].imageUploadUrl = item.valueFileUploadUrl;
          break;
        // input select checkbox
        case 9:
          this.questionForm.controls[item.idControl].setValue(item.valor[0]);
          break;
        default:
          break;
      }

      this.questionList[index].isCompleted = true;
    });

    this.isEnabledNotPull = false;
    this.isLoadingForm = false;

    setTimeout(() => {
      const answersNull = answersSQL.filter(x => x.valor.some(s => s === "null"));

      answersNull.forEach(item => {
        const index = this.questionList.findIndex(x => x.idDetalleTema == item.idDetalleTema);
        const indexControl = this.questionList[index].campos.findIndex(x => x.idControl == item.idControl);
        this.questionList[index].campos[indexControl].visible = false;
      });

      this.loadingService.stop();
    }, 250);
  }

  async downloadFileThemes(promises: Array<Promise<FileWriteData>>): Promise<Array<FileWriteData>> {
    return new Promise(async (resolve, reject) => {
      await Promise.all(promises).then((response: Array<FileWriteData>) => resolve(response));
    });
  }

  // Filtros
  async getFilterForms(themeFormId: number) {
    this.formFilters = [];
    this.formFiltersKeeper = [];
    this.isEnabledFinishForm = false;

    let dependencyTheme: Array<DependencyThemeForm> = [];
    const connection = await this.internetService.getNetWorkStatus();

    if (connection.connected) {
      // Importamos, por si hay cambios dentro de la configuración
      await this.databaseImportService.importFilterDependencyTheme(themeFormId, this.activeCampaign.idCampania);
    }
    // Obtenemos las dependencias aplicadas 
    const dependencyThemeFormDb = await this.tableFormService.getDependencyFormCollection(this.activeCampaign.idCampania);

    if (themeFormId != FormThemeType['CATEGORIA'] && themeFormId != FormThemeType['MARCA']) {
      dependencyTheme = dependencyThemeFormDb.filter(x => x.formThemeId < themeFormId && x.activoTemaDependencia);
    }

    const levelFilters = [
      { title: 'SUPERCATEGORIA', subtitle: 'SuperCategoría', identifier: 'idSuperCategoriaProducto' },
      { title: 'CATEGORIA', subtitle: 'Categoría', identifier: 'idCategoriaProducto' },
      { title: 'MARCA', subtitle: 'Marca', identifier: 'idMarca' },
      { title: 'LINEAPRODUCTO', subtitle: 'Linea de Producto', identifier: 'idLineaProducto' },
      { title: 'PRODUCTO', subtitle: 'Producto', identifier: 'idProducto' }
    ];

    if (dependencyTheme.length > 0) {
      this.formFiltersKeeper = dependencyTheme;

      levelFilters.forEach((item, index) => {
        let optionValues: Array<FilterDependencyThemeFormOptions> = [];
        const filter = dependencyTheme.filter(y => y.tipoTemaDependencia === item.title);

        if (filter.length > 0) {
          if (index === 0 || index === 2) {
            optionValues = filter.reduce((prev, curr) => {
              prev.push({ valueId: curr.idTemaDependencia, valueName: curr.nombreTemaDependencia });
              return prev;
            }, ([] as Array<FilterDependencyThemeFormOptions>));

          }

          this.formFilters.push({
            identifier: item.identifier,
            title: item.title,
            subtitle: item.subtitle,
            options: optionValues,
            valueSelected: null
          });
        }
      });

      this.isEnabledFilterApply = true;

      const dependencyApplied = await this.tableFormService.getDependencyFormApplyCollection(this.salespointSelected.idJornada, this.salespointSelected.idPdv, this.workDayFormSelected.idFormularioJornada);

      if (dependencyApplied.length > 0 && dependencyApplied.some(x => x.valueSelected != null)) {
        dependencyApplied.forEach((item, index) => {
          const indexFilter = levelFilters.findIndex(x => x.identifier === item.identifier);
          const event = { detail: { value: item.valueSelected } };
          setTimeout(() => {
            this.onSelectedFilterChange(item.identifier, indexFilter, event);
            if ((index + 1) === dependencyApplied.length) {
              setTimeout(() => { this.onFilterForm(); }, 250);
            }
          }, 500);
        });
      }
    }
  }

  openMenuFilters() {
    this.menuFilterCtrl.enable(true, 'formFilterMenu')
    this.menuFilterCtrl.open('formFilterMenu');
  }

  onSelectedFilterChange(identifier: string, index: number, event: any) {
    if (!event.detail.value || event.detail.value == '') {
      this.formFilters[index].valueSelected = null;
      return;
    }

    let filterChanges: Array<DependencyThemeForm> = [];
    let filterSecondary: Array<{ identifier: string, value: number }> = [];
    // Seteamos el valor seleccionado en el objeto 
    this.formFilters[index].valueSelected = parseInt(event.detail.value);
    this.formFilters.forEach((item, i) => {
      item.valueSelected = (i > index ? null : item.valueSelected);
      item.options = ((i > index && item.title === 'LINEAPRODUCTO') ? [] : item.options);
    });

    if (index + 1 < this.formFilters.length) {
      // Si el siguiente filtro es Marca pasar al index de LineaProducto  
      const indexData: number = (this.formFilters[index + 1].title === 'MARCA' ? 3 : (index + 1));
      // Se valida las dependencias secundarias
      const categoryFilter = this.formFilters.filter(x => x.title === 'CATEGORIA');
      const makeFilter = this.formFilters.filter(y => y.title === 'MARCA');
      // Verificamos los valores de las dependencias secundarias
      if (this.formFilters[index].title === 'CATEGORIA' || this.formFilters[index].title === 'MARCA') {
        filterSecondary = [
          { identifier: (categoryFilter.length > 0 ? categoryFilter[0].identifier : '-'), value: (categoryFilter.length > 0 ? categoryFilter[0].valueSelected : 0) },
          { identifier: (makeFilter.length > 0 ? makeFilter[0].identifier : '-'), value: (makeFilter.length > 0 ? makeFilter[0].valueSelected : 0) }
        ]
      }
      // Preparamos los filtros con o sin dependencia secundaria
      if (filterSecondary.length === 2 && filterSecondary[0].value != 0 && filterSecondary[1].value != 0) {
        filterChanges = this.formFiltersKeeper.filter(x => x.parametro1 === filterSecondary[0].identifier && x.valor1 === filterSecondary[0].value
          && x.parametro2 === filterSecondary[1].identifier && x.valor2 === filterSecondary[1].value);
      } else {
        filterChanges = this.formFiltersKeeper.filter(x => x.parametro1 === identifier && x.valor1 === event.detail.value);
      }
      // Aplicamos el filtro al siguiente nivel
      this.formFilters[indexData].options = filterChanges.reduce((prev, curr) => {
        prev.push({ valueId: curr.idTemaDependencia, valueName: curr.nombreTemaDependencia });
        return prev;
      }, ([] as Array<FilterDependencyThemeFormOptions>));
    }

    this.isEnabledFilterApply = !this.formFilters.some(x => x.valueSelected != null);
  }

  onFilterForm() {
    this.menuFilterCtrl.close('formFilterMenu');

    this.isLoadingForm = true;
    this.loadingService.show('Cargando formulario...');

    const filterSuperCategory = this.formFilters.filter(x => x.title === 'SUPERCATEGORIA' && x.valueSelected != null);
    const filterCategory = this.formFilters.filter(x => x.title === 'CATEGORIA' && x.valueSelected != null);
    const filterMarke = this.formFilters.filter(x => x.title === 'MARCA' && x.valueSelected != null);
    const filterProductLine = this.formFilters.filter(x => x.title === 'LINEAPRODUCTO' && x.valueSelected != null);

    const valueSuperCategory = (filterSuperCategory.length > 0 ? filterSuperCategory[0].valueSelected : 0);
    const valueCategory = (filterCategory.length > 0 ? filterCategory[0].valueSelected : 0);
    const valueMarke = (filterMarke.length > 0 ? filterMarke[0].valueSelected : 0);
    const valueProductLine = (filterProductLine.length > 0 ? filterProductLine[0].valueSelected : 0);

    this.questionList = this.questionList.map(x => ({ ...x, isVisible: false }));

    setTimeout(() => {
      this.questionList.forEach(item => {
        const applySupercategory = (item.idSuperCategoria === (valueSuperCategory != 0 ? valueSuperCategory : item.idSuperCategoria) ? true : false);
        const applyCategory = (item.idCategoria === (valueCategory != 0 ? valueCategory : item.idCategoria) ? true : false);
        const applyMarke = (item.idMarca === (valueMarke != 0 ? valueMarke : item.idMarca) ? true : false);
        const applyProductLine = (item.idLineaProducto === (valueProductLine != 0 ? valueProductLine : item.idLineaProducto) ? true : false);

        if ((applySupercategory && applyCategory && applyMarke && applyProductLine) || item.idDetalleTema === 999) {
          item.isVisible = true;
        }
      });
    }, 500);

    setTimeout(async () => {
      this.isEnabledFinishForm = true;
      this.isLoadingForm = false;
      this.loadingService.stop();
      await this.tableFormService.addDependencyFormApplyTable(this.salespointSelected.idJornada, this.salespointSelected.idPdv, this.workDayFormSelected.idFormularioJornada, this.formFilters);
    }, 1500);
  }

  async onCleanFilterForm() {
    this.formFilters.forEach((item, i) => {
      item.valueSelected = null;
      item.options = ((item.title === 'LINEAPRODUCTO' || item.title === 'CATEGORIA') ? [] : item.options);
    });

    this.isEnabledFinishForm = false;
    this.questionList = this.questionList.map(x => ({ ...x, isVisible: true }));

    await this.tableFormService.addDependencyFormApplyTable(this.salespointSelected.idJornada, this.salespointSelected.idPdv, this.workDayFormSelected.idFormularioJornada, this.formFilters);
  }

  // Renderización de formulario asociado a pdv
  async getQuestionByNormalForm() {
    const connection = await this.internetService.getNetWorkStatus();

    if (!connection.connected) {
      this.questionNormalFormOffline();
      return;
    }

    this.questionNormalFormOnline();
  }

  async questionNormalFormOnline() {
    const normalFormSQL = await this.tableNormalFormService.getNormalFormDataCollection(this.activeCampaign.idCampania, this.normalFormSelected.idFormulario);

    if (normalFormSQL.length > 0) {
      this.renderQuestionNormalForm(normalFormSQL);
      return;
    }

    const formSubs = this.normalFormService.getFormularioById(this.normalFormSelected.idFormulario).subscribe(async (response: Array<FormularioLibre>) => {
      if (response.length > 0) {
        await this.tableNormalFormService.addNormalFormData(this.activeCampaign.idCampania, [response]);
        this.renderQuestionNormalForm(response);
      } else {
        setTimeout(() => {
          this.isSaveNormalFormLoading = false;
          this.isLoadingForm = false;
          this.loadingService.stop();
          this.alertService.showAlert('uncompleted_form.svg', '¿Sin Preguntas?', 'Es posible que no haya cargado correctamente el formulario, intente conectándose a internet y refresque esta vista, deslizando hacia abajo.');
        }, 250);
      }
      setTimeout(() => { formSubs?.unsubscribe(); }, 500);
    });
  }

  async questionNormalFormOffline() {
    const normalFormSQL = await this.tableNormalFormService.getNormalFormDataCollection(this.activeCampaign.idCampania, this.normalFormSelected.idFormulario);

    if (normalFormSQL.length == 0) {
      setTimeout(() => {
        this.isSaveNormalFormLoading = false;
        this.isLoadingForm = false;
        this.loadingService.stop();
        this.alertService.showAlert('uncompleted_form.svg', '¿Sin Preguntas?', 'Es posible que no haya cargado correctamente el formulario, intente conectándose a internet y refresque esta vista, deslizando hacia abajo.');
      }, 250);

      return;
    }

    this.renderQuestionNormalForm(normalFormSQL);
  }

  renderQuestionNormalForm(formulario: Array<FormularioLibre>) {
    Object.keys(this.questionForm.value).forEach(key => {
      this.questionForm.removeControl(key);
    });

    if (formulario.length > 0) {
      this.questionNormalList = formulario.map(x => ({ ...x, campos: x.campos.map(y => ({ ...y, imageUploadUrl: 'assets/svg/image_icon.svg', imageSendUrl: null })) }));

      const formStructure = this.questionNormalList.map(x => x.campos).reduce((prv, acc) => {
        const campo = acc.map(x => ({ ...x }));
        prv.push(...campo);
        return prv;
      }, []);

      for (let control of formStructure) {
        const newFormControl = new FormControl();

        if (control.obligatorio) {
          newFormControl.setValidators(Validators.required);
          newFormControl.setValue((control.idTipoCampo == 4 || control.idTipoCampo == 9 ? false : null))
        }

        this.questionForm.addControl(control.idControl, newFormControl);
      }
    } else {
      this.questionNormalList = [];
    }

    setTimeout(() => {
      this.isSaveNormalFormLoading = false;
      this.isLoadingForm = false;
      this.loadingService.stop();
    }, 250);
  }

  // Controles UI interacciones
  onChangeDate(event: any, controlId: string) {
    const date = moment(event.detail.value).format("DD/MM/YYYY");
    this.questionForm.controls[controlId].setValue(date);
  }

  onSelectedChange(controlId: string, event: any, themeDetailId?: number) {
    if (event.detail.value == null || event.detail.value == '' || Array.isArray(event.detail.value)) {
      return;
    }

    const indexThemeDetail = (themeDetailId != undefined ? this.questionList.findIndex(x => x.idDetalleTema == themeDetailId) : 0);

    const indexControl = (themeDetailId != undefined ?
      this.questionList[indexThemeDetail].campos.findIndex(x => x.idControl == controlId) :
      this.questionNormalList[indexThemeDetail].campos.findIndex(x => x.idControl == controlId));

    const fieldDependecy = (themeDetailId != undefined ?
      this.questionList[indexThemeDetail].campos[indexControl].opciones.filter(x => x.idValor == event.detail.value).map(y => y.idCampoDependenciaHijo)[0] :
      this.questionNormalList[indexThemeDetail].campos[indexControl].opciones.filter(x => x.idValor == event.detail.value).map(y => y.idCampoDependenciaHijo)[0]);

    const indexDependency = (fieldDependecy != null ?
      (themeDetailId != undefined ?
        this.questionList[indexThemeDetail].campos.findIndex(x => x.idCampo == fieldDependecy) :
        this.questionNormalList[indexThemeDetail].campos.findIndex(x => x.idCampo == fieldDependecy)) :
      null);

    // habilitamos el campo dependiente
    if (indexDependency != null) {
      if (themeDetailId != undefined) {
        this.questionList[indexThemeDetail].campos[indexDependency].visible = true;
      } else {
        this.questionNormalList[indexThemeDetail].campos[indexDependency].visible = true;
      }
    }

    // Validamos si tiene campos que dependen de la opción seleccionada para habilitarlos
    if (themeDetailId != undefined) {
      this.questionList[indexThemeDetail].campos[indexControl].opciones.forEach(item => {
        if (item.idCampoDependenciaHijo != null) {
          const indexNotDependency = this.questionList[indexThemeDetail].campos.findIndex(x => x.idCampo == item.idCampoDependenciaHijo);
          const dataCampo = this.questionList[indexThemeDetail].campos.filter(x => x.idCampo == item.idCampoDependenciaHijo);

          if (indexDependency != null && (indexDependency == indexNotDependency)) {
            return;
          }

          if (dataCampo[0].idTipoCampo == 4 || dataCampo[0].idTipoCampo == 9) {
            this.questionForm.controls[dataCampo[0].idControl].setValue(false);
          } else if (dataCampo[0].idTipoCampo == 8) {
            this.questionList[indexThemeDetail].campos[indexNotDependency].imageUploadUrl = 'assets/svg/image_icon.svg';
          } else {
            this.questionForm.controls[dataCampo[0].idControl].setValue(null);
          }

          this.questionList[indexThemeDetail].campos[indexNotDependency].visible = false;
        }
      });

      return;
    }

    this.questionNormalList[indexThemeDetail].campos[indexControl].opciones.forEach(item => {
      if (item.idCampoDependenciaHijo != null) {
        const indexNotDependency = this.questionNormalList[indexThemeDetail].campos.findIndex(x => x.idCampo == item.idCampoDependenciaHijo);
        const dataCampo = this.questionNormalList[indexThemeDetail].campos.filter(x => x.idCampo == item.idCampoDependenciaHijo);

        if (indexDependency != null && (indexDependency == indexNotDependency)) {
          return;
        }

        if (dataCampo[0].idTipoCampo == 4 || dataCampo[0].idTipoCampo == 9) {
          this.questionForm.controls[dataCampo[0].idControl].setValue(false);
        } else if (dataCampo[0].idTipoCampo == 8) {
          this.questionNormalList[indexThemeDetail].campos[indexNotDependency].imageUploadUrl = 'assets/svg/image_icon.svg';
        } else {
          this.questionForm.controls[dataCampo[0].idControl].setValue(null);
        }

        this.questionNormalList[indexThemeDetail].campos[indexNotDependency].visible = false;
      }
    });
  }

  async takeOrSelectPhoto(controlId: string, themeDetailId?: number) {
    const typeSourceSelect = await this.cameraService.onSelectSourceType();

    if (!typeSourceSelect) { return; }

    const isValidPermission = await this.cameraService.validStatusPermission(typeSourceSelect);

    if (!isValidPermission) {
      const isAccepted = await this.cameraService.requestPermission(typeSourceSelect);

      if (!isAccepted) { return; }
    }

    const photoResult = await this.cameraService.onPhotoSourceApply(typeSourceSelect);

    if (!photoResult) { return; }

    this.onProcessPhoto(controlId, themeDetailId, photoResult);
  }

  async onProcessPhoto(controlId: string, themeDetailId: number, photo: Photo) {
    let path: string = photo.path;

    const webPath: string = photo.webPath;
    const fileMimeType: string = FileMimeType[photo.format];
    const filePath = path.substring(path.lastIndexOf('/') + 1);
    const correctFileName = `${filePath.split('.')[0]}.${photo.format}`;

    const resultValid = await this.cameraService.validAndResizeImage(webPath, correctFileName, fileMimeType);

    if (resultValid.file) {
      const { filePath } = await this.fileUploadService.writeLocalFile({ name: resultValid.fileName, file: resultValid.file });

      if (!filePath) {
        this.alertService.showAlert(null, 'Ocurrio un error', 'Error al intentar procesar la imagen.');
        return;
      }

      path = filePath;
    }

    // Formulario Jornada
    if (themeDetailId != undefined) {
      const index = this.questionList.filter(x => x.idDetalleTema == themeDetailId)[0].campos.findIndex(x => x.idControl == controlId);

      this.zone.run(
        () => {
          this.questionList.filter(x => x.idDetalleTema == themeDetailId)[0].campos[index].imageUploadUrl = (this.platform.is('ios') ? this.domSanitizer.bypassSecurityTrustResourceUrl(webPath) : webPath);
          this.questionList.filter(x => x.idDetalleTema == themeDetailId)[0].campos[index].imageSendUrl = path;
        },
        (err) => console.log('ERROR CAMERA SET PICTURE', err)
      );

      return;
    }

    // Formularios Asignados a PDV
    const index = this.questionNormalList[0].campos.findIndex(x => x.idControl == controlId);

    this.zone.run(
      () => {
        this.questionNormalList[0].campos[index].imageUploadUrl = (this.platform.is('ios') ? this.domSanitizer.bypassSecurityTrustResourceUrl(webPath) : webPath);
        this.questionNormalList[0].campos[index].imageSendUrl = path;
      },
      (err) => { console.log('ERROR CAMERA SET PICTURE', err); }
    );
  }

  // Guardar respuestas formularios jornada
  async onSaveAnswers(themeDetailId: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const index = this.questionList.findIndex(x => x.idDetalleTema == themeDetailId);

      this.questionList[index].isSaveLoading = true;

      const thisTime: string = moment().format("YYYY-MM-DDTHH:mm:ss");
      const questionOfForm = this.questionList.filter(x => x.idDetalleTema == themeDetailId).map(y => y.campos)[0];

      // Validamos si contiene respuesta en los campos obligatorios
      let isIncompleted: boolean = false;

      questionOfForm.forEach(item => {
        const valueControl = this.questionForm.controls[item.idControl].value;
        const answer = (item.idTipoCampo === 8 ?
          (item.imageUploadUrl === 'assets/svg/image_icon.svg' ? null : item.imageUploadUrl) :
          ((typeof valueControl === 'string' && valueControl.trim() === '') ? null :
            ((Array.isArray(valueControl) && valueControl.length === 0 ? null : valueControl))));

        if (item.obligatorio && item.visible && answer == null) {
          isIncompleted = true;
        }
      });

      if (isIncompleted) {
        this.alertService.showAlert('uncompleted_form.svg', 'Formulario Incompleto', 'Debes ingresar las respuestas');
        this.questionList[index].isCompleted = false;
        this.questionList[index].isSaveLoading = false;
        return resolve(false);
      }

      // Construimos el arreglo con las respuestas
      const answersForm: Array<FormularioRespuesta> = [];
      const presentUserId: number = (this.userReporterConfig ? this.userReporterConfig.idUsuario : parseInt(this.userAuth.uid));

      questionOfForm.forEach(item => {
        const itemArray: string[] = (Array.isArray(this.questionForm.controls[item.idControl].value) ? this.questionForm.controls[item.idControl].value : [this.questionForm.controls[item.idControl].value]);

        const answerObject: FormularioRespuesta = {
          idFormularioJornada: this.workDayFormSelected.idFormularioJornada,
          idUsuario: presentUserId,
          idPdv: this.salespointSelected.idPdv,
          idJornada: this.salespointSelected.idJornada,
          fechaReporte: thisTime,
          idDetalleTema: themeDetailId,
          idControl: item.idControl,
          idCampo: item.idCampo,
          valor: (item.idTipoCampo === 8 ? (item.imageUploadUrl != 'assets/svg/image_icon.svg' ? [item.imageUploadUrl] : [null]) :
            ((item.idTipoCampo === 4 && itemArray.some(x => x == null || x == 'null')) ? ['false'] :
              itemArray.map(String))),
          valueFileUploadUrl: item.imageUploadUrl,
          valueFileSendUrl: ((item.idTipoCampo === 8 && item.imageUploadUrl != 'assets/svg/image_icon.svg') ?
            this.questionList.filter(x => x.idDetalleTema == themeDetailId)[0].campos.filter(y => y.idCampo == item.idCampo && y.idControl == item.idControl)[0].imageSendUrl :
            null),
          usCreacion: parseInt(this.userAuth.uid)
        }

        // agregamos las respuestas
        answersForm.push(answerObject);
      });

      const resultSaving: boolean = await this.savingAnswersForm(answersForm);
      resolve(resultSaving);
    });
  }

  async savingAnswersForm(answers: FormularioRespuesta[]): Promise<boolean> {
    const index = this.questionList.findIndex(x => x.idDetalleTema == answers[0].idDetalleTema);
    const fileUploadPromises = [];
    const connection = await this.internetService.getNetWorkStatus();

    // Si no hay conexion guardamos las respuestas tal cual sin enviar las archivos cargados.
    if (!connection.connected) {
      await this.tableFormService.addAnswers(this.activeCampaign.idCampania, answers);
      await this.validateIfFormIsCompleteToSyncronize(false);

      this.questionList[index].isCompleted = true;
      this.questionList[index].isSaveLoading = false;
      this.accordionGroup.value = undefined;
      return true;
    }

    // agregamos los archivos válidos para cargar al servidor
    answers.forEach(item => {
      if (item.valueFileSendUrl !== null) {
        fileUploadPromises.push(this.fileUploadService.sendFileFormularioJornadaAracne3(this.activeCampaign.bbddCampania.replace(/_/g, ''), 'formularioJornada', item));
      }
    });

    if (fileUploadPromises.length > 0) {
      const resultfileUpload = await this.saveFileFormularioJornadaAracne3(fileUploadPromises);

      if (resultfileUpload.length === 0 || resultfileUpload.some(x => x.success === false)) {
        this.alertService.showAlert(null, 'Ocurrio un error', 'Error al intentar cargar las imagenes.');
        this.questionList[index].isCompleted = false;
        this.questionList[index].isSaveLoading = false;
        return false;
      }

      // agregamos el id de la carga del archivo al objeto de tipo imagen
      resultfileUpload.forEach(item => {
        const answerIndex = answers.findIndex(x => x.idCampo === item.respuesta.idCampo && x.idControl === item.respuesta.idControl);
        answers[answerIndex].valor = [item.idFileBlob];
      });
    }

    await this.tableFormService.addAnswers(this.activeCampaign.idCampania, answers);
    const resultValidated = await this.validateIfFormIsCompleteToSyncronize(true);

    this.questionList[index].isCompleted = (resultValidated ? true : false);
    this.questionList[index].isSaveLoading = (resultValidated ? false : true);
    this.accordionGroup.value = (resultValidated ? undefined : this.accordionGroup.value);
    return resultValidated;
  }

  async saveFileFormularioJornadaAracne3(requestFileUpload: Array<any>): Promise<Array<FormularioImageResponse>> {
    let result: Array<FormularioImageResponse> = [];

    if (requestFileUpload.length > 0) {
      await Promise.all(requestFileUpload)
        .then((response: Array<FormularioImageResponse>) => {
          result = response;
        })
        .catch(error => console.log('SaveFileFormularioJornadaAracne3 Error', error));

      return result;
    }

    return result;
  }

  async validateIfFormIsCompleteToSyncronize(withConnection: boolean): Promise<boolean> {
    const collection = await this.tableFormService.getFormCollection(this.activeCampaign.idCampania, this.salespointSelected.idJornada, this.salespointSelected.idPdv, [this.workDayFormSelected.idFormularioJornada]);
    // Verificamos si el formulario al 100% completado de las preguntas visibles
    const isCompleted = ((collection.length > 0 && collection[0].detalleTema.length === collection[0].detalleTema.filter(x => x.isCompleted).length) ? true : false);

    if (isCompleted) {
      const { idJornada, idPdv } = this.salespointSelected;
      const { idFormularioJornada } = this.workDayFormSelected;

      if (!withConnection) {
        return await this.tableFormService.updateFormListCompleted(idJornada, idPdv, idFormularioJornada);
      }

      // Sincronizamos las respuestas del formulario con el api de formularios respuesta
      return await this.databaseFormSync.syncWorkDayFormById(false, idJornada, idPdv, idFormularioJornada);
    }

    return true;
  }

  async onFinishForm() {
    const alertView = await this.alertCtrl.create({
      mode: 'ios',
      header: '¿Finalizar formulario?',
      message: '¿Desea finalizar el formulario?',
      buttons: [
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: async () => {
            this.loadingService.show('Validando formulario...');

            const collection = await this.tableFormService.getFormCollection(this.activeCampaign.idCampania, this.salespointSelected.idJornada, this.salespointSelected.idPdv, [this.workDayFormSelected.idFormularioJornada]);
            // Verificamos si el formulario al 100% completado de las preguntas visibles
            const isCompletedForm = ((collection.length > 0 && collection[0].detalleTema.length === collection[0].detalleTema.filter(x => x.isCompleted).length) ? true : false);

            if (isCompletedForm) {
              setTimeout(() => {
                this.loadingService.stop();
                this.alertService.showAlert('workday_success.svg', 'Formulario Completo', 'El formulario está finalizado, puede regresar a las tareas.');
              }, 250);

              return;
            }

            let isIncompleted: boolean = false;
            const connection = await this.internetService.getNetWorkStatus();
            const { idJornada, idPdv } = this.salespointSelected;
            const { idFormularioJornada } = this.workDayFormSelected;

            const questionOfForm = this.questionList.filter(x => x.isVisible).map(y => y.campos).reduce((prev, curr) => {
              prev.push(...curr);
              return prev;
            }, []);

            // Validamos si contiene respuesta en los campos obligatorios
            questionOfForm.forEach(item => {
              const valueControl = this.questionForm.controls[item.idControl].value;
              const answer = (item.idTipoCampo === 8 ?
                (item.imageUploadUrl === 'assets/svg/image_icon.svg' ? null : item.imageUploadUrl) :
                ((typeof valueControl === 'string' && valueControl.trim() === '') ? null :
                  ((Array.isArray(valueControl) && valueControl.length === 0 ? null : valueControl))));

              if (item.obligatorio && item.visible && answer == null) {
                isIncompleted = true;
              }
            });

            if (isIncompleted) {
              setTimeout(() => {
                this.loadingService.stop();
                this.alertService.showAlert('uncompleted_form.svg', 'Formulario Incompleto', 'Debes ingresar las respuestas.');
              }, 250);

              return;
            }

            // Si no hay conexion guardamos las respuestas tal cual sin enviar las archivos cargados.
            if (!connection.connected) {
              await this.tableFormService.updateFormListCompleted(idJornada, idPdv, idFormularioJornada);

              setTimeout(() => {
                this.loadingService.stop();
                this.router.navigate(['main/tarea-list']);
              }, 250);

              return;
            }

            // Sincronizamos las respuestas del formulario con el api de formularios respuesta
            await this.databaseFormSync.syncWorkDayFormById(false, idJornada, idPdv, idFormularioJornada);

            setTimeout(() => {
              this.loadingService.stop();
              this.router.navigate(['main/tarea-list']);
            }, 250);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'purple'
        }
      ],
      backdropDismiss: false
    });

    alertView.present();

    let alertIconHtml = document.createElement("img");
    alertIconHtml.src = '../../../assets/svg/theme_form-outline.svg';
    alertIconHtml.style.maxWidth = '75px';
    alertIconHtml.style.marginTop = '1rem';

    let alertHtml = document.getElementsByClassName('alert-wrapper')[0];
    alertHtml.insertAdjacentElement('afterbegin', alertIconHtml);
    alertHtml.setAttribute('style', 'align-items: center;');
  }

  // Guardar respuestas formularios normales
  async onSaveNormalFormAnswers() {
    this.isSaveNormalFormLoading = true;

    const connection = await this.internetService.getNetWorkStatus();
    const questionOfForm = this.questionNormalList.map(y => y.campos)[0];

    let isIncompleted: boolean = false;

    questionOfForm.forEach(item => {
      const valueControl = this.questionForm.controls[item.idControl].value;
      const answer = (item.idTipoCampo === 8 ?
        (item.imageUploadUrl === 'assets/svg/image_icon.svg' ? null : item.imageUploadUrl) :
        ((typeof valueControl === 'string' && valueControl.trim() === '') ? null :
          ((Array.isArray(valueControl) && valueControl.length === 0 ? null : valueControl))));

      if (item.obligatorio && item.visible && answer == null) {
        isIncompleted = true;
      }
    });

    if (isIncompleted) {
      this.alertService.showAlert('uncompleted_form.svg', 'Formulario Incompleto', 'Debes ingresar las respuestas');
      this.isSaveNormalFormLoading = false;
      return;
    }

    let fileUploadPromises = [];
    let answersForm: Array<Respuesta> = [];

    questionOfForm.forEach(item => {
      const itemArray: string[] = (Array.isArray(this.questionForm.controls[item.idControl].value) ?
        this.questionForm.controls[item.idControl].value :
        [this.questionForm.controls[item.idControl].value]);

      const answerObject: Respuesta = {
        idCampo: item.idCampo,
        valor: (item.idTipoCampo === 8 ? (item.imageUploadUrl != 'assets/svg/image_icon.svg' ? [item.imageUploadUrl] : [null]) :
          ((item.idTipoCampo === 4 && itemArray.some(x => x == null || x == 'null')) ? ['false'] :
            itemArray.map(String))),
        valorFileSendUrl: ((item.idTipoCampo === 8 && item.imageUploadUrl != 'assets/svg/image_icon.svg') ? item.imageSendUrl : null)
      }

      answersForm.push(answerObject);
    });

    if (!connection.connected) {
      const request = await this.resolveRequestDataNormalFormAnswer(answersForm, false);
      await this.tableNormalFormService.addNormalFormAssistanceAnswer(request);

      this.isSaveNormalFormLoading = false;
      this.questionNormalList = [];
      this.alertService.showAlert('workday_success.svg', 'Formulario registrado', 'Se guardo correctamente el formulario, en modo Offline. Verifica si se sincronizó correctamente cuando obtengas una conexión a internet.', 'main/tarea-list');
      return;
    }

    answersForm.forEach(item => {
      if (item.valorFileSendUrl !== null) {
        fileUploadPromises.push(this.fileUploadService.sendFileFormularioAracne3(this.activeCampaign.bbddCampania.replace(/_/g, ''), 'formulario', item));
      }
    });

    if (fileUploadPromises.length > 0) {
      const resultFileUpload = await this.saveFileFormularioNormalAracne3(fileUploadPromises);

      if (resultFileUpload.some(x => x.success == false)) {
        this.alertService.showAlert(null, 'Ocurrio un error', 'Error al intentar cargar las imagenes.');
        this.isSaveNormalFormLoading = false;
        return;
      }

      answersForm.forEach(item => {
        if (item.valorFileSendUrl != null) {
          const valueIdFile = resultFileUpload.filter(x => x.respuesta.idCampo == item.idCampo)[0].idFileBlob;
          item.valor = [valueIdFile];
        }
      });
    }

    const request = await this.resolveRequestDataNormalFormAnswer(answersForm, true);

    const postReporteSubs = this.normalFormService.postCrearReporteFormulario(request).subscribe(response => {
      this.isSaveNormalFormLoading = false;

      if (response && response.statusCode == 200) {
        this.questionNormalList = [];
        this.alertService.showAlert('workday_success.svg', 'Formulario registrado', 'Se registró correctamente el formulario.', 'main/tarea-list');
      } else {
        this.alertService.showAlert(null, 'Ocurrio un error', 'No se pudo registrar, intente nuevamente.');
      }

      setTimeout(() => { postReporteSubs?.unsubscribe(); }, 250);
    });
  }

  async resolveRequestDataNormalFormAnswer(answersForm: Array<Respuesta>, isConnected: boolean): Promise<FormularioLibreRequest> {
    const presentUserId: number = (this.userReporterConfig ? this.userReporterConfig.idUsuario : parseInt(this.userAuth.uid));
    const batteryLevel = await this.batterryService.getBatterryStatus();
    const batteryLevelValue = (batteryLevel < 1 ? parseInt((batteryLevel * 100).toFixed(0)) : batteryLevel);
    const thisTime: string = moment().format("YYYY-MM-DDTHH:mm:ss");
    const reportFormId: number = (isConnected ? 0 : parseInt(moment(thisTime).format('DDMMYYYYHHmmss')));

    return new Promise((resolve, reject) => {
      // preparamos la data para enviarlo al server
      const dataInsertReporte: DataInsertReporteFormulario = {
        idReporteFormulario: reportFormId,
        idFormulario: this.questionNormalList[0].idFormulario,
        idUsuario: presentUserId,
        idPdv: this.salespointSelected.idPdv,
        fechaReporte: thisTime,
        nivelBateria: (batteryLevel ? batteryLevelValue : null),
        esAutomatico: false,
        respuestas: answersForm.map(x => ({ ...x, valor: (x.valor.some(y => y == null || y == "null") ? [] : x.valor) })),
        usCreacion: parseInt(this.userAuth.uid),
        salespointName: this.salespointSelected.nombrePdv
      }

      const request: FormularioLibreRequest = {
        dataInsertReporteFormulario: dataInsertReporte,
        dataInsertAsistenciasList: []
      }

      resolve(request);
    });
  }

  async saveFileFormularioNormalAracne3(requestFileUpload: Array<any>): Promise<Array<RespuestaImageResponse>> {
    let result: Array<RespuestaImageResponse> = [];

    if (requestFileUpload.length > 0) {
      await Promise.all(requestFileUpload)
        .then((response: Array<RespuestaImageResponse>) => {
          result = response;
        });

      return result;
    }

    return result;
  }

  // Validación si no hay mas campos obligatorios dando la funcionalidad de culminar el formulario
  async validFormAndBackToWorkList() {
    if (this.isWorkDayFormSelected) {
      const incompleteField = this.questionList.filter(x => x.isCompleted == false)
      const requiredFieldExists = incompleteField.some(y => y.campos.some(x => x.obligatorio));

      if (incompleteField.length > 0 && !requiredFieldExists) {
        let answerSavingPromises = [];

        const alertView = await this.alertCtrl.create({
          mode: 'ios',
          header: 'Sin campos obligatorios por contestar',
          message: '¿Desea finalizar el formulario?',
          buttons: [
            {
              text: 'Aceptar',
              role: 'confirm',
              handler: () => {
                incompleteField.forEach(item => {
                  answerSavingPromises.push(this.onSaveAnswers(item.idDetalleTema));
                });

                return Promise.all(answerSavingPromises).then(result => {
                  this.router.navigate(['main/tarea-list']);
                });
              },
            },
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'purple',
              handler: () => {
                this.router.navigate(['main/tarea-list']);
              }
            }
          ],
          backdropDismiss: false
        });

        alertView.present();

        let alertIconHtml = document.createElement("img");
        alertIconHtml.src = '../../../assets/svg/workday_success.svg';
        alertIconHtml.style.maxWidth = '75px';
        alertIconHtml.style.marginTop = '1rem';

        let alertHtml = document.getElementsByClassName('alert-wrapper')[0];
        alertHtml.insertAdjacentElement('afterbegin', alertIconHtml);
        alertHtml.setAttribute('style', 'align-items: center;');

        return;
      }

      this.router.navigate(['main/tarea-list']);
      return;
    }

    this.router.navigate(['main/tarea-list']);
    return;
  }
}
