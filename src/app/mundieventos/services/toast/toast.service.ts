// import { Injectable, TemplateRef } from '@angular/core';

// export interface Toast {
// 	template: TemplateRef<any>;
// 	classname?: string;
// 	delay?: number;
// }

// @Injectable({ providedIn: 'root' })
// export class ToastService {
// 	toasts: Toast[] = [];

// 	show(toast: Toast) {
// 		this.toasts.push(toast);
// 	}

// 	remove(toast: Toast) {
// 		this.toasts = this.toasts.filter((t) => t !== toast);
// 	}

// 	clear() {
// 		this.toasts.splice(0, this.toasts.length);
// 	}
// }

// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ToastService {
//   private toastSubject = new Subject<any>();

// // Método para emitir un toast
// showToast(message: string, classname: string = 'bg-info text-light'): void {
//     this.toastSubject.next({ message, classname }); // Emite un nuevo toast con el mensaje y la clase
//   }

//   // Método para observar los toasts emitidos
//   getToastObservable() {
//     return this.toastSubject.asObservable();  // Devuelve el Observable del Subject
//   }
// }
import { Injectable } from '@angular/core';
import { ToastComponent } from '../../ui/toast/toast.component'; // Importa el ToastComponent

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

