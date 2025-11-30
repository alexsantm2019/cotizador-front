// angular import
import {
  TemplateRef, Component, EventEmitter, OnInit, ViewChild, inject, Input, Output,
  input, output
} from '@angular/core';
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
import { ClientesService } from '../../../core/services/clientes/clientes.service'
import { CatalogosService } from '../../../core/services/catalogos/catalogos.service'
import { CategoriaProductoService } from '../../../core/services/categoria-producto/categoria-producto.service'
import { ClientesInterface } from '../../../core/models/clientes.models';
import { CategoriaProductoInterface } from '../../../core/models/categoria-producto.models';

@Component({
  selector: 'app-nuevo-cliente',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.scss']
})
export class NuevoClienteComponent {

  private modalService = inject(NgbModal);
  private clientesService = inject(ClientesService);
  private catalogosService = inject(CatalogosService);
  private categoriaProductoService = inject(CategoriaProductoService);

  @Input() cliente: ClientesInterface | null = null;
  @Input() isEditMode: boolean = false;
  clienteGuardado = output<ClientesInterface>();

  clienteForm!: FormGroup;

  private notyf = new Notyf();

  constructor(
    private formBuilder: FormBuilder) {
    this.clienteForm = this.formBuilder.group({
      id: [null],
      nombre: ['', [Validators.required]],
      identificacion: [''],
      correo: [''],
      telefono: [''],
      direccion: [''],
    })
  }

  modalRef: NgbModalRef | undefined;
  clienteSeleccionado: ClientesInterface | null = null;

  ngOnInit(): void {
    if (this.cliente) {
      this.clienteForm.patchValue({ ...this.cliente }); // Actualiza el formulario con los valores del producto
    }
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const formValue = this.clienteForm.value; // Obtén solo los valores del formulario

    if (this.isEditMode) {
      const id = formValue.id; // Extrae el ID del formulario
      this.clientesService.updateCliente(id, formValue).subscribe({
        next: (producto) => {
          this.clienteGuardado.emit(producto);
          this.closeModal();
          this.showSuccess("Registro actualizado correctamente");
        },
        error: (error) => console.error('Error al actualizar el producto:', error),
      });
    } else {
      this.clientesService.createCliente(formValue).subscribe({
        next: (data) => {
          this.clienteGuardado.emit(data);
          this.resetForm();
          this.closeModal();

          this.showSuccess("Registro almacenado correctamente");
        },
        error: (error) => console.error('Error al crear el producto', error),
      });
    }
  }

  resetForm(): void {
    // this.productoForm = { id: 0, producto: '', descripcion: '', tipo_costo: 0, costo: 0, estado: 1, ubicacion: '' }; // Reseteamos el producto
    //this.productoForm = {  producto: '', descripcion: '', tipo_costo: 0, costo: 0, estado: 1, ubicacion: '' }; // Reseteamos el producto
  }

  openModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  closeModal() {
    if (this.modalRef) {
      this.modalRef.dismiss(); // Cancela el modal con un estado de rechazo
    }
  }

  showSuccess(msg: any) {
    this.notyf.success(msg);
  }
  showError(msg: any) {
    this.notyf.error(msg);
  }

}