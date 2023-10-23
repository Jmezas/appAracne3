import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExternalLibraryService {

  constructor() { }

  loadAllExternalLibrary() {
    this.loadMaterialIcons();
    this.loadGoogleMaps();
  }

  loadMaterialIcons() {
    const srcMaterialIcons: string = 'https://fonts.googleapis.com/icon?family=Material+Icons';

    if (!Boolean(document.querySelector('link[href="' + srcMaterialIcons + '"]'))) {
      console.log('Cargando Material+Icons');
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = srcMaterialIcons;
      document.head.appendChild(link);
    }
  }

  loadGoogleMaps() {
    const srcMapsApi: string = `https://maps.googleapis.com/maps/api/js?key=${environment.APIKEY_MAPS}&libraries=geometry&callback=initTemp`;

    if (!Boolean(document.querySelector('script[src="' + srcMapsApi + '"]'))) {
      console.log('Cargando Google Maps');
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = srcMapsApi;
      document.head.appendChild(script);
    }
  }
}
