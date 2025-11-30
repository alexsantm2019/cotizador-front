import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild, inject, TemplateRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogosService } from '../../core/services/catalogos/catalogos.service';
import { CatalogosInterface } from '../../core/models/catalogos.models';
import { Notyf } from 'notyf';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.scss']
})
export class CatalogosComponent implements OnInit {

  catalogos: CatalogosInterface[] = [];
  grupoSeleccionado: number | null = null;
  nombreSeleccionado: string | null = null;
  nuevoCatalogo: Partial<CatalogosInterface> = {};
  nuevoForm!: FormGroup;

  editando: CatalogosInterface | null = null;
  private notyf = new Notyf();
  // constructor(private catalogosService: CatalogosService) { }

  private catalogosService = inject(CatalogosService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.nuevoForm = this.fb.group({
      grupo: ['', Validators.required],
      codigo: ['', Validators.required],
      item: ['', Validators.required],
      detalle: ['', Validators.required],
      color: ['']
    });
    this.searchCatalogosActivo();
  }

  cargarCatalogo(): void {
    if (!this.grupoSeleccionado) return;
    this.catalogosService.getCatalogoByGrupo(this.grupoSeleccionado).subscribe({
      next: (data) => this.catalogos = data,
      error: (err) => console.error(err)
    });
  }
  searchCatalogoByNombre(): void {
    if (!this.nombreSeleccionado) return;
    this.catalogosService.getCatalogoByNombre(this.nombreSeleccionado).subscribe({
      next: (data) => this.catalogos = data,
      error: (err) => console.error(err)
    });
  }

  searchCatalogos(): void {
    this.catalogosService.getCatalogos().subscribe({
      next: (data) => this.catalogos = data,
      error: (err) => console.error(err)
    });
  }
  searchCatalogosActivo(): void {
    this.catalogosService.getCatalogosActivos().subscribe({
      next: (data) => this.catalogos = data,
      error: (err) => console.error(err)
    });
  }


  // guardarCatalogo(): void {
  //   if (this.editando) {
  //     this.catalogosService.updateCatalogo(this.editando.id, this.editando).subscribe(() => {
  //       this.searchCatalogosActivo();
  //       this.cancelarEdicion();
  //     });
  //   } else {
  //     this.catalogosService.createCatalogo(this.nuevoCatalogo as CatalogosInterface).subscribe(() => {
  //       this.searchCatalogosActivo();
  //       this.nuevoCatalogo = {};
  //     });
  //   }
  // }


  guardarCatalogo(): void {
    if (this.nuevoForm.invalid) {
      this.nuevoForm.markAllAsTouched(); // 💥 Marca errores al tocar “Guardar”
      return;
    }

    const data = this.nuevoForm.value;

    this.catalogosService.createCatalogo(data).subscribe({
      next: () => {
        this.searchCatalogosActivo();
        // this.toastr.success("Catálogo guardado correctamente");
        this.nuevoForm.reset();
      },
      error: (err) => {
        // this.toastr.error("Ocurrió un error");
        console.error(err);
      }
    });
  }



  onInputChange(catalogo: any, field: string, value: any): void {
    catalogo[field] = value;
  }

  updateCatalogo(catalogo: CatalogosInterface): void {
    this.catalogosService.updateCatalogo(catalogo.id, catalogo).subscribe({
      next: () => {
        this.showSuccess("Registro actualizado correctamente");
        this.searchCatalogosActivo();
        this.cancelarEdicion();
      },
      error: (err) => console.error(err)
    });
  }

  editarCatalogo(catalogo: CatalogosInterface): void {
    this.editando = { ...catalogo };
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarCatalogo(id: number): void {
    if (confirm('¿Deseas eliminar este registro?')) {
      this.catalogosService.deleteCatalogo(id).subscribe(() => this.searchCatalogosActivo());
      this.showSuccess("Registro eliminado correctamente");

    }
  }

  onChangeNuevo(key: keyof CatalogosInterface, value: any): void {
    this.nuevoCatalogo[key] = value;
  }

  onChangeEditando(key: keyof CatalogosInterface, value: any): void {
    if (this.editando) (this.editando as any)[key] = value;
  }

  showSuccess(msg: any) {
    this.notyf.success(msg);
  }


}
