import { Injectable } from '@angular/core';
import { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { ToastAlertService } from './UI/toast-alert.service';

@Injectable({
  providedIn: 'root',
})
export class InternetConnectionService {
  networkListener: PluginListenerHandle;
  private isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly $isConnected: Observable<boolean> = this.isConnected.asObservable();

  constructor(
    private TOAST: ToastAlertService
  ) {
  }

  async getNetWorkStatus() {
    return await Network.getStatus();
  }

  getNetworkStatus(): Observable<any> {
    return from(Network.getStatus())
  }

  startNetworkListener() {
    this.networkListener = Network.addListener(
      'networkStatusChange',
      (status) => {
        // if (!status.connected) {
        //   this.TOAST.danger(`Se perdio la conexión`, 'cloud-offline-outline');
        // }

        // status.connected ? 
        // this.TOAST.success(`Conectado a red ${status.connectionType}`, 'wifi-outline' ) :
        // this.TOAST.danger(`Se perdio la conexión`, 'cloud-offline-outline' );

        this.setIsConnected(status.connected);
      }
    );
  }

  endNetworkListener() {
    if (this.networkListener) {
      this.networkListener.remove();
    }
  }

  setIsConnected(status: boolean): void {
    this.isConnected.next(status);
  }

  getIsConnected() {
    return this.isConnected.value;
  }
}
