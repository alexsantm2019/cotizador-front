// angular import
import {AfterViewInit, OnInit, ViewChild, inject, TemplateRef, Input } from '@angular/core';
import { Component } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { CotizadorFormComponent } from '../cotizacion-form/cotizacion-form.component';
import { ListaCotizacionesComponent } from '../lista-cotizaciones/lista-cotizaciones.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {  years } from '../../utils/filtros';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports: [SharedModule,  NgbModalModule, ListaCotizacionesComponent, CotizadorFormComponent],
  templateUrl: './cotizaciones-parent.component.html',
  styleUrls: ['./cotizaciones-parent.component.scss']
})
export class CotizacionesParentComponent implements OnInit {

  // @ViewChild('listaCotizaciones') listaCotizaciones: ListaCotizacionesComponent | undefined;
  @Input() cotizacionExistente: any = null;
  cotizacionSeleccionada: any = null;
  filterForm: FormGroup;
  years = years; 
  selectedYear: number = new Date().getFullYear();
  refreshTrigger = 0;
  constructor(private fb: FormBuilder) {
     this.filterForm = this.fb.group({
      //month: [new Date().getMonth() + 1], // Mes actual
      year: [new Date().getFullYear()], // Año actual
    });
  }

  ngOnInit(): void {
    this.selectedYear = this.filterForm.get('year')?.value;
  }

  actualizarListaCotizaciones(): void {
    this.selectedYear = this.filterForm.get('year')?.value;
    this.refreshTrigger++;
  }

  // Método que me permite ejecutar "getCotizaciones" en listaCotizaciones
  // actualizarListaCotizaciones() {    
  //   if (this.listaCotizaciones) {    
  //     this.listaCotizaciones.getCotizaciones(); // Llama al método en lista-cotizaciones
  //   }
  // }

  editarCotizacion(cotizacion: any): void {    
    this.cotizacionSeleccionada = cotizacion;
  }

}