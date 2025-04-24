// src/app/login.component.ts
import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { User, resetUser } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  message: string = '';
  showPassword: boolean = false;
  user: User = resetUser();
  users: User[] = [];
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackbarService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUserValue != null && this.authService.currentUserValue.id != 0) {
      this.router.navigate(['/']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  hidePassword(passwordInput: any) {
    this.renderer.setAttribute(passwordInput.nativeElement, 'type', 'password');
  }

  onSubmit(): void {
    this.message  = '';
    this.authService.login(this.email, this.password)
    .subscribe({
      next: async () => {
        this.router.navigate(['/login']);
        window.location.reload();
        this.snackBar.openSnackBar('Login Succesful','','success');
      },
      error: err => {
        console.error('Login error:', err);
        if (err.status === 400 || err.status === 401 || err.status === 500) {
          this.message = 'Incorrect email or password. Please try again.';
          this.snackBar.openSnackBar(this.message, '', 'error');
        } else {
          this.message = 'An unexpected error occurred.';
          this.snackBar.openSnackBar(this.message, '', 'error');
        }
      }
    });
  }

  loginWithDiscord(): void {
    this.authService.loginWithDiscord();
  }
}
