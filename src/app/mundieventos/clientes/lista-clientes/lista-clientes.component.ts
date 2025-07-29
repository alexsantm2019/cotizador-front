// angular import
import {AfterViewInit, OnInit, ViewChild, inject, TemplateRef } from '@angular/core';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NuevoClienteComponent } from '../nuevo-cliente/nuevo-cliente.component';
import { Notyf } from 'notyf';

// Servicio:
import { ClientesService } from '../../services/clientes/clientes.service'
import { ClientesInterface } from '../../models/clientes.models';

@Component({
  selector: 'app-lista-clientes',
  standalone: true,
  imports: [SharedModule, NuevoClienteComponent, NgbModalModule],
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.scss']
})
export class ListaClientesComponent implements OnInit{

  private clientesService = inject(ClientesService);
  private  notyf = new Notyf();
  clientes: ClientesInterface[] = [];
  currentPage = 1;
  pageSize = 10;
  isEditMode: boolean  = false;
  clienteSeleccionado: ClientesInterface | null = null;

  ngOnInit(): void {    
    this.getClientes();
  }

  getClientes(): void {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }

  getPagedClientes(): ClientesInterface[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.clientes.slice(startIndex, startIndex + this.pageSize);
  }

  getPageArray(length: number): number[] {
    const pageCount = Math.ceil(length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  onClienteGuardado(cliente: ClientesInterface): void {
    this.getClientes();
  }

  deleteCliente(id:number ){
    this.clientesService.deleteCliente(id)
    .subscribe(
      (response: any) => {      
        this.getClientes();
        this.showSuccess("Registro eliminado correctamente");
      }, 
      (error: any) => {
          console.log("Error" + JSON.stringify(error));
          this.showError(error);
      }) 
  }

  showSuccess(msg:any) {
    this.notyf.success(msg);
  }
  showError(msg:any) {
    this.notyf.error(msg);
  }


}
