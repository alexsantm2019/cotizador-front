// angular import
import { AfterViewInit, OnInit, ViewChild, inject, TemplateRef, signal, computed } from '@angular/core';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Notyf } from 'notyf';
// import { NuevoProductoComponent } from '../nuevo-producto/nuevo-producto.component';

// Servicio:
import { PaquetesService } from '../../../core/services/paquetes/paquetes.service'
import { PaqueteInterface } from '../../../core/models/paquetes.models';
import { PaqueteSearchComponent } from "../paquete-search/paquete-search.component";

@Component({
  selector: 'app-lista-paquetes',
  standalone: true,
  imports: [SharedModule, NgbModalModule, PaqueteSearchComponent],
  templateUrl: './lista-paquetes.component.html',
  styleUrls: ['./lista-paquetes.component.scss']
})
export class ListaPaquetesComponent implements OnInit {

  constructor(private router: Router) { }
  private notyf = new Notyf();

  private paquetesService = inject(PaquetesService);
  // paquetes: PaqueteInterface[] = [];
  paquetes = signal<PaqueteInterface[]>([]);
  currentPage = 1;
  pageSize = 10;
  itemsPerPage: number = 15;
  isEditMode: boolean = false;
  paqueteSeleccionado: PaqueteInterface | null = null;
  expandedPaquetes: { [key: number]: boolean } = {};
  visibleDetallesId: number | null = null;

  // Filtro:
  searchTerm = signal('');
  filteredPaquetes = computed(() =>
    this.paquetes().filter(item =>
      item.nombre_paquete.toLowerCase().includes(this.searchTerm().toLowerCase())
    )
  );

  ngOnInit(): void {
    this.getPaquetes();
  }

  // Verifica si los detalles de un paquete están visibles
  isDetalleVisible(id: number): boolean {
    return this.visibleDetallesId === id;
  }

  // Alterna la visibilidad de los detalles del paquete
  toggleDetalles(id: number): void {
    this.visibleDetallesId = this.visibleDetallesId === id ? null : id;
  }

  // Obtiene los paquetes desde el servicio
  getPaquetes(): void {
    this.paquetesService.getPaquetes().subscribe({
      next: (data) => {
        // this.paquetes = data;
        this.paquetes.set(data);
      },
      error: (error) => {
        console.error('Error en la búsqueda de paquetes:', error);
      },
    });
  }

  // Calcula los paquetes de la página actual
  // getPagedPaquetes(): PaqueteInterface[] {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   return this.paquetes.slice(startIndex, endIndex);
  // }
  getPagedPaquetes(): PaqueteInterface[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredPaquetes().slice(startIndex, startIndex + this.pageSize);
  }


  // Cambia la página de la tabla
  changePage(page: number): void {
    this.currentPage = page;
  }

  // Obtiene un arreglo de páginas posibles para la paginación
  getPageArray(totalItems: number): number[] {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Elimina un producto (paquete)
  deletePaquete(id: number): void {
    console.log('Eliminar paquete con id:', id);
    this.paquetesService.deletePaquete(id)
      .subscribe(
        (response: any) => {
          this.getPaquetes();
          this.showSuccess("Registro eliminado correctamente");
        },
        (error: any) => {
          console.log("Error" + JSON.stringify(error))
          this.showError(error);
        })
    // Lógica de eliminación aquí...
  }

  nuevoPaquete(): void {
    this.router.navigate(['/nuevo-paquete']);
  }

  editarPaquete(id: number): void {
    this.router.navigate(['/editar-paquete', id]);
  }

  //Filtro:
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
