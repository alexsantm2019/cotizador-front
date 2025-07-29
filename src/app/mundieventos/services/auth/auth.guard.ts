import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private authService = inject(AuthService);
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      console.log("consultando a getToken")
      return true;
    } else {
      console.log("redireccionando a login")
      this.router.navigate(['/login']);
      return false;
    }
  }
}