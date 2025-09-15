import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from '../../services/notificacion/notificacion.services'; // ajusta la ruta

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private notify = inject(NotificationService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('➡️ Petición HTTP:', req);

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log(`✅ Respuesta HTTP [${event.status}]:`, event);
          // switch (event.status) {
          //   case 200:
          //     this.notify.success('✔️ Operación exitosa');
          //     break;
          //   case 201:
          //     this.notify.success('📦 Recurso creado con éxito');
          //     break;
          //   case 204:
          //     this.notify.success('🗑️ Operación realizada (sin contenido)');
          //     break;
          //   default:
          //     this.notify.success(`ℹ️ Código ${event.status}`);
          //     break;
          // }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`❌ Error HTTP [${error.status}]:`, error);

        // Mensaje personalizado del backend (puede estar en distintas claves)
        const backendMessage =
          error.error?.message ||
          error.error?.error ||
          error.error?.detail ||
          null;

        let finalMessage = '';

        switch (error.status) {
          case 0:
            finalMessage = '🚨 No hay conexión con el servidor';
            break;
          case 400:
            finalMessage = '⚠️ Petición incorrecta (400)';
            break;
          case 401:
            finalMessage = '🔒 No autorizado (401)';
            break;
          case 403:
            finalMessage = '⛔ Prohibido (403)';
            break;
          case 404:
            finalMessage = '🔎 No encontrado (404)';
            break;
          case 409:
            finalMessage = '⚠️ Conflicto (409)';
            break;
          case 422:
            finalMessage = '⚠️ Entidad no procesable (422)';
            break;
          case 500:
            finalMessage = '💥 Error interno del servidor (500)';
            break;
          case 502:
            finalMessage = '🌐 Bad Gateway (502)';
            break;
          case 503:
            finalMessage = '🚧 Servicio no disponible (503)';
            break;
          case 504:
            finalMessage = '⏱️ Tiempo de espera agotado (504)';
            break;
          default:
            finalMessage = `❗ Error inesperado [${error.status}]`;
            break;
        }

        // Si el backend envía mensaje, lo concatenamos
        if (backendMessage) {
          finalMessage += ` → ${backendMessage}`;
        }
        this.notify.error(finalMessage);
        return throwError(() => error);
      })
    );
  }
}
