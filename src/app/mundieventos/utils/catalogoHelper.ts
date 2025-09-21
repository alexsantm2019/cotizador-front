// catalogos.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogosService } from '../../core/services/catalogos/catalogos.service'
import { CatalogosInterface } from '../../core/models/catalogos.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoHelper {
  private catalogosService = inject(CatalogosService);
  constructor() { }

  getCatalogo(id: number): Observable<CatalogosInterface[]> {
    return this.catalogosService.getCatalogoByGrupo(id);
  }
}