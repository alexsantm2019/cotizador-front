import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Notyf } from 'notyf';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  private notyf = new Notyf();
  mainPath: string = environment.mainLogo || 'assets/images/logo-dark.png';
  // constructor(private authService: AuthService, private router: Router) { }

  private authService = inject(AuthService);
  private router = inject(Router);

  login() {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        // this.router.navigate(['/protected']);
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Error en el login', error);
        this.showError("Existe un error al momento de loguearse. Inténtalo de nuevo");
      }
    );
  }

  showError(msg: any) {
    this.notyf.error(msg);
  }
  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/logo-dark.png';
  }
}