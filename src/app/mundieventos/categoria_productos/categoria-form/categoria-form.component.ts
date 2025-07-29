// angular import
import {TemplateRef, Component, EventEmitter, OnInit, ViewChild, inject, Input, Output, SimpleChanges  } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { NgbModal, NgbModalRef, NgbModalModule, ModalDismissReasons  } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Notyf } from 'notyf';

// Servicio:
import { CategoriaProductoService } from '../../services/categoria-producto/categoria-producto.service'
import { CategoriaProductoInterface } from '../../models/categoria-producto.models';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss']
})
export class CategoriaFormComponent {
  private categoriaProductoService = inject(CategoriaProductoService);

  @Input() isEditMode: boolean = false; // Modo edición o creación  
  @Input() categoriaEditada: CategoriaProductoInterface | null = null; // Recibe datos al editar
  @Output() categoriaGuardada = new EventEmitter<void>(); // Evento para notificar cambios

  categoriaForm!: FormGroup;
  private  notyf = new Notyf();

  constructor(
    private formBuilder: FormBuilder) {
    this.categoriaForm = this.formBuilder.group({   
      id: [null],   
      categoria: ['', [Validators.required]],               
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.categoriaEditada) {
      console.log("cambiando.....")
      this.isEditMode = true;
      this.categoriaForm.patchValue(this.categoriaEditada); // Rellenar formulario si es edición
    }
  }

  changeEditMode(): void {
    this.isEditMode = false;
    this.resetForm();
  }

  onSubmit(): void {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    const formValue = this.categoriaForm.value;

    if (this.isEditMode) {
      const id = formValue.id;
      this.categoriaProductoService.updateCategoriaProducto(id, formValue).subscribe({
        next: () => {          
          this.categoriaGuardada.emit(); // Emitimos evento         
          this.showSuccess('Registro actualizado correctamente');
          this.changeEditMode();
        },
        error: (error) => console.error('Error al actualizar:', error),
      });
    } else {
      this.categoriaProductoService.createCategoriaProducto(formValue).subscribe({
        next: () => {
          this.categoriaGuardada.emit(); // Emitimos evento          
          this.showSuccess('Registro almacenado correctamente');
        },
        error: (error) => console.error('Error al crear:', error),
      });
    }
    // this.resetForm();
    setTimeout(() => {
      this.resetForm();
    }, 500);
  }

  resetForm(): void {
    this.categoriaForm.reset(); // Resetea los valores

    // Se asegura de que el formulario esté limpio
    this.categoriaForm.markAsPristine();
    this.categoriaForm.markAsUntouched();
    
    // Salimos del modo edición
    this.isEditMode = false;
  }
  showSuccess(msg:any) {
    this.notyf.success(msg);
  }
  showError(msg:any) {
    this.notyf.error(msg);
  }

}