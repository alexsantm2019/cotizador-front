import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { PaqueteInterface } from '../../models/paquetes.models';

@Injectable({
  providedIn: 'root'
})
export class PaquetesService {

  private server = environment.apiUrl;
  private apiUrl = `${this.server}/api/paquetes`;

  constructor(private http: HttpClient) {
  }

  getPaqueteById(id: number): Observable<PaqueteInterface[]> {
    return this.http.get<PaqueteInterface[]>(`${this.apiUrl}/paquete/${id}`);
  }

  getPaquetes(): Observable<PaqueteInterface[]> {
    return this.http.get<PaqueteInterface[]>(`${this.apiUrl}/get_paquetes`);
  }

  createPaquete(paquete: any): Observable<PaqueteInterface> {
    return this.http.post<PaqueteInterface>(`${this.apiUrl}/create_paquete`, paquete);
  }

  updatePaquete(id: number, updatedData: any): Observable<PaqueteInterface> {
    const url = `${this.apiUrl}/update_paquete/${id}`;
    return this.http.put<PaqueteInterface>(url, updatedData);
  }

  deletePaquete(id: number): Observable<PaqueteInterface> {
    const url = `${this.apiUrl}/delete_paquete/${id}`;
    return this.http.delete<PaqueteInterface>(url);
  }


}