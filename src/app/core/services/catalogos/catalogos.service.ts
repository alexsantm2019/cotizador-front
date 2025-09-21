import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { CatalogosInterface } from '../../models/catalogos.models';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private server = environment.apiUrl;
  private apiUrl = `${this.server}/api/catalogos`;

  constructor(private http: HttpClient) {
  }

  getCatalogoByGrupo(id: number): Observable<CatalogosInterface[]> {
    return this.http.get<CatalogosInterface[]>(`${this.apiUrl}/get_catalogo_by_grupo/${id}`);
  }


}