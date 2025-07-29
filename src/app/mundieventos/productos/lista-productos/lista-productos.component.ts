// angular import
import {AfterViewInit, OnInit, ViewChild, inject, TemplateRef } from '@angular/core';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NuevoProductoComponent } from '../nuevo-producto/nuevo-producto.component';
import { Notyf } from 'notyf';

// Servicio:
import { ProductosService } from '../../services/productos/productos.service'
import { ProductosInterface } from '../../models/productos.model';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [SharedModule, NuevoProductoComponent, NgbModalModule],
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss']
})
export class ListaProductosComponent implements OnInit{

  private productosService = inject(ProductosService);
  private  notyf = new Notyf();
  productos: ProductosInterface[] = [];
  currentPage = 1;
  pageSize = 10;
  isEditMode: boolean  = false;
  productoSeleccionado: ProductosInterface | null = null;

  ngOnInit(): void {    
    this.getProductos();
  }

  getProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }

  getPagedProducts(): ProductosInterface[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.productos.slice(startIndex, startIndex + this.pageSize);
  }

  getPageArray(length: number): number[] {
    const pageCount = Math.ceil(length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  onProductoGuardado(producto: ProductosInterface): void {
    this.getProductos();
  }

  deleteProducto(id:number ){
    this.productosService.deleteProducto(id)
    .subscribe(
      (response: any) => {      
        this.getProductos();
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
