import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { User, resetUser } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  message: string = "";
  users: User[] = [];
  user: User = resetUser();
  confirmPassword = '';
  passwordsMatch  = true;

  constructor(
    private userService: UserService,
    private snackbar: SnackbarService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  checkPasswords() {
    this.passwordsMatch = this.user.password === this.confirmPassword;
  }
  
  onSubmit() {
    this.message = "";
    if (this.user.id != 0) {
      if (this.user.password == '' || this.user.password == null || this.user.password == undefined) {
        // if password is empty, set it to a string so that the backend doesn't throw an error 
        this.user.password = 'string';
      }
      //update
      this.userService.update(this.user)
      .subscribe({
        error: (err) => {
          this.message = Object.values(err.error.errors).join(", ");
          this.snackbar.openSnackBar(this.message, '', 'error');
        },
        complete: () => {
          this.userService.getAll().subscribe(x => this.users = x);
          this.user = resetUser();
          this.snackbar.openSnackBar("User updated", '', 'success');
        }
      });
    }
    this.user = resetUser();
  }

  cancelEdit() {

  }
}
