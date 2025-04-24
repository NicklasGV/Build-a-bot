// src/app/login.component.ts
import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { SnackbarService } from '../../../services/snackbar.service';

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
  showPassword: boolean = false;

  // 👇 inject it!
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: SnackbarService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // redirect to home if already logged in
    if (this.authService.currentUserValue != null && this.authService.currentUserValue.id != '') {
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
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    // e.g. this.auth.login(this.email, this.password).subscribe(...)
  }

  // 👇 proxy to your PKCE login
  loginWithDiscord(): void {
    this.authService.loginWithDiscord();
  }
}
