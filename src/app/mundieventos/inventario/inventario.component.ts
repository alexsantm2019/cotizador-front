// angular import
import {AfterViewInit, OnInit, ViewChild, inject, TemplateRef } from '@angular/core';
import { Component } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
// import { NuevoClienteComponent } from '../nuevo-cliente/nuevo-cliente.component';
import { Notyf } from 'notyf';

// Servicio:
import { ProductosService } from '../services/productos/productos.service'
import { ProductosInterface } from '../models/productos.model';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [SharedModule, NgbModalModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit{

  private productosService = inject(ProductosService);
  private  notyf = new Notyf();
  productosInventario: ProductosInterface[] = [];
  currentPage = 1;
  pageSize = 10;
  minimoProductosInventario = 5;
  
  
  ngOnInit(): void {    
    this.getProductosInventario();
  }

  getProductosInventario(): void {
    this.productosService.getProductosInventario().subscribe({
      next: (data) => {
        this.productosInventario = data;
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }

  actualizarCantidad(producto: ProductosInterface) {
    const updatedData = { cantidad: producto.cantidad }; // Django actualiza 'inventario_updated_at' automáticamente

    this.productosService.updateInventario(producto.id, updatedData).subscribe({
      next: (response) => {
        this.showSuccess('Cantidad actualizada correctamente')
        this.getProductosInventario()
      },
      error: (error) => {
        this.showError('Error al actualizar el inventario')
        // console.error('Error al actualizar el inventario:', error);
      }
    });
  }

  getPagedInventario(): ProductosInterface[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.productosInventario.slice(startIndex, startIndex + this.pageSize);
  }

  getPageArray(length: number): number[] {
    const pageCount = Math.ceil(length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  showSuccess(msg:any) {
    this.notyf.success(msg);
  }
  showError(msg:any) {
    this.notyf.error(msg);
  }


}
