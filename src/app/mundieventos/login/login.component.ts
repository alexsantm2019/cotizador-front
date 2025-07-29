import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { Notyf } from 'notyf';

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

  private  notyf = new Notyf();

  constructor(private authService: AuthService, private router: Router) {}

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

  showError(msg:any) {
    this.notyf.error(msg);
  }
}