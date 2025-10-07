import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpResponse } from '@angular/common/http';
import { CotizacionInterface } from '../../models/cotizaciones.model';

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

  private server = environment.apiUrl;
  public apiUrl = `${this.server}/api/cotizaciones`;

  constructor(private http: HttpClient) {
  }

  getCotizaciones(): Observable<CotizacionInterface[]> {
    return this.http.get<CotizacionInterface[]>(`${this.apiUrl}/get_cotizaciones`);
  }

  getCotizacionById(id: number): Observable<CotizacionInterface> {
    return this.http.get<CotizacionInterface>(`${this.apiUrl}/get_cotizacion_by_id/${id}`);
  }

  getCotizacionesPorFecha(year: number, month: number): Observable<CotizacionInterface[]> {
    return this.http.get<CotizacionInterface[]>(`${this.apiUrl}/get_cotizaciones_by_fecha/${year}/${month}/`);
  }

  createCotizacion(data: any): Observable<CotizacionInterface> {
    return this.http.post<CotizacionInterface>(`${this.apiUrl}/create_cotizacion`, data);
  }

  deleteCotizacion(id: number): Observable<CotizacionInterface> {
    const url = `${this.apiUrl}/delete_cotizacion/${id}`;
    return this.http.delete<CotizacionInterface>(url);
  }

  updateCotizacion(id: number, updatedData: any): Observable<CotizacionInterface> {
    const url = `${this.apiUrl}/update_cotizacion/${id}`;
    return this.http.put<CotizacionInterface>(url, updatedData);
  }

  enviarPorCorreo(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar_correo/${id}`, {});
  }

  downloadPDF(id: number): Observable<HttpResponse<Blob>> {
    return this.http.post(`${this.apiUrl}/download_pdf/${id}`, {}, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  enviarPorWhatsApp(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar_whatsapp/${id}`, {});
  }

}