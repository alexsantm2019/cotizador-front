import { CotizacionDetalleInterface } from './cotizacion_detalle.models';
import { ClientesInterface } from './clientes.models';
export interface CotizacionInterface {
    id: number;
    fecha_creacion: string;
    clientes_id: number;
    iva: number;    
    tipo_descuento: number;
    descuento: number;
    subtotal: number;
    total: number;
    estado: number;
    detalles?: CotizacionDetalleInterface[];    
    info_cliente?: ClientesInterface;  
    cliente: number;    
    user: string;
    estado_info?: any;   
 }