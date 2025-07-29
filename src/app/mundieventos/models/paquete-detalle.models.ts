import { ProductosInterface } from './productos.model';
export interface PaqueteDetalleInterface {
    id: number;
    producto_id: number;   
    cantidad: number; 
    duracion_horas: number; 
    paquetes_id: number; 
    costo_producto: number; 
    producto: ProductosInterface;
 }