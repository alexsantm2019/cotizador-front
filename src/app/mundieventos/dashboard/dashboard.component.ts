import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
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

  constructor( private router: Router) {}


  logout() {
    this.authService.logout(); // Llama al método logout del servicio
    this.router.navigate(['/login']); // Redirige al usuario a la página de login
  }
 
}