// angular import
import { AfterViewInit, OnInit, ViewChild, inject, TemplateRef, Output, EventEmitter } from '@angular/core';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Notyf } from 'notyf';


// Servicio:
import { CotizadorFormComponent } from '../cotizacion-form/cotizacion-form.component';
import { EnviarCotizacionComponent } from '../_enviar-cotizacion/enviar-cotizacion.component';
import { PaqueteInterface } from '../../../core/models/paquetes.models';
import { CotizacionesService } from '../../../core/services/cotizador/cotizador.service'
import { CotizacionInterface } from '../../../core/models/cotizaciones.model';
import { ClientesService } from '../../../core/services/clientes/clientes.service'
import { ClientesInterface } from '../../../core/models/clientes.models';
import { DelayAnimationsComponent } from '../../ui/delay/delay-animations.component';

@Component({
  selector: 'app-lista-cotizaciones',
  standalone: true,
  imports: [SharedModule, NgbModalModule, CotizadorFormComponent, EnviarCotizacionComponent, DelayAnimationsComponent],
  templateUrl: './lista-cotizaciones.component.html',
  styleUrls: ['./lista-cotizaciones.component.scss']
})
export class ListaCotizacionesComponent implements OnInit {
  @ViewChild(CotizadorFormComponent) cotizadorFormComponent!: CotizadorFormComponent;
  @Output() editarCotizacionEvent = new EventEmitter<any>();

  constructor(private router: Router) { }
  private notyf = new Notyf();
  private modalService = inject(NgbModal);
  private cotizacionService = inject(CotizacionesService);
  private clientesService = inject(ClientesService);

  cotizaciones: CotizacionInterface[] = [];
  clientes: ClientesInterface[] = [];
  groupedCotizaciones: { fecha: string; cotizaciones: any[] }[] = [];
  currentPage = 1;
  pageSize = 10;
  itemsPerPage: number = 15;
  isEditMode: boolean = false;
  paqueteSeleccionado: PaqueteInterface | null = null;
  expandedPaquetes: { [key: number]: boolean } = {};
  visibleDetallesId: number | null = null;

  // Filtros:
  filtroFecha: string | null = null;
  filtroCliente: number | null = null;

  ngOnInit(): void {
    this.getCotizaciones();
    this.getClientes();
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
  getCotizaciones(): void {
    this.cotizacionService.getCotizaciones().subscribe({
      next: (data) => {
        this.cotizaciones = data;
        this.groupCotizacionesByFecha();
      },
      error: (error) => {
        console.error('Error en la búsqueda de paquetes:', error);
      },
    });
  }

  limpiarFiltros(): void {
    // Poner ambos filtros en null
    this.filtroFecha = null;
    this.filtroCliente = null;

    // Llamar a aplicarFiltros() para actualizar la lista sin filtros
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.groupedCotizaciones = this.filtrarCotizaciones();
  }

  filtrarCotizaciones() {
    const groupedMap = new Map<string, any[]>();

    if (this.filtroFecha === "") {
      this.filtroFecha = null;
    }

    this.cotizaciones.forEach((cotizacion) => {
      const fecha = new Date(cotizacion.fecha_creacion);
      const fechaUTC = fecha.toISOString().split('T')[0];

      // Si filtroFecha está vacío o nulo, ignorar el filtro
      const aplicarFiltroFecha = this.filtroFecha && this.filtroFecha.trim() !== "";
      if (aplicarFiltroFecha && fechaUTC !== this.filtroFecha) {
        return;
      }

      // Aplicar filtro por cliente solo si tiene un valor válido
      const clienteId = this.filtroCliente && Boolean(this.filtroCliente) && this.filtroCliente !== 0 ? parseInt(String(this.filtroCliente), 10) : null;
      console.log("5. Filtro cliente: ", clienteId);

      if (clienteId !== null && cotizacion.cliente !== clienteId) {
        return;
      }

      if (!groupedMap.has(fechaUTC)) {
        groupedMap.set(fechaUTC, []);
      }
      groupedMap.get(fechaUTC)?.push(cotizacion);
    });

    return Array.from(groupedMap.entries()).map(([fecha, cotizaciones]) => ({
      fecha,
      cotizaciones,
    }));
  }

  groupCotizacionesByFecha() {
    const groupedMap = new Map<string, any[]>();

    this.cotizaciones.forEach((cotizacion) => {
      const fechaCreacion = new Date(cotizacion.fecha_creacion);

      // Extraer la fecha en la zona horaria local
      const fechaLocal = `${fechaCreacion.getFullYear()}-${(fechaCreacion.getMonth() + 1).toString().padStart(2, '0')}-${fechaCreacion.getDate().toString().padStart(2, '0')}`;

      if (!groupedMap.has(fechaLocal)) {
        groupedMap.set(fechaLocal, []);
      }
      groupedMap.get(fechaLocal)?.push(cotizacion);
    });

    // Convertir el Map en un arreglo para el template
    this.groupedCotizaciones = Array.from(groupedMap.entries()).map(([fecha, cotizaciones]) => ({
      fecha,
      cotizaciones,
    }));
  }

  // Calcula los paquetes de la página actual
  getPagedCotizaciones(): CotizacionInterface[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.cotizaciones.slice(startIndex, endIndex);
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
  deleteCotizacion(id: number): void {
    this.cotizacionService.deleteCotizacion(id)
      .subscribe(
        (response: any) => {
          this.getCotizaciones();
          this.showSuccess("Registro eliminado correctamente");
        },
        (error: any) => {
          console.log("Error" + JSON.stringify(error))
          this.showError(error);
        })
  }

  editarCotizacion(cotizacion: any): void {
    this.editarCotizacionEvent.emit(cotizacion);
  }

  actualizarListaCotizaciones(): void {
    this.getCotizaciones();
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

  downloadPDF(id: number): void {
    this.cotizacionService.downloadPDF(id).subscribe({
      next: (data: Blob) => {
        const fileURL = URL.createObjectURL(data);
        const a = document.createElement('a');
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const fecha = `${year}${month}${day}_${hours}${minutes}${seconds}`;

        a.href = fileURL;
        a.download = `cotizacion_${fecha}.pdf`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        this.showSuccess('Cotización abierta y descargada exitosamente');
      },
      error: (error) => {
        console.error('Error en la descarga del PDF:', error);
      },
    });
  }

  showSuccess(msg: any) {
    this.notyf.success(msg);
  }
  showError(msg: any) {
    this.notyf.error(msg);
  }

}
