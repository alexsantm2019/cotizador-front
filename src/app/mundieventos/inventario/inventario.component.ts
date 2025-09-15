// angular import
import { AfterViewInit, OnInit, ViewChild, inject, TemplateRef, signal, computed } from '@angular/core';
import { Component } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
// import { NuevoClienteComponent } from '../nuevo-cliente/nuevo-cliente.component';
import { Notyf } from 'notyf';

// Servicio:
import { ProductosService } from '../services/productos/productos.service'
import { ProductosInterface } from '../models/productos.model';
import { InventarioSearchComponent } from "./inventario-search/inventario-search.component";

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [SharedModule, NgbModalModule, InventarioSearchComponent],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  private productosService = inject(ProductosService);
  private notyf = new Notyf();
  // productosInventario: ProductosInterface[] = [];
  productosInventario = signal<ProductosInterface[]>([]);
  currentPage = 1;
  pageSize = 10;
  minimoProductosInventario = 5;

  // Filtro:
  searchTerm = signal('');
  filteredInventario = computed(() =>
    this.productosInventario().filter(item =>
      item.producto.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );


  ngOnInit(): void {
    this.getProductosInventario();
  }

  getProductosInventario(): void {
    this.productosService.getProductosInventario().subscribe({
      next: (data) => {
        // this.productosInventario = data;
        this.productosInventario.set(data);
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
      }
    });
  }

  getPagedInventario(): ProductosInterface[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredInventario().slice(startIndex, startIndex + this.pageSize);
  }

  getPageArray(length: number): number[] {
    const pageCount = Math.ceil(length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  showSuccess(msg: any) {
    this.notyf.success(msg);
  }
  showError(msg: any) {
    this.notyf.error(msg);
  }


}
