import { UserService } from './../../../services/user.service';
import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User, resetUser } from '../../../models/user.model';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  userName: string = '';
  message: string = '';
  users: User[] = [];
  signupForm: FormGroup = this.resetForm();
  user: User = resetUser();
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: SnackbarService,
    private renderer: Renderer2
  ) { 
    this.signupForm = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      userName: [null, Validators.required],
      email:    [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          // Minimum 8 chars, at least one uppercase, one lowercase, one number, one special char
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
        ]
      ],
      confirmPassword: [null, Validators.required]
    }, {
      validators: this.passwordsMatchValidator()
    });
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const pw = group.get('password')!.value;
      const cpw = group.get('confirmPassword')!.value;
      return pw && cpw && pw !== cpw ? { passwordsMismatch: true } : null;
    };
  }

  ngOnInit(): void {
    // redirect to home if already logged in
    if (this.authService.currentUserValue != null && this.authService.currentUserValue.id > 0) {
      this.router.navigate(['/']);
    }
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  hidePassword(passwordInput: any) {
    this.renderer.setAttribute(passwordInput.nativeElement, 'type', 'password');
  }

  signup(): void {
    console.log("signup called");
    this.message = '';
    console.log(this.signupForm);
    if (this.signupForm.valid) {
      this.userService.create(this.signupForm.value).subscribe({
        next: (x) => {
          this.users.push(x);
          this.cancel();
          this.signupForm.reset();
          this.snackBar.openSnackBar('User registered','','success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.message = Object.values(err.error.errors).join(", ");
          this.snackBar.openSnackBar(this.message,'','error');
        },
      });
    }
  }

  cancel(): void {
    this.user = resetUser();
  }

  resetForm(): FormGroup {
    return new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      userName: new FormControl(null, Validators.required),
    })
  }
}
