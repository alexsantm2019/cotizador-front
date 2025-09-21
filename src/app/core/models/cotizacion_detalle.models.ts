import { CotizacionInterface } from './cotizaciones.model';
import { PaqueteInterface } from './paquetes.models';
import { ProductosInterface } from './productos.model';
export interface CotizacionDetalleInterface {
    id: number;
    cantidad: number;   
    duracion_horas: number; 
    cotizaciones_id: number; 
    paquetes_id: number; 
    producto_id: number; 
    tipo_item: number; 
    iva: number; 
    descuento: number; 
    cotizacion: CotizacionInterface;
    info_paquete?: PaqueteInterface;  
    info_producto?: ProductosInterface;  
 }