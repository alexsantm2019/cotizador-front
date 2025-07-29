import { Component, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  toasts: { textOrTpl: string | TemplateRef<any>; options: any }[] = [];

  // Mostrar un nuevo toast
  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, options });
  }

  // Remover un toast cuando sea necesario
  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  // Función para verificar si el contenido es un TemplateRef
  isTemplateRef(content: string | TemplateRef<any>): content is TemplateRef<any> {
    return content instanceof TemplateRef; // Verifica si es una instancia de TemplateRef
  }
}