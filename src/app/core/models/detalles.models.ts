import { PaqueteInterface } from './paquetes.models';
import { ProductosInterface } from './productos.model';

export interface DetalleInterface {
  id: number;
  tipo_item: number; // 1: Producto, 2: Paquete, 3: Producto dentro de un paquete
  cantidad: number;
  descuento: number;
  costo?: number;
  info_producto?: ProductosInterface;
  info_paquete?: PaqueteInterface;
}