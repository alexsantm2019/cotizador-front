import { PaqueteDetalleInterface } from './paquete-detalle.models';
export interface PaqueteInterface {
    id: number;
    nombre_paquete: string;
    descripcion: string;
    precio_total: number;    
    estado: number;
    detalles?: PaqueteDetalleInterface[];
    categoria_producto_id: number;
 }