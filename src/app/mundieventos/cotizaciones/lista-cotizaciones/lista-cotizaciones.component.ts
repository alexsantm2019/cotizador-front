// angular import
import { AfterViewInit, OnInit, ViewChild, inject, TemplateRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class ListaCotizacionesComponent implements OnInit, OnChanges {
  @ViewChild(CotizadorFormComponent) cotizadorFormComponent!: CotizadorFormComponent;
  @Output() editarCotizacionEvent = new EventEmitter<any>();

  constructor(private router: Router) {}
  private notyf = new Notyf();
  private modalService = inject(NgbModal);
  private cotizacionService = inject(CotizacionesService);
  private clientesService = inject(ClientesService);

  currentPage = 1;
  totalPages = 1;
  isLoading = false;
  hasMoreData = true;

  cotizaciones: CotizacionInterface[] = [];
  clientes: ClientesInterface[] = [];
  groupedCotizaciones: { fecha: string; cotizaciones: any[] }[] = [];
  groupedByMonth: any[] = [];
  mesesCargando: { [monthKey: string]: boolean } = {};
  paginasPorMes: { [monthKey: string]: number } = {};

  pageSize = 20;
  itemsPerPage: number = 15;
  isEditMode: boolean = false;
  paqueteSeleccionado: PaqueteInterface | null = null;
  expandedPaquetes: { [key: number]: boolean } = {};
  visibleDetallesId: number | null = null;

  cotizacionSeleccionada: any = null;
  mostrarFormulario = false;
  @Input() year!: number;
  @Input() refreshTrigger!: number;

  // Filtros:
  filtroFecha: string | null = null;
  filtroCliente: number | null = null;

  ngOnInit(): void {
    // this.getCotizaciones();
    this.getClientes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['year'] && changes['year'].currentValue) {
      this.getCotizaciones();
    }
    if (changes['refreshTrigger']) {
      this.getCotizaciones();
    }
  }

  // INstancia de formulario de cotizacion para solo ejecutar 1 vez:
  editarCotizacion(cotizacion: any) {
    this.cotizacionSeleccionada = cotizacion;
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.cotizacionSeleccionada = null;
  }

  onCotizacionGuardada() {
    this.isEditMode = false;
    this.mostrarFormulario = false;
    this.cotizacionSeleccionada = null;
    this.getCotizaciones();
  }

  onModalCerrado() {
    this.mostrarFormulario = false;
    this.isEditMode = false;
    this.cotizacionSeleccionada = null;
  }

  actualizarListaCotizaciones() {
    // this.mostrarFormulario = false;
    this.cotizacionSeleccionada = null;
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
  // getCotizaciones(): void {
  //   this.cotizacionService.getCotizaciones().subscribe({
  //     next: (data) => {
  //       this.cotizaciones = data;
  //       this.groupCotizacionesByFecha();
  //     },
  //     error: (error) => {
  //       console.error('Error en la búsqueda de paquetes:', error);
  //     },
  //   });
  // }

  // getCotizaciones(): void {
  //   if (this.year) {
  //     this.cotizacionService.getCotizacionesPorFecha(this.year).subscribe({
  //       next: (data) => {
  //         this.cotizaciones = data;
  //         this.groupCotizacionesByFecha();
  //       },
  //       error: (error) => {
  //         console.error('Error al obtener cotizaciones por año:', error);
  //       }
  //     });
  //   }
  // }

  // cargarMasPorMes(monthKey: string): void {
  //   if (this.mesesCargando[monthKey]) return;

  //   this.mesesCargando[monthKey] = true;

  //   const [year, month] = monthKey.split('-').map(Number);
  //   const paginaActual = this.paginasPorMes[monthKey] || 1;
  //   const siguientePagina = paginaActual + 1;

  //   this.cotizacionService.getCotizacionesAgrupadas(year, month, siguientePagina, this.pageSize).subscribe({
  //     next: (response: any) => {
  //       const mesExistente = this.groupedByMonth.find((m) => m.month_key === monthKey);

  //       if (mesExistente) {
  //         // Agregar nuevas cotizaciones
  //         mesExistente.cotizaciones = [...mesExistente.cotizaciones, ...response.data];
  //         mesExistente.tiene_mas = response.data.length >= this.pageSize;
  //       }

  //       this.paginasPorMes[monthKey] = siguientePagina;
  //       this.mesesCargando[monthKey] = false;
  //     },
  //     error: (error) => {
  //       console.error('Error:', error);
  //       this.mesesCargando[monthKey] = false;
  //     }
  //   });
  // }
  cargarMasPorMes(monthKey: string): void {
    if (this.mesesCargando[monthKey]) return;

    this.mesesCargando[monthKey] = true;

    const [year, month] = monthKey.split('-').map(Number);
    const paginaActual = this.paginasPorMes[monthKey] || 1;
    const siguientePagina = paginaActual + 1;

    console.log(`🔄 Cargando página ${siguientePagina} para ${monthKey}`);

    this.cotizacionService.getCotizacionesAgrupadas(year, month, siguientePagina, this.pageSize).subscribe({
      next: (response: any) => {
        console.log(`📦 Respuesta para ${monthKey}:`, response);

        const mesExistente = this.groupedByMonth.find((m) => m.month_key === monthKey);

        if (mesExistente && response.data && response.data.length > 0) {
          const mesData = response.data[0];

          if (mesData && mesData.cotizaciones) {
            // Filtrar registros vacíos
            const nuevasCotizaciones = mesData.cotizaciones.filter((cot: any) => cot.nombre_evento && cot.nombre_evento.trim() !== '');

            console.log(`✅ Recibidas ${nuevasCotizaciones.length} cotizaciones nuevas`);

            // Agregar nuevas cotizaciones
            mesExistente.cotizaciones = [...mesExistente.cotizaciones, ...nuevasCotizaciones];

            // ✅ ACTUALIZAR tiene_mas: si recibimos menos del pageSize, es la última página
            mesExistente.tiene_mas = nuevasCotizaciones.length >= this.pageSize;

            console.log(
              `📊 Mes ${monthKey}: ahora tiene ${mesExistente.cotizaciones.length} cotizaciones, tiene_mas=${mesExistente.tiene_mas}`
            );
          }
        }

        this.paginasPorMes[monthKey] = siguientePagina;
        this.mesesCargando[monthKey] = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.mesesCargando[monthKey] = false;
      }
    });
  }

  getCotizaciones(): void {
    if (!this.year) return;

    this.isLoading = true;

    let month: number | null = null;
    if (this.filtroFecha) {
      const [, mes] = this.filtroFecha.split('-').map(Number);
      month = mes;
    }

    this.cotizacionService.getCotizacionesAgrupadas(this.year, month, this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        console.log('📦 Respuesta API:', response);

        // Filtrar registros vacíos en cada mes
        const mesesFiltrados = (response.data || [])
          .map((mes: any) => {
            // Filtrar cotizaciones válidas
            const cotizacionesValidas = (mes.cotizaciones || []).filter((cot: any) => cot.nombre_evento && cot.nombre_evento.trim() !== '');

            return {
              ...mes,
              cotizaciones: cotizacionesValidas,
              total_en_mes: mes.total_en_mes || cotizacionesValidas.length,
              // ✅ CALCULAR tiene_mas BASADO EN EL TOTAL REAL DEL MES
              tiene_mas: (mes.total_en_mes || cotizacionesValidas.length) > this.pageSize
            };
          })
          .filter((mes: any) => mes.cotizaciones.length > 0); // Solo meses con cotizaciones

        console.log(
          '📊 Meses filtrados:',
          mesesFiltrados.map((m: any) => ({
            mes: m.month_name,
            mostradas: m.cotizaciones.length,
            total: m.total_en_mes,
            tiene_mas: m.tiene_mas
          }))
        );

        if (this.currentPage === 1) {
          this.groupedByMonth = mesesFiltrados;

          // Inicializar páginas por mes
          this.groupedByMonth.forEach((mes) => {
            this.paginasPorMes[mes.month_key] = 1;
          });
        } else {
          // Agregar nuevos meses
          mesesFiltrados.forEach((nuevoMes: any) => {
            const existe = this.groupedByMonth.find((m) => m.month_key === nuevoMes.month_key);
            if (!existe) {
              this.groupedByMonth.push(nuevoMes);
              this.paginasPorMes[nuevoMes.month_key] = 1;
            }
          });
        }

        // Ordenar meses del más reciente al más antiguo
        this.groupedByMonth.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.month_number - a.month_number;
        });

        this.totalPages = response.pagination?.total_paginas_global || 1;
        this.hasMoreData = this.currentPage < this.totalPages;
        this.isLoading = false;

        console.log('✅ groupedByMonth final:', this.groupedByMonth);
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading = false;
      }
    });
  }

  private mergeGroupedData(existing: any[], newData: any[]): any[] {
    const merged = [...existing];

    for (const newGroup of newData) {
      const existingGroup = merged.find((g) => g.fecha === newGroup.fecha);
      if (existingGroup) {
        existingGroup.cotizaciones = [...existingGroup.cotizaciones, ...newGroup.cotizaciones];
      } else {
        merged.push(newGroup);
      }
    }

    // Ordenar por fecha descendente
    return merged.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  // limpiarFiltros(): void {
  //   // Poner ambos filtros en null
  //   this.filtroFecha = null;
  //   this.filtroCliente = null;

  //   // Llamar a aplicarFiltros() para actualizar la lista sin filtros
  //   this.aplicarFiltros();
  // }

  limpiarFiltros(): void {
    this.filtroFecha = null;
    this.filtroCliente = null;
    this.currentPage = 1;
    this.groupedByMonth = []; // ✅ Cambiar a groupedByMonth
    this.getCotizaciones();
  }

  trackByFecha(index: number, group: any): string {
    return group.fecha;
  }

  trackByMonthKey(index: number, month: any): string {
    return month?.month_key || index.toString();
  }

  trackByCotizacionId(index: number, cotizacion: any): number {
    return cotizacion.id;
  }

  // aplicarFiltros(): void {
  //   this.groupedCotizaciones = this.filtrarCotizaciones();
  // }

  aplicarFiltros(): void {
    this.currentPage = 1;
    this.groupedByMonth = []; // ✅ Cambiar a groupedByMonth
    this.getCotizaciones();
  }

  cargarMas(): void {
    if (this.hasMoreData && !this.isLoading) {
      this.currentPage++;
      this.getCotizaciones();
    }
  }

  filtrarCotizaciones() {
    const groupedMap = new Map<string, any[]>();

    if (this.filtroFecha === '') {
      this.filtroFecha = null;
    }

    this.cotizaciones.forEach((cotizacion) => {
      const fecha = new Date(cotizacion.fecha_creacion);
      const fechaUTC = fecha.toISOString().split('T')[0];

      // Si filtroFecha está vacío o nulo, ignorar el filtro
      const aplicarFiltroFecha = this.filtroFecha && this.filtroFecha.trim() !== '';
      if (aplicarFiltroFecha && fechaUTC !== this.filtroFecha) {
        return;
      }

      // Aplicar filtro por cliente solo si tiene un valor válido
      const clienteId =
        this.filtroCliente && Boolean(this.filtroCliente) && this.filtroCliente !== 0 ? parseInt(String(this.filtroCliente), 10) : null;

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
      cotizaciones
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
      cotizaciones
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
    this.cotizacionService.deleteCotizacion(id).subscribe(
      (response: any) => {
        this.getCotizaciones();
        this.showSuccess('Registro eliminado correctamente');
      },
      (error: any) => {
        console.log('Error' + JSON.stringify(error));
        this.showError(error);
      }
    );
  }

  // editarCotizacion(cotizacion: any): void {
  //   this.editarCotizacionEvent.emit(cotizacion);
  // }

  // actualizarListaCotizaciones(): void {
  //   this.getCotizaciones();
  // }

  getClientes(): void {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      }
    });
  }

  downloadPDF(id: number): void {
    this.cotizacionService.downloadPDF(id).subscribe({
      next: (response) => {
        const blob = response.body as Blob;
        const fileURL = URL.createObjectURL(blob);

        // Leer nombre desde el encabezado Content-Disposition
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'cotizacion.pdf'; // nombre por defecto

        if (contentDisposition) {
          const matches = /filename="?([^"]+)"?/i.exec(contentDisposition);
          if (matches && matches[1]) {
            fileName = matches[1];
          }
        } else {
          console.log('No se lee content-disposition');
        }

        // Crear el enlace para descargar
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = fileName;
        a.click();

        // Liberar memoria
        URL.revokeObjectURL(fileURL);

        this.showSuccess(`Cotización descargada correctamente como ${fileName}`);
      },
      error: (error) => {
        console.error('❌ Error al descargar el PDF:', error);
      }
    });
  }

  // downloadPDF(id: number): void {
  //   this.cotizacionService.downloadPDF(id).subscribe({
  //     next: (data: Blob) => {
  //       const fileURL = URL.createObjectURL(data);
  //       const a = document.createElement('a');
  //       const now = new Date();

  //       const year = now.getFullYear();
  //       const month = String(now.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
  //       const day = String(now.getDate()).padStart(2, '0');
  //       const hours = String(now.getHours()).padStart(2, '0');
  //       const minutes = String(now.getMinutes()).padStart(2, '0');
  //       const seconds = String(now.getSeconds()).padStart(2, '0');
  //       const fecha = `${year}${month}${day}_${hours}${minutes}${seconds}`;

  //       a.href = fileURL;
  //       a.download = `cotizacion_${fecha}.pdf`;
  //       a.target = '_blank';
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);

  //       this.showSuccess('Cotización abierta y descargada exitosamente');
  //     },
  //     error: (error) => {
  //       console.error('Error en la descarga del PDF:', error);
  //     },
  //   });
  // }

  showSuccess(msg: any) {
    this.notyf.success(msg);
  }
  showError(msg: any) {
    this.notyf.error(msg);
  }
}
