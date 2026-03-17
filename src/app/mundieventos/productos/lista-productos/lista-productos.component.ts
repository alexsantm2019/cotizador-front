// angular import
import { AfterViewInit, OnInit, ViewChild, inject, TemplateRef, signal, computed } from '@angular/core';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Observable, catchError, tap, throwError, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NuevoProductoComponent } from '../nuevo-producto/nuevo-producto.component';
import { Notyf } from 'notyf';

// Servicio:
import { ProductosService } from '../../../core/services/productos/productos.service';
import { ProductosInterface } from '../../../core/models/productos.model';
import { ProductoSearchComponent } from '../producto-search/producto-search.component';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [SharedModule, NuevoProductoComponent, NgbModalModule, ProductoSearchComponent, FormsModule],
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss']
})
export class ListaProductosComponent implements OnInit {
  private productosService = inject(ProductosService);
  private notyf = new Notyf();

  // 📌 NUEVAS PROPIEDADES para API paginada
  productos = signal<ProductosInterface[]>([]);
  currentPage = 1;
  pageSize = 20;
  totalPages = 1;
  isLoading = false;
  hasMoreData = false;

  isEditMode: boolean = false;
  productoSeleccionado: ProductosInterface | null = null;
  mostrarDescripcion: boolean = false;

  searchTermBackend = signal('');
  private searchSubject = new Subject<string>();
  totalResultados = 0;

  // 📌 Filtro optimizado con debounce
  searchTerm = signal('');

  filteredProductos = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.productos();
    return this.productos().filter((item) => item.producto.toLowerCase().includes(term));
  });

  ngOnInit(): void {
    this.getProductos();

    // 📌 Configurar debounce para búsqueda
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
      this.searchTerm.set(term);
      this.currentPage = 1; // Resetear a primera página al buscar
    });

    this.searchSubject
      .pipe(
        debounceTime(500), // Esperar 500ms después de que el usuario deje de escribir
        distinctUntilChanged() // Solo si el término cambió
      )
      .subscribe((term) => {
        this.searchTermBackend.set(term);
        this.currentPage = 1; // Resetear a primera página
        this.productos.set([]); // Limpiar productos actuales
        this.getProductos(); // Buscar en backend
      });
  }

  // 📌 MÉTODO OPTIMIZADO con paginación
  getProductos(): void {
    this.isLoading = true;

    this.productosService
      .getProductosOptimizados(
        this.currentPage,
        this.pageSize,
        this.searchTermBackend() // 👈 Pasar término de búsqueda
      )
      .subscribe({
        next: (response: any) => {
          if (this.currentPage === 1) {
            this.productos.set(response.data || []);
          } else {
            // Para páginas adicionales, concatenar
            this.productos.update((current) => [...current, ...(response.data || [])]);
          }

          this.totalPages = response.pagination?.total_pages || 1;
          this.totalResultados = response.pagination?.total || 0; // Guardar total
          this.hasMoreData = this.currentPage < this.totalPages;
          this.isLoading = false;

          console.log(`✅ Encontrados ${this.totalResultados} resultados para "${this.searchTermBackend()}"`);
        },
        error: (error) => {
          console.error('Error:', error);
          this.isLoading = false;
        }
      });
  }

  // 👇 NUEVO: Manejar búsqueda con debounce
  // onSearch(term: string) {
  //   this.searchSubject.next(term);
  // }

  // 📌 MÉTODO ACTUALIZADO para paginación
  getPagedProducts(): ProductosInterface[] {
    // Como ahora tenemos todos los productos cargados en memoria,
    // pero podríamos cambiar a carga bajo demanda
    return this.productos();
  }

  // 📌 MÉTODO ACTUALIZADO para array de páginas
  getPageArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getNoResultsMessage(): string {
    const searchTerm = this.searchTermBackend();
    if (searchTerm) {
      return `No se encontraron productos que coincidan con "${searchTerm}"`;
    }
    return 'No hay productos disponibles';
  }

  // 📌 NUEVO: Cambiar página
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.getProductos();
    }
  }

  refresh(): void {
    this.searchTermBackend.set('');
    this.searchSubject.next(''); // Resetear búsqueda
    this.currentPage = 1;
    this.getProductos();
    this.showSuccess('Lista actualizada');
  }

  onProductoGuardado(producto: ProductosInterface): void {
    this.currentPage = 1; // Volver a primera página
    this.getProductos();
    this.showSuccess(producto.id ? 'Producto actualizado' : 'Producto creado');
  }

  deleteProducto(id: number) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productosService.deleteProducto(id).subscribe({
        next: (response: any) => {
          this.currentPage = 1;
          this.getProductos();
          this.showSuccess('Registro eliminado correctamente');
        },
        error: (error: any) => {
          console.log('Error' + JSON.stringify(error));
          this.showError(error.message || 'Error al eliminar');
        }
      });
    }
  }

  // 📌 NUEVO: Búsqueda con debounce
  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  // 📌 NUEVO: Refresh manual
  // refresh(): void {
  //   this.currentPage = 1;
  //   this.getProductos();
  //   this.showSuccess('Lista actualizada');
  // }

  showSuccess(msg: any) {
    this.notyf.success(msg);
  }

  showError(msg: any) {
    this.notyf.error(msg);
  }
}
