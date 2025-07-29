import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import  { environment } from '../../../../environments/environment';

import { ProductosInterface } from '../../models/productos.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private server = environment.apiUrl;  
  private apiUrl = `${this.server}/api/productos`;

  constructor(private http:HttpClient) { 
  }

    getProductos():Observable<ProductosInterface[]>{
    return this.http.get<ProductosInterface[]>(`${this.apiUrl}/get_productos`);
    }

    getProductosInventario():Observable<ProductosInterface[]>{
      return this.http.get<ProductosInterface[]>(`${this.apiUrl}/get_productos_inventario`);
      }
    
    createProducto(data: any): Observable<ProductosInterface> {
      return this.http.post<ProductosInterface>(`${this.apiUrl}/create_producto`, data);
    }

    updateProducto(id: number, updatedData: any): Observable<ProductosInterface> {
      const url = `${this.apiUrl}/update_producto/${id}`;
      return this.http.put<ProductosInterface>(url, updatedData);
    }

    updateInventario(id: number, updatedData: any): Observable<ProductosInterface> {
      const url = `${this.apiUrl}/update_inventario/${id}`;
      return this.http.put<ProductosInterface>(url, updatedData);
    }

    deleteProducto(id: number): Observable<ProductosInterface> {
      const url = `${this.apiUrl}/delete_producto/${id}`;
      return this.http.delete<ProductosInterface>(url);
    }

}