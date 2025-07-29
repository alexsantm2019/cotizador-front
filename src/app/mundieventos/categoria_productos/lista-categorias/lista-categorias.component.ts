// angular import
import {AfterViewInit, OnInit, ViewChild, inject, TemplateRef, Output, EventEmitter } from '@angular/core';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Notyf } from 'notyf';

// Servicio:
import { CategoriaProductoService } from '../../services/categoria-producto/categoria-producto.service'
import { CategoriaProductoInterface } from '../../models/categoria-producto.models';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [SharedModule, NgbModalModule],
  templateUrl: './lista-categorias.component.html',
  styleUrls: ['./lista-categorias.component.scss']
})
export class ListaCategoriasComponent implements OnInit{

  @Output() editarCategoriaEvent = new EventEmitter<CategoriaProductoInterface>(); // Evento de edición

  private categoriaProductosService = inject(CategoriaProductoService);
  private  notyf = new Notyf();
  categoriaProductos: CategoriaProductoInterface[] = [];
  currentPage = 1;
  pageSize = 5;
  isEditMode: boolean  = false;

  ngOnInit(): void {    
    this.getCategoriaProductos();
  }

  getCategoriaProductos(): void {
    this.categoriaProductosService.getCategoriaProducto().subscribe({
      next: (data) => {
        this.categoriaProductos = data;
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }

  getPagedClientes(): CategoriaProductoInterface[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.categoriaProductos.slice(startIndex, startIndex + this.pageSize);
  }

  getPageArray(length: number): number[] {
    const pageCount = Math.ceil(length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  onClienteGuardado(cliente: CategoriaProductoInterface): void {
    this.getCategoriaProductos();
  }

  onCategoriaGuardada(): void {
    this.getCategoriaProductos(); // Recarga la lista tras guardar
  }

  editarCategoria(categoria: CategoriaProductoInterface): void {
    this.editarCategoriaEvent.emit(categoria); // Emitimos la categoría seleccionada
  }

  deleteCategoria(id:number ){
    this.categoriaProductosService.deleteCategoriaProducto(id).subscribe({
      next: () => {
        this.showSuccess('Registro eliminado correctamente');
        this.getCategoriaProductos();        
      },
      error: (error) => console.error('Error al eliminar:', error),
    });
  }

  showSuccess(msg:any) {
    this.notyf.success(msg);
  }
  showError(msg:any) {
    this.notyf.error(msg);
  }


}
