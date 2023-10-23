import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';

import { environment } from '../../../environments/environment';

import { LIST_MENU_LATERAL } from '../../shared/constants/menu.constant';
import { clearSubscriptions, storeSubscriptions } from '../../shared/utils/subscriptions.utils';

import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';

import { AuthServiceStore } from '../../services/STORE/auth.store.service';
import { CampaingService } from '../../services/STORE/campaing.store.service';

import { DatabaseAppService } from '../../services/database/database-app.service';
import { DatabaseNameService } from '../../services/database/database-name/databaseName.service';
import { TableUserService } from '../../services/database/table-user.service';
import { TableMenuService } from '../../services/database/table-menu.service';
import { TableWorkdayRouteService } from '../../services/database/table-workday-route.service';
import { TableWorkdayAssistanceService } from '../../services/database/table-workday-assistance.service';
import { TableFormService } from '../../services/database/table-form.service';
import { TableNormalFormService } from '../../services/database/table-normal-form.service';
import { TableSalespointService } from '../../services/database/table-salespoint.service';
import { TableLogChecklistService } from '../../services/database/table-log-checklist.service';
import { TableChecklistService } from '../../services/database/table-checklist.service';
import { TableQuestionService } from '../../services/database/table-question.service';
import { TableAnswerService } from '../../services/database/table-answer.service';
import { DatabaseImportService } from '../../services/database/database-import.service';
import { DatabaseSyncService } from '../../services/database/database-sync.service';

import { UserService } from '../../services/API/user.service';
import { SalePointsService } from '../../services/API/salePoints.service';
import { ExternalLibraryService } from '../../services/external-library.service';
import { MenuService } from '../../services/API/menu.api.service';

import { InternetConnectionService } from '../../services/internet-connection.service';
import { AlertService } from '../../services/UI/alert.service';
import { LoadingService } from '../../services/UI/loading.service';
import { ModalService } from '../../services/UI/modal.service';
import { JwtService } from '../../services/UTILS/jwt.service';
import { ChecklistService } from '../../services/API/checklist.service';
import { SideMenuStore } from '../../services/STORE/menu.store.service';

import { MenuApp } from '../../shared/models/menu.interface';
import { IUserAuth } from '../../shared/models/user.interface';
import { IItemCampaign } from '../../shared/models/campaing.interface';
import { ManageTables } from '../../services/DAO/ManageTables';

import { NotificationService } from '../../services/notification.service';
import { APP_CONFIG } from '../../shared/constants/values.constants';

import { Subscription } from 'rxjs';
import * as moment from 'moment';
moment.locale('es');

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('IconsHeaderMain') IconsHeaderMain: ElementRef;

  userName: string = '';
  app_version: string = environment.APPVERSION_ANDROID;
  backButtonEnabled: boolean = false;
  header_menu = 'assets/svg/header_menu_active.svg';
  home_menu: string = 'assets/svg/home_menu.svg';
  notification_menu: string = 'assets/svg/notification_menu.svg';
  calendar_menu: string = 'assets/svg/calendar_menu.svg';
  homework_menu: string = 'assets/svg/homework_menu.svg';
  aracne_horizontal: string = 'assets/svg/aracne3_horizontal.svg';
  isModalCampaignOpen: boolean = false;
  modalCampaignLogo: string = '';
  modalCampaignList: Array<IItemCampaign> = [];
  enterAnimation: any;
  leaveAnimation: any;
  isSynchronizing: boolean = false;

  private userId: number = null;
  private activeCampaign: IItemCampaign = null;
  campaignName: string = '';
  businessLineName: string = '';
  roleName: string = '';
  
  private topicCampaign: string = '';
  private topicRol: string = '';

  isAracne3: boolean = false;
  isEnabledConfig: boolean = false;
  isEnabledTabs: boolean = false;
  menuList: Array<MenuApp> = [];
  private _subscriptions: Array<Subscription> = [];

  constructor(
    private platform: Platform,
    private router: Router,
    private store: Store<AppState>,
    private authStore: AuthServiceStore,
    private campaingService: CampaingService,

    private databaseAppService: DatabaseAppService,
    private databaseNameService: DatabaseNameService,
    private manageTables: ManageTables,
    private tableUserService: TableUserService,
    private tableMenuService: TableMenuService,
    private tableWorkdayRouteService: TableWorkdayRouteService,
    private tableWorkdayAssistanceService: TableWorkdayAssistanceService,
    private tableFormService: TableFormService,
    private tableNormalFormService: TableNormalFormService,

    private tableSalespointService: TableSalespointService,
    private tableLogChecklistService: TableLogChecklistService,
    private tableChecklistService: TableChecklistService,
    private tableQuestionService: TableQuestionService,
    private tableAnswerService: TableAnswerService,
    private databaseImportService: DatabaseImportService,
    private databaseSyncService: DatabaseSyncService,

    private userService: UserService,
    private salespointService: SalePointsService,
    private checklistService: ChecklistService,
    private externalLibraryService: ExternalLibraryService,

    private internetService: InternetConnectionService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    private jwtService: JwtService,
    private menuStore: SideMenuStore,
    // private backgroundService: BackgroundService,
    private menuService: MenuService,
    private alertController: AlertController,
    public notificationService: NotificationService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    // this.backgroundService.runTask();
    this.initMainModule();
  }

  ngAfterViewInit(): void {
    const tabSubs = this.store.select('sideMenu').subscribe(({ tabMenuSelected, tabRouterBack }) => {
      this.backButtonEnabled = (tabRouterBack != 0 ? true : false);
      this.isEnabledTabs = (tabMenuSelected != 0 ? true : false);

      if (tabMenuSelected != 0) {
        this.onClickMenuTab(tabMenuSelected);
      }
    });

    storeSubscriptions(this._subscriptions, tabSubs);
  }

  ionViewWillEnter(): void {
    this.enterAnimation = this.modalService.enterAnimation;
    this.leaveAnimation = this.modalService.leaveAnimation;
    // this.registerTokenFCM(this.activeUser, null);
  }

  ngOnDestroy(): void {
    clearSubscriptions(this._subscriptions);
  }

  initializeApp() {
    this.platform.ready()
      .then(() => {
        // this.fcmService.initPush();
        this.externalLibraryService.loadAllExternalLibrary();
      })
  }

  async initMainModule() {
    const { uid, nombre } = (await this.authStore.getActiveUser()) as IUserAuth;
    const activeCampaign = await this.campaingService.getActiveCampaing();

    this.userId = parseInt(uid);
    this.userName = nombre;
    this.activeCampaign = activeCampaign;
    this.campaignName = activeCampaign.campania;
    this.businessLineName = activeCampaign.lineaNegocio;
    this.roleName = activeCampaign.rol;
    this.isAracne3 = (activeCampaign.idLineaNegocio == 17 ? true : false);
    this.isEnabledConfig = (activeCampaign.idLineaNegocio == 17 ? activeCampaign.decodeTokenUserConfig.isReporter : false);

    await this.databaseAppService.createDatabase();
    await this.databaseNameService.createDatabaseName();
    await this.createTablesForApp();

    this.initMenu();
    this.initModalCampaign();
    this.initInternetConnectObservable();

    this.topicCampaign = activeCampaign.topicCampaign;
    this.topicRol = activeCampaign.topicRol;

    //call service notification
    this.notificationService.ngOnInit(this.userId.toString() ,this.topicCampaign.toString(),this.topicRol.toString());

    // Si la linea de negocio es de Aracne 3 iniciamos el pagina de inicio
    if (activeCampaign.idLineaNegocio == 17) {
      this.router.navigate(['main/inicio']);
      this.onClickMenuTab(1);
    }
  }

  createTablesForApp(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dataTableSubs = this.databaseAppService.getDatabaseState().subscribe(async (isCreated) => {
        if (isCreated) {
          await this.tableUserService.createTableAppUserConfig();
          await this.tableMenuService.createLateralMenuTable();
          await this.tableWorkdayRouteService.createWorkdayRouteTable();
          await this.tableWorkdayRouteService.createWorkdayRouteSalespointTable();
          await this.tableWorkdayAssistanceService.createAssistanceTypeTable();
          await this.tableWorkdayAssistanceService.createAssistanceWorkdayTable();
          await this.tableFormService.createFormListTable();
          await this.tableFormService.createFormTable();
          await this.tableFormService.createFieldDetailThemeFormTable();
          await this.tableFormService.createFieldFormTable();
          await this.tableFormService.createFieldOptionFormTable();
          await this.tableFormService.createAnswersFormTable();
          await this.tableFormService.createDependencyFormTable();
          await this.tableFormService.createDependencyFormApplyTable();
          await this.tableNormalFormService.createNormalFormTable();
          await this.tableNormalFormService.createNormalFormDataTable();
          await this.tableNormalFormService.createNormalFormFieldTable();
          await this.tableNormalFormService.createNormalFormOptionTable();
          await this.tableNormalFormService.createNormalFormAssistanceTable();
          await this.tableNormalFormService.createNormalFormDataAnswerHeadTable();
          await this.tableNormalFormService.createNormalFormDataAnswerDataTable();
          await this.tableWorkdayAssistanceService.createInformacionPdvTypeTable();
          dataTableSubs?.unsubscribe();
          resolve(true);
        }
      });
    });
  }

  async initMenu() {
    const menuSubs = this.menuService.getAllModulesByCampaignRol(this.activeCampaign.idCampania, this.activeCampaign.idRol).subscribe(async (response) => {
      setTimeout(() => { menuSubs?.unsubscribe(); }, 250);

      if (!response) {
        this.menuList = await this.tableMenuService.getLateralMenuColllection(this.activeCampaign.idCampania, this.activeCampaign.idRol);
        return;
      }

      this.menuList = response.map((x, index) => ({
        ...x,
        route: LIST_MENU_LATERAL.find((item) => item.id == x.idModulo).url,
        orden: (x.orden ? x.orden : (index + 1))
      })).sort((y, z) => y.orden - z.orden);

      if (response.length > 0) {
        // Verificar la persistencia del menu
        // this.menuStore.setMenuLateral(listMenuItems);
        await this.tableMenuService.addLateralMenuCollection(this.menuList);
      }
    });
  }

  async initModalCampaign() {
    const campaignCollection = await this.campaingService.getLocalListCampaigns();

    if (campaignCollection.length > 0) {
      const collection = campaignCollection.filter(x => x.campaniasList.some(s => s.idCampania === this.activeCampaign.idCampania));
      const listCampaign = collection[0].campaniasList;

      this.modalCampaignLogo = collection[0].logo;
      this.modalCampaignList = [...listCampaign].sort((a, b) => a.paisCampania.toLowerCase() > b.paisCampania.toLowerCase() ? 1 : -1);
    }
  }

  initInternetConnectObservable() {
    const internetConnectedSubs = this.internetService.$isConnected.subscribe(async (isConnect) => {
      // Bloqueamos dado que al momento de obtener conexión retorna 2 veces el estado
      if (isConnect && !this.isSynchronizing) {
        this.isSynchronizing = true;
        await this.databaseSyncService.workdayFormsCompleteToSync();
        await this.databaseSyncService.normalFormsCompleteToSync();
        this.isSynchronizing = false;
      }
    });

    storeSubscriptions(this._subscriptions, internetConnectedSubs);
  }

  // Aracne 2: Importación de datos para modo offline
  async importData() {
    this.loadingService.show('Importando datos de la campaña...');

    await this.tableUserService.createTable();
    await this.tableSalespointService.createTable();
    await this.tableLogChecklistService.createTable();
    await this.tableChecklistService.createTable();
    await this.tableQuestionService.createTableQuestion();
    await this.tableQuestionService.createTableQuestionOption();
    await this.tableAnswerService.createTableAnswer();
    await this.tableAnswerService.createTableAnswerImage();

    this.manageTables.createAllTables(this.databaseAppService.dbObject);
    await this.databaseNameService.createDatabaseNameTables();

    this.userImported();
    this.salespointImported();
    this.checklistAnswersImported();

    setTimeout(async () => {
      this.loadingService.stop();

      const alert100PercentOffLine = await this.alertController.create({
        header: 'Aracne',
        message: `Datos importados. La campaña ${this.campaignName} es 100% offline.`,
        backdropDismiss: false,
        buttons: ['Aceptar']
      });

      alert100PercentOffLine.present();
    }, 2000);
  }

  async userImported() {
    const userCollection = ((this.activeCampaign.idRol == 1 || this.activeCampaign.idRol == 22) ?
      await this.userService.getAdminUsersCollection(this.activeCampaign.idCampania) :
      await this.userService.getNormalUsersCollection(this.userId, this.activeCampaign.idCampania));

    this.tableUserService.addUserCollection(userCollection);
  }

  salespointImported() {
    const salespointCollectionSubs = this.salespointService.getSalespointListByCampaignId(this.activeCampaign.idCampania, this.businessLineName).subscribe(response => {
      if (response.length > 0) {
        this.tableSalespointService.addSalespoint(response);
      }
    });

    storeSubscriptions(this._subscriptions, salespointCollectionSubs);
  }

  checklistAnswersImported() {
    const checklistCollectionSubs = this.checklistService.getChecklistCollection(this.activeCampaign.idCampania, this.userId).subscribe(responseChecklist => {
      let checklistArrayIds: number[] = [];

      if (responseChecklist.length > 0) {
        this.tableChecklistService.addChecklist(responseChecklist);

        checklistArrayIds = responseChecklist.map(x => x.IdEncuesta);
        const questionsChecklistSubs = this.checklistService.getQuestionsChecklistByIds(checklistArrayIds).subscribe(responseQuestion => {

          if (responseQuestion.length > 0) {
            const questionOptionRequest = responseQuestion.reduce((prv, cur) => prv.concat(cur.QuestionValues), []);

            this.tableQuestionService.addQuestions(responseQuestion);
            this.tableQuestionService.addQuestionOptions(questionOptionRequest);
          }
        });

        storeSubscriptions(this._subscriptions, questionsChecklistSubs);
      }
    });

    storeSubscriptions(this._subscriptions, checklistCollectionSubs);
  }

  // Modal de campañas
  onOpenModalCampaign() {
    this.isModalCampaignOpen = true;
  }

  onCloseModalCampaign() {
    this.isModalCampaignOpen = false;
  }

  async selectCampaing(campaignId: number) {
    if (campaignId === this.activeCampaign.idCampania) {
      this.isModalCampaignOpen = false;
      return;
    }

    const alert = await this.alertController.create({
      mode: 'ios',
      header: '¿Cambiar de campaña?',
      message: `¿Está seguro(a) de cambiar la campaña?\nPuede perder la actividad actual.`,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          role: 'confirm',
          handler: () => { this.onChangeCampaing(campaignId); }
        }
      ]
    });

    alert.present();
  }

  async onChangeCampaing(campaignId: number) {
    const campaignSelected = this.modalCampaignList.filter(x => x.idCampania === campaignId)[0];

    this.isModalCampaignOpen = false;
    this.loadingService.show(`Configurando campaña ${campaignSelected.campania}...`);

    const request = [APP_CONFIG.UserReporter];
    await this.tableUserService.deleteAppUserConfig(this.userId, this.activeCampaign.idCampania, request);

    const decodeToken = await this.jwtService.decodeToken(campaignSelected.tokenUserConfig);
    const activeCampaignSelected = { ...campaignSelected };
    activeCampaignSelected.decodeTokenUserConfig = decodeToken;
    activeCampaignSelected.decodeTokenUserConfig.isReporter = (
      (activeCampaignSelected.idLineaNegocio === 17 && (activeCampaignSelected.idRol === 1 || activeCampaignSelected.idRol === 3)) ? true : false
    );

    this.campaingService.setActiveCampaing(activeCampaignSelected);
    this.initMainModule();

    setTimeout(() => {
      this.loadingService.stop();
    }, 1500);
  }

  // Aracne 3
  async onClickMenuTab(index: number) {
    this.home_menu = (index === 1 ? 'assets/svg/home_menu_active.svg' : 'assets/svg/home_menu.svg');
    this.notification_menu = (index === 2 ? 'assets/svg/notification_menu_active.svg' : 'assets/svg/notification_menu.svg');
    this.calendar_menu = (index === 3 ? 'assets/svg/calendar_menu_active.svg' : 'assets/svg/calendar_menu.svg');
    this.homework_menu = (index === 4 ? 'assets/svg/homework_menu_active.svg' : 'assets/svg/homework_menu.svg');
  }

  goToAracne3Modules(path: string): void {
    this.router.navigate([`main/${path}`]);
  }

  async importDataAracne3() {
    await this.databaseImportService.importDataForApp(this.userId, this.activeCampaign.idCampania, this.activeCampaign.campania, this.activeCampaign.idRol);
  }

  async closeSession() { 
    const request = [APP_CONFIG.UserReporter];
    await this.tableUserService.deleteAppUserConfig(this.userId, this.activeCampaign.idCampania, request);
    this.authStore.closeSession();
    this.notificationService.unsubscribeTopic(this.topicCampaign.toString(),this.topicRol.toString());
  }
}
