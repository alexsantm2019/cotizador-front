export interface ProductosInterface {
    id: number;
    producto: string;
    descripcion: string;
    tipo_costo: number;
    costo: number;
    estado: number;
    ubicacion: string;
    categoria_producto_id: number;
    user: string;
    cantidad: number;
    inventario_updated_at: any;
    estado_info?: any;   
    tipo_costo_info?: any;   
    categoria_info?: any;       
 }