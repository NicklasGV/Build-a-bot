// src/app/login.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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

  // 👇 inject it!
  constructor(
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  onSubmit(): void {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    // e.g. this.auth.login(this.email, this.password).subscribe(...)
  }

  // 👇 proxy to your PKCE login
  loginWithDiscord(): void {
    this.auth.loginWithDiscord();
  }
}
