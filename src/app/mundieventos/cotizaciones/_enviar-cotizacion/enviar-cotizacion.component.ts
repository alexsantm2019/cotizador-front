// angular import
import { TemplateRef, Component, OnInit,  inject, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'; 
import { NgbModal, NgbModalRef, NgbModalModule, ModalDismissReasons  } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Notyf } from 'notyf';

// Servicio:
import { CotizacionesService } from '../../services/cotizador/cotizador.service'

@Component({
  selector: 'app-enviar-cotizacion',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './enviar-cotizacion.component.html',
  styleUrls: ['./enviar-cotizacion.component.scss']
})
export class EnviarCotizacionComponent {

  @Input() cotizacionId!: number; // Recibe el ID de la cotización
  private cotizacionService = inject(CotizacionesService);
  
  private  notyf = new Notyf();  
  constructor() {}

  generarYEnviarPDF(metodo: 'email' | 'whatsapp') {
    this.showSuccess('Enviando cotización.....');
    const envioObservable = metodo === 'email'
      ? this.cotizacionService.enviarPorCorreo(this.cotizacionId)
      : this.cotizacionService.enviarPorWhatsApp(this.cotizacionId);

    envioObservable.subscribe({
      next: (response) =>{
        this.showSuccess('Cotización enviada exitosamente');
      } ,
      error: (error) =>{
        this.showSuccess(`Error al enviar cotización: ${error.message}`);
      } 
    });  
  }
  showSuccess(msg:any) {
    this.notyf.success(msg);
  }
  showError(msg:any) {
    this.notyf.error(msg);
  }
}