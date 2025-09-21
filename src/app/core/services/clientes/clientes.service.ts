import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { ClientesInterface } from '../../models/clientes.models';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private server = environment.apiUrl;
  private apiUrl = `${this.server}/api/clientes`;

  constructor(private http: HttpClient) {
  }

  getClientes(): Observable<ClientesInterface[]> {
    return this.http.get<ClientesInterface[]>(`${this.apiUrl}/get_clientes`);
  }

  createCliente(data: any): Observable<ClientesInterface> {
    return this.http.post<ClientesInterface>(`${this.apiUrl}/create_cliente`, data);
  }

  updateCliente(id: number, updatedData: any): Observable<ClientesInterface> {
    const url = `${this.apiUrl}/update_cliente/${id}`;
    return this.http.put<ClientesInterface>(url, updatedData);
  }

  deleteCliente(id: number): Observable<ClientesInterface> {
    const url = `${this.apiUrl}/delete_cliente/${id}`;
    return this.http.delete<ClientesInterface>(url);
  }

}