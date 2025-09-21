// angular import
import { TemplateRef, Component, OnInit, inject, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModalModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Notyf } from 'notyf';

// Servicio:
import { ClientesService } from '../../../core/services/clientes/clientes.service'
import { PaquetesService } from '../../../core/services/paquetes/paquetes.service'
import { ProductosService } from '../../../core/services/productos/productos.service'
import { CotizacionesService } from '../../../core/services/cotizador/cotizador.service'
import { CatalogosService } from '../../../core/services/catalogos/catalogos.service'
import { CATALOGOS } from '../../utils/catalogo';

import { ProductosInterface } from '../../../core/models/productos.model';
import { ClientesInterface } from '../../../core/models/clientes.models';
import { PaqueteInterface } from '../../../core/models/paquetes.models';
import { DetalleInterface } from '../../../core/models/detalles.models';

@Component({
  selector: 'app-cotizacion-form',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './cotizacion-form.component.html',
  styleUrls: ['./cotizacion-form.component.scss']
})
export class CotizadorFormComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() cotizacionExistente: any = null;
  @Output() cotizacionGuardada = new EventEmitter<void>();

  modalRef: NgbModalRef | undefined;
  private modalService = inject(NgbModal);

  private clientesService = inject(ClientesService);
  private paquetesService = inject(PaquetesService);
  private productosService = inject(ProductosService);
  private cotizacionesService = inject(CotizacionesService);
  private catalogosService = inject(CatalogosService);

  cliente: number = 0;
  producto: ProductosInterface | null = null;
  paquete: PaqueteInterface | null = null;
  iva: number = 0;
  estado: number = 1;

  clientes: ClientesInterface[] = [];
  paquetes: PaqueteInterface[] = [];
  productos: ProductosInterface[] = [];
  itemsCotizacion: any[] = [];
  ivaOptions = [
    { value: 0, label: '0%' },
    { value: 15, label: '15%' }
  ];
  estadosCotizacion: any;

  paqueteForm!: FormGroup;
  private notyf = new Notyf();

  constructor(
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getClientes();
    this.getProductos();
    this.getPaquetes();
    this.getEstadosCotizacion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cotizacionExistente'] && changes['cotizacionExistente'].currentValue) {
      this.cargarCotizacion(this.cotizacionExistente);
    }
  }

  getEstadosCotizacion(): void {
    this.catalogosService.getCatalogoByGrupo(CATALOGOS.GRUPO_ESTADOS_COTIZACIONES).subscribe({
      next: (data) => {
        this.estadosCotizacion = data;
      },
      error: (error) => {
        console.error('Error al obtener tipo de costos:', error);
      }
    });
  }

  cargarCotizacion(cotizacion: any): void {
    if (cotizacion) {
      // Limpia itemsCotizacion para evitar datos duplicados
      this.itemsCotizacion = [];

      // Reutiliza poblarItemsCotizacion para construir los items
      this.poblarItemsCotizacion(cotizacion);
    }
  }

  poblarItemsCotizacion(cotizacion: any): void {
    if (!cotizacion || !cotizacion.detalles || !Array.isArray(cotizacion.detalles)) {
      console.warn('La cotización no tiene detalles o no está correctamente estructurada.');
      return;
    }
    this.cliente = cotizacion.cliente;  //OK
    this.iva = parseFloat(cotizacion.iva);  //OK
    this.estado = parseFloat(cotizacion.estado);  //OK
    cotizacion.detalles.forEach((detalle: DetalleInterface) => {
      const tipoItem = detalle.tipo_item;

      // Para productos individuales (tipo_item 1 o 3)
      if (tipoItem === 1 || tipoItem === 3) {
        this.itemsCotizacion.push({
          id: detalle.info_producto?.id,
          nombre: detalle.info_producto?.producto,
          cantidad: detalle.cantidad || 1,
          descuento: detalle.descuento || 0,
          precio_unitario: detalle.info_producto?.costo || 0,
          total: (detalle.cantidad || 1) * (detalle.info_producto?.costo || 0),
          tipo: tipoItem,
          disable: false, // Productos dentro de paquetes son deshabilitados
        });
        this.actualizarTotal(this.itemsCotizacion.length - 1);
      }

      // Para paquetes (tipo_item 2)
      if (tipoItem === 2 && detalle.info_paquete) {
        this.itemsCotizacion.push({
          id: detalle.info_paquete.id,
          nombre: detalle.info_paquete.nombre_paquete,
          cantidad: detalle.cantidad || 1,
          descuento: detalle.descuento || 0,
          precio_unitario: null,
          total: null,
          tipo: tipoItem,
          disable: true, // Paquetes deshabilitados
        });
        this.actualizarTotal(this.itemsCotizacion.length - 1);
      }
    });
  }
  getClientes(): void {
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      error: (error) => {
        console.error('Error en la búsqueda de clientes:', error);
      },
    });
  }

  getProductos(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data.map((producto: any) => ({
          ...producto,
          tipo_costo: producto.tipo_costo,
          costo: producto.costo,
        })).sort((a, b) => a.producto.localeCompare(b.producto));
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }

  getPaquetes(): void {
    this.paquetesService.getPaquetes().subscribe({
      next: (data) => {
        this.paquetes = data.sort((a, b) => a.nombre_paquete.localeCompare(b.nombre_paquete));
      },
      error: (error) => {
        console.error('Error en la búsqueda de paquetes:', error);
      },
    });
  }

  actualizarTotal(index: number): void {
    const item = this.itemsCotizacion[index];
    // Validar que la cantidad sea al menos 1
    if (item.cantidad < 1) {
      item.cantidad = 1;
    }

    // Asegurarse de que el descuento no sea negativo ni indefinido
    if (item.descuento === null || item.descuento === undefined || isNaN(item.descuento)) {
      item.descuento = 0; // Restablece a 0 si el valor es inválido
    }

    if (item.descuento < 0) {
      item.descuento = 0; // Descuento no puede ser negativo
    }

    // Calcular el subtotal y el total considerando el descuento
    const subtotal = item.cantidad * item.precio_unitario;
    item.total = subtotal - item.descuento;

    // Evitar que el total sea negativo
    if (item.total < 0) {
      item.total = 0;
    }
  }

  eliminarItem(index: number): void {
    this.itemsCotizacion.splice(index, 1);
  }

  showSuccess(msg: any) {
    this.notyf.success(msg);
  }
  showError(msg: any) {
    this.notyf.error(msg);
  }
  agregarProducto(): void {
    if (this.producto) {
      this.itemsCotizacion.push({
        id: this.producto.id,
        nombre: this.producto.producto,
        cantidad: 1,
        descuento: 0,
        precio_unitario: this.producto.costo,
        total: this.producto.costo,
        tipo: 1,
        disable: false
      });
      this.producto = null; // Resetea el select
    }
  }

  agregarPaquete(): void {
    if (this.paquete) {
      this.itemsCotizacion.push({
        id: this.paquete.id,
        nombre: this.paquete.nombre_paquete,
        cantidad: 1,
        descuento: 0,
        precio_unitario: null,
        total: null,
        tipo: 2,
        disable: true
      });

      this.paquetesService.getPaqueteById(this.paquete.id).subscribe(paqueteData => {
        const paquete = paqueteData[0]; // El paquete viene dentro de un array
        // Comprobamos si detalles existe y es un array
        if (paquete && Array.isArray(paquete.detalles)) {
          // Llamamos a los detalles del paquete
          paquete.detalles.forEach(detalle => {
            const cantidad = detalle.cantidad || 0; // Asegura que cantidad sea un número válido
            const costoProducto = detalle.costo_producto || 0;
            const precioUnitario = cantidad > 0 ? costoProducto / cantidad : 0;
            // Aquí asignamos tipo_item 3 a los productos dentro del paquete
            this.itemsCotizacion.push({
              id: detalle.producto.id,
              nombre: detalle.producto.producto,
              cantidad: cantidad,
              descuento: 0,
              precio_unitario: precioUnitario,
              total: costoProducto,
              tipo: 3,
              disable: false
            });
          });
        } else {
          console.warn('El paquete no tiene detalles o detalles es undefined.');
        }
      });
      this.paquete = null; // Resetea el select
    }
  }

  guardarCotizacion() {
    const cotizacion = {
      id: this.cotizacionExistente?.id, // Añade el ID si existe
      cliente: Number(this.cliente),
      iva: this.iva,
      estado: this.estado,
      subtotal: this.calcularSubtotal(),
      total: this.calcularTotal(),
      detalles: this.itemsCotizacion.map(item => ({
        cantidad: item.cantidad,
        paquete: item.tipo === 2 ? item.id : null,
        producto: (item.tipo === 1 || item.tipo === 3) ? item.id : null,
        tipo_item: item.tipo,
        descuento: parseFloat(item.descuento)
      }))
    };

    if (cotizacion.id) {
      // Editar cotización existente
      console.log("Cotizacion: " + JSON.stringify(cotizacion))
      this.cotizacionesService.updateCotizacion(cotizacion.id, cotizacion).subscribe({
        next: (response) => {
          this.showSuccess('Cotización actualizada exitosamente');
          this.cotizacionGuardada.emit();
        },
        error: (error) => {
          this.showError('Error al actualizar la cotización: ' + error);
          console.error('Error:', error);
        }
      });
    } else {
      // Crear una nueva cotización
      this.cotizacionesService.createCotizacion(cotizacion).subscribe({
        next: (response) => {
          this.showSuccess('Cotización guardada exitosamente');
          this.cotizacionGuardada.emit();
        },
        error: (error) => {
          this.showError('Error al guardar la cotización');
          console.error('Error:', error);
        }
      });
    }
    this.limpiarFormulario();
    this.closeModal();
  }
  calcularSubtotal(): number {
    return this.itemsCotizacion.reduce((sum, item) => {
      const itemTotal = parseFloat(item.total);
      return !isNaN(itemTotal) ? sum + itemTotal : sum;
    }, 0);
  }

  calcularTotal(): number {
    const subtotal = this.calcularSubtotal();
    const total = subtotal + (subtotal * (this.iva / 100));
    return parseFloat(total.toFixed(2));  // Limita a 2 decimales
  }
  limpiarFormulario() {
    this.cliente = 0;
    this.estado = 1;
    this.producto = null;
    this.paquete = null;
    this.iva = 0;
    this.itemsCotizacion = [];
    this.cdr.detectChanges();
  }

  openModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  }
  closeModal() {
    if (this.modalRef) {
      this.modalRef.dismiss(); // Cancela el modal con un estado de rechazo
    }
  }


}