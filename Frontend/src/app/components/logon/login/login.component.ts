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
import { BotService } from '../../../services/bot.service';
import { Bot } from '../../../models/bot.model';

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
  private redirectUrl: string | null = null;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackbarService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private botService: BotService,
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUserValue != null && this.authService.currentUserValue.id != 0) {
      this.router.navigate(['/']);
    }
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  hidePassword(passwordInput: any) {
    this.renderer.setAttribute(passwordInput.nativeElement, 'type', 'password');
  }

  onSubmit(): void {
    this.message = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        if (this.redirectUrl) {
          const saved = localStorage.getItem('savedBot');
          if (saved) {
            const bot: Bot = JSON.parse(saved);
            bot.user = this.authService.currentUserValue!;
            console.log('Creating bot:', bot);
            this.botService.create(bot).subscribe({
              next: () => {
                localStorage.removeItem('savedBot');
                this.snackBar.openSnackBar('Bot created!', '', 'success');
                this.router.navigateByUrl(this.redirectUrl!);
              },
              error: err => {
                console.error('Create bot failed', err);
                this.snackBar.openSnackBar('Failed to create bot', '', 'error');
                this.router.navigateByUrl(this.redirectUrl!);
              }
            });
            return;
          }
        }
        this.snackBar.openSnackBar('Login successful', '', 'success');
        this.router.navigate(['/']);
      },
      error: err => {
        console.error('Login error:', err);
        if ([400, 401, 500].includes(err.status)) {
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
