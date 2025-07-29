import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import  { environment } from '../../../../environments/environment';

import { CategoriaProductoInterface } from '../../models/categoria-producto.models';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProductoService {

  private server = environment.apiUrl;  
  private apiUrl = `${this.server}/api/categoria_producto`;

  constructor(private http:HttpClient) { 
  }

    getCategoriaProducto():Observable<CategoriaProductoInterface[]>{
      return this.http.get<CategoriaProductoInterface[]>(`${this.apiUrl}/get_categoria_producto`);
    }

    createCategoriaProducto(data: any): Observable<CategoriaProductoInterface> {
      return this.http.post<CategoriaProductoInterface>(`${this.apiUrl}/create_categoria_producto`, data);
    }
    
    updateCategoriaProducto(id: number, updatedData: any): Observable<CategoriaProductoInterface> {
      const url = `${this.apiUrl}/update_categoria_producto/${id}`;
      return this.http.put<CategoriaProductoInterface>(url, updatedData);
    }
    
    deleteCategoriaProducto(id: number): Observable<CategoriaProductoInterface> {
      const url = `${this.apiUrl}/delete_categoria_producto/${id}`;
      return this.http.delete<CategoriaProductoInterface>(url);
    }
}