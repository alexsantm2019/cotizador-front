// angular import
import { TemplateRef, Component, EventEmitter, OnInit, ViewChild, inject, Input, Output, SimpleChanges } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModalModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Notyf } from 'notyf';
// import { ToastComponent } from '../../ui/toast/toast.component';

// Servicio:
import { ProductosService } from '../../../core/services/productos/productos.service'
import { CatalogosService } from '../../../core/services/catalogos/catalogos.service'
import { CategoriaProductoService } from '../../../core/services/categoria-producto/categoria-producto.service'
import { ProductosInterface } from '../../../core/models/productos.model';
import { CategoriaProductoInterface } from '../../../core/models/categoria-producto.models';
import { CATALOGOS } from '../../utils/catalogo';

@Component({
  selector: 'app-nuevo-producto',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.scss']
})
export class NuevoProductoComponent {

  private modalService = inject(NgbModal);
  private productosService = inject(ProductosService);
  private catalogosService = inject(CatalogosService);
  private categoriaProductoService = inject(CategoriaProductoService);
  private notyf = new Notyf();

  @Input() producto: ProductosInterface | null = null; // Producto recibido del padre
  @Input() isEditMode: boolean = false; // Modo edición o creación
  @Output() productoGuardado = new EventEmitter<ProductosInterface>(); // Evento al guardar producto

  productoForm!: FormGroup;
  tipoCostos: any;
  estadosProductos: any;

  categoriasProductos: CategoriaProductoInterface[] = [];

  constructor(
    private formBuilder: FormBuilder) {
    this.productoForm = this.formBuilder.group({
      id: [null],
      producto: ['', [Validators.required]],
      descripcion: [''],
      tipo_costo: ['', [Validators.required]],
      costo: [0, [Validators.required, Validators.min(0)]],
      ubicacion: [''],
      estado: ['', [Validators.required]],
      categoria_producto_id: ['', [Validators.required]],
    })
  }

  modalRef: NgbModalRef | undefined;
  productoSeleccionado: ProductosInterface | null = null;

  ngOnInit(): void {
    if (this.producto) {
      this.productoForm.patchValue({ ...this.producto }); // Actualiza el formulario con los valores del producto
    }
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const formValue = this.productoForm.value; // Obtén solo los valores del formulario

    if (this.isEditMode) {
      const id = formValue.id; // Extrae el ID del formulario
      this.productosService.updateProducto(id, formValue).subscribe({
        next: (producto) => {
          this.productoGuardado.emit(producto);
          this.closeModal();
          this.showSuccess("Registro actualizado correctamente");
        },
        error: (error) => console.error('Error al actualizar el producto:', error),
      });
    } else {
      this.productosService.createProducto(formValue).subscribe({
        next: (data) => {
          this.productoGuardado.emit(data);
          this.resetForm();
          this.closeModal();

          this.showSuccess("Registro almacenado correctamente");
        },
        error: (error) => console.error('Error al crear el producto', error),
      });
    }
  }

  resetForm(): void {
    this.productoForm.reset(); // Resetea los valores

    // Se asegura de que el formulario esté limpio
    this.productoForm.markAsPristine();
    this.productoForm.markAsUntouched();
  }

  openModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.getCategoriaProducto();
    this.getTipoCostos();
    this.getEstadosProducto();
  }
  closeModal() {
    if (this.modalRef) {
      this.modalRef.dismiss(); // Cancela el modal con un estado de rechazo
    }
  }

  getCategoriaProducto(): void {
    this.categoriaProductoService.getCategoriaProducto().subscribe({
      next: (data) => {
        this.categoriasProductos = data;
      },
      error: (error) => {
        console.error('Error en la búsqueda de productos:', error);
      },
    });
  }
  getTipoCostos(): void {
    this.catalogosService.getCatalogoByGrupo(CATALOGOS.GRUPO_TIPO_COSTOS_PRODUCTOS).subscribe({
      next: (data) => {
        this.tipoCostos = data;  // Asignamos los datos obtenidos
      },
      error: (error) => {
        console.error('Error al obtener tipo de costos:', error);
      }
    });
  }
  getEstadosProducto(): void {
    this.catalogosService.getCatalogoByGrupo(CATALOGOS.GRUPO_ESTADOS_PRODUCTOS).subscribe({
      next: (data) => {
        this.estadosProductos = data;  // Asignamos los datos obtenidos        
      },
      error: (error) => {
        console.error('Error al obtener tipo de costos:', error);
      }
    });
  }

  showSuccess(msg: any) {
    this.notyf.success(msg);
  }
  showError(msg: any) {
    this.notyf.error(msg);
  }

}