// angular import
import {AfterViewInit, OnInit, ViewChild, inject, TemplateRef, Input } from '@angular/core';
import { Component } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { CotizadorFormComponent } from '../cotizacion-form/cotizacion-form.component';
import { CotizadorComponent } from '../_cotizador/cotizador.component';
import { ListaCotizacionesComponent } from '../lista-cotizaciones/lista-cotizaciones.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports: [SharedModule,  NgbModalModule, CotizadorComponent, ListaCotizacionesComponent, CotizadorFormComponent],
  templateUrl: './cotizaciones-parent.component.html',
  styleUrls: ['./cotizaciones-parent.component.scss']
})
export class CotizacionesParentComponent implements OnInit {

  @ViewChild('listaCotizaciones') listaCotizaciones: ListaCotizacionesComponent | undefined;
  @Input() cotizacionExistente: any = null;
  cotizacionSeleccionada: any = null;
  constructor() {}

  ngOnInit(): void {
    
  }

  // Método que me permite ejecutar "getCotizaciones" en listaCotizaciones
  actualizarListaCotizaciones() {
    if (this.listaCotizaciones) {
      this.listaCotizaciones.getCotizaciones(); // Llama al método en lista-cotizaciones
    }
  }

  editarCotizacion(cotizacion: any): void {    
    this.cotizacionSeleccionada = cotizacion;
  }

}