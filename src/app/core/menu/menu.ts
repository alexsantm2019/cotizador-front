import { NavigationItemInterface } from "../models/navigation-item.models";
export const MenuItems: NavigationItemInterface[] = [
    {
        id: 'ui-component',
        title: '',
        type: 'group',
        icon: 'icon-group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'item',
                url: '/dashboard',
                icon: 'feather icon-box',
            },
            {
                id: 'inventario',
                title: 'Inventario',
                type: 'item',
                url: '/inventario',
                icon: 'feather icon-box',
            },
            {
                id: 'productos',
                title: 'Productos',
                type: 'collapse',
                icon: 'feather icon-box',
                children: [
                    {
                        id: 'productos',
                        title: 'Lista de productos',
                        type: 'item',
                        url: '/productos'
                    },
                    {
                        id: 'categoria-productos',
                        title: 'Categorías',
                        type: 'item',
                        url: '/categoria-productos'
                    },
                ]
            },
            {
                id: 'paquetes',
                title: 'Paquetes',
                type: 'collapse',
                icon: 'feather icon-box',
                children: [
                    {
                        id: 'nuevo-paquete',
                        title: 'Nuevo paquete',
                        type: 'item',
                        url: '/nuevo-paquete'
                    },
                    {
                        id: 'lista-paquetes',
                        title: 'Lista de paquetes',
                        type: 'item',
                        url: '/lista-paquetes'
                    },
                ]
            },
            {
                id: 'cotizaciones',
                title: 'Cotizaciones',
                type: 'collapse',
                icon: 'feather icon-box',
                children: [
                    {
                        id: 'cotizaciones',
                        title: 'Cotizaciones',
                        type: 'item',
                        url: '/cotizaciones'
                    },
                ]
            },
            {
                id: 'clientes',
                title: 'Clientes',
                type: 'collapse',
                icon: 'feather icon-box',
                children: [
                    {
                        id: 'clientes',
                        title: 'Clientes',
                        type: 'item',
                        url: '/clientes'
                    },

                ]
            },

        ]
    },
    // ************************************************ TEMPLATE ************************************

];
