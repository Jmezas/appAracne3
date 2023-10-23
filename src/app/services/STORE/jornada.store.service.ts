import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import * as jornadaAction from '../../store/actions/jornada.action';

import { LocalStorageService } from '../local-storage.service';
import { JornadaPVModel } from 'src/app/shared/models/jornada.interface';
import { GenericStoreService } from './store.service';

const jornadaKey = 'Selected_jornada';

@Injectable({
  providedIn: 'root',
})
export class JornadaStore {

  constructor(
    private store: Store<AppState>,
    private genericStoreService: GenericStoreService,
  ) {}

  setSelectedJornada(selectedJornada: JornadaPVModel) {
    const fn = jornadaAction.setActiveJornada;
    this.genericStoreService.setLocalData(fn, { selectedJornada }, jornadaKey);
  }

  async getSelectedJornada() {
    let selectedJornada: JornadaPVModel;
    await this.store.select('jornada').subscribe(jornada => selectedJornada = jornada.selectedJornada);
    if (!selectedJornada) {
      const fn = jornadaAction.setActiveJornada;
      selectedJornada = await this.genericStoreService.getLocalData(fn, { selectedJornada }, jornadaKey);
    }
    return selectedJornada;
  }
}
