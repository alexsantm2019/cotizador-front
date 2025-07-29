// catalogos.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogosService } from '../services/catalogos/catalogos.service'
import { CatalogosInterface } from '../models/catalogos.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoHelper {
  private catalogosService = inject(CatalogosService);
  constructor() {}

  // getCatalogo(id:number): any {
  //   this.catalogosService.getCatalogoByGrupo(id).subscribe({
  //     next: (data) => {
  //       return data;
  //     },
  //     error: (error) => {
  //       console.error('Error en la búsqueda de productos:', error);
  //     },
  //   });
  // }
  getCatalogo(id: number): Observable<CatalogosInterface[]> {
    return this.catalogosService.getCatalogoByGrupo(id);
  }
}