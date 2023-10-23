import { Component, Input, OnInit, TemplateRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { formValidToCompleted } from '../../../store/actions/form.action';

import { IItemHeaderIcon } from '../../models/UI.interface';
import { LIST_MENU_MAIN } from '../../constants/menu.constant';

import { InternetConnectionService } from '../../../services/internet-connection.service';

import { Subscription } from 'rxjs';
import { ISearchBarConfig } from '../../models/config.interface';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-header-modules',
  templateUrl: './header-modules.component.html',
  styleUrls: ['./header-modules.component.scss'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out', 
                    style({ height: 60, opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ height: 60, opacity: 1 }),
            animate('1s ease-in', 
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class HeaderModulesComponent implements OnInit, OnDestroy {
  @Input() moduleTitle: string;
  @Input() btnBack = false;
  @Input() btnBackMain = false;
  @Input() btnCloseModal = false;
  @Input() btnDrawerMenu = false;
  @Input() buttonsHeader: TemplateRef<any>;
  @Input() searchBarConfig: ISearchBarConfig;
  @Output() resultSearch: EventEmitter<string> = new EventEmitter<string>();

  backPage = 'assets/svg/back_page.svg';
  headerMenu = 'assets/svg/header_menu.svg';
  backMainRouteId = 0;
  listIconsResult: Array<IItemHeaderIcon> = [];
  tabRouterBackSubs: Subscription;
  internetConnectedSubs: Subscription;

  isOpenSearchBar: boolean = false;


  constructor(
    private _menuCTRL: MenuController,
    private modalCtrl: ModalController,
    private router: Router,
    private store: Store<AppState>,
    private internetService: InternetConnectionService) {
  }

  ngOnInit() {
    this.tabRouterBackSubs = this.store.select('sideMenu').subscribe(({ tabRouterBack }) => {
      this.backMainRouteId = tabRouterBack;
    });

    this.internetConnectedSubs = this.internetService.$isConnected.subscribe(isConnect => {      
      const internetConnectionBox = document.getElementById('intenetConnectionHeaderBox');
      const internetConnectionCampaign = document.getElementById('internetConnectionCampaign');
      const tabsInnerContainer = Array.from(document.getElementsByClassName('tabs-inner') as HTMLCollectionOf<HTMLElement>)

      if (!isConnect) {
        internetConnectionBox.style.opacity = '1';
        internetConnectionBox.style.display = 'block';
        internetConnectionCampaign.style.color = '#d05f5f';
        tabsInnerContainer.forEach(x => x.style.marginTop = '1rem');
        return;
      }

      internetConnectionBox.style.opacity = '0';
      internetConnectionBox.style.display = 'none';
      internetConnectionCampaign.style.color = '#8fc886';
      tabsInnerContainer.forEach(x => x.style.marginTop = '');
    });
  }

  ngOnDestroy(): void {
    this.tabRouterBackSubs?.unsubscribe();
    this.internetConnectedSubs?.unsubscribe();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  openNavbar() {
    this._menuCTRL.enable(true, 'first')
    this._menuCTRL.open('first');
  }

  onNavigationMain() {
    //validación temporal solo para fines de completar un formulario
    // if (this.backMainRouteId == 5) {
    //   this.store.dispatch(formValidToCompleted({ validForm: true }));
    //   return;
    // }

    this.router.navigate([LIST_MENU_MAIN.filter(x => x.id == this.backMainRouteId).map(y => y.url)[0]]);
  }

  // Searchbar
  toggleSearchBar() {
    this.isOpenSearchBar = !this.isOpenSearchBar;
  }

  onSearchChange($event) {
    this.resultSearch.emit($event.detail.value);
  }
}
