import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { EstadisticasCotizacionesComponent } from '../estadisticas/estadisticas-cotizaciones/estadisticas-cotizaciones.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, EstadisticasCotizacionesComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  private authService = inject(AuthService);

  constructor(private router: Router) { }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}