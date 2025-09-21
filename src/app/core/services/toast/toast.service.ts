import { Injectable } from '@angular/core';
import { ToastComponent } from '../../../mundieventos/ui/toast/toast.component'; // Importa el ToastComponent

@Injectable({
  providedIn: 'root', // Hacemos que el servicio sea global
})
export class ToastService {

  constructor() { }

  // Método para mostrar el toast
  showToast(toastComponent: ToastComponent, message: string, options: any = {}) {
    toastComponent.show(message, options);
  }

  // Método para ocultar el toast
  hideToast(toastComponent: ToastComponent, toast: any) {
    toastComponent.remove(toast);
  }
}

