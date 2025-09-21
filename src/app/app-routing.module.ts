// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { ListaProductosComponent } from './mundieventos/productos/lista-productos/lista-productos.component';
import { NuevoPaqueteComponent } from './mundieventos/paquetes/nuevo-paquete/nuevo-paquete.component';
import { ListaPaquetesComponent } from './mundieventos/paquetes/lista-paquetes/lista-paquetes.component';
import { ListaClientesComponent } from './mundieventos/clientes/lista-clientes/lista-clientes.component';
import { CotizacionesParentComponent } from './mundieventos/cotizaciones/cotizaciones-parent/cotizaciones-parent.component';
import { CotizadorComponent } from './mundieventos/cotizaciones/_cotizador/cotizador.component';
import { LoginComponent } from './mundieventos/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard], // Protege todas las rutas hijas
    children: [
      {
        path: '',
        redirectTo: 'analytics',
        pathMatch: 'full'
      },
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component')
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart & map/core-apex.component')
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms & tables/form-elements/form-elements.component')
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/forms & tables/tbl-bootstrap/tbl-bootstrap.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      },
      // =========================== Rutas de la aplicación ==============================
      {
        path: 'inventario',
        loadComponent: () => import('./mundieventos/inventario/inventario.component').then(m => m.InventarioComponent)
      },
      {
        path: 'productos',
        loadComponent: () => import('./mundieventos/productos/lista-productos/lista-productos.component').then(m => m.ListaProductosComponent)
      },
      {
        path: 'categoria-productos',
        loadComponent: () => import('./mundieventos/categoria_productos/categoria-parent/categoria-parent.component').then(m => m.CategoriaParentComponent)
      },
      {
        path: 'lista-paquetes',
        loadComponent: () => import('./mundieventos/paquetes/lista-paquetes/lista-paquetes.component').then(m => m.ListaPaquetesComponent)
      },
      {
        path: 'nuevo-paquete',
        loadComponent: () => import('./mundieventos/paquetes/nuevo-paquete/nuevo-paquete.component').then(m => m.NuevoPaqueteComponent)
      },
      {
        path: 'editar-paquete/:paqueteId',
        loadComponent: () => import('./mundieventos/paquetes/nuevo-paquete/nuevo-paquete.component').then(m => m.NuevoPaqueteComponent)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./mundieventos/clientes/lista-clientes/lista-clientes.component').then(m => m.ListaClientesComponent)
      },
      {
        path: 'cotizaciones',
        loadComponent: () => import('./mundieventos/cotizaciones/cotizaciones-parent/cotizaciones-parent.component').then(m => m.CotizacionesParentComponent)
      },
      {
        path: 'nueva-cotizacion',
        loadComponent: () => import('./mundieventos/cotizaciones/_cotizador/cotizador.component').then(m => m.CotizadorComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./mundieventos/dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ]
  },
  // Ruta de login (fuera del bloque protegido por AuthGuard)
  {
    path: 'login',
    loadComponent: () => import('./mundieventos/login/login.component').then(m => m.LoginComponent)
  },
  // Redirecciones
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Ruta por defecto
  { path: '**', redirectTo: '/dashboard' } // Ruta comodín
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
