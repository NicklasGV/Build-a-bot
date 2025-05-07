import { ScriptService } from './../../../../services/script.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { resetUser, User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Role, constRoles } from '../../../../models/role.model';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  message: string = "";
  users: User[] = [];
  user: User = resetUser();
  roles: Role[] = [];
  formData = new FormData();

  sortField: 'id' | 'email' | 'userName' | 'role' = 'id';
  sortDir: 'asc' | 'desc' = 'asc';

  constructor(
    private userService: UserService,
    private scriptService: ScriptService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.userService.getAll().subscribe(x => this.users = x);
    this.roles = constRoles;
  }

  sortBy(field: 'id' | 'email' | 'userName' | 'role') {
    if (this.sortField === field) {
      // same column → just flip direction
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      this.users.reverse();
    } else {
      this.sortField = field;
      this.sortDir   = 'asc';
      this.applySort();
    }
  }

  private applySort() {
    this.users.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (this.sortField) {
        case 'userName':
          aVal = a.userName;
          bVal = b.userName;
          break;
        case 'role':
          aVal = a.scripts;
          bVal = b.scripts;
          break;
        default:
          aVal = (a as any)[this.sortField];
          bVal = (b as any)[this.sortField];
      }

      // null-safe compare
      if (aVal == null) return -1;
      if (bVal == null) return 1;

      // string vs number
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });

    if (this.sortDir === 'desc') {
      this.users.reverse();
    }
  }

  editUser(user: User) {
    Object.assign(this.user, user);
  }

  cancelEdit() {
    this.user = resetUser();
      this.snackbar.openSnackBar('User canceled.', '','warning');
  }

  onSubmit() {
    this.message = "";
      if (this.user.id == 0) {
        //create
        this.userService.create(this.user)
        .subscribe({
          next: (x) => {
            this.users.push(x);
            this.user = resetUser();
            this.snackbar.openSnackBar("User created", '', 'success');
          },
          error: (err) => {
            console.log(err);
            this.message = Object.values(err.error.errors).join(", ");
            this.snackbar.openSnackBar(this.message, '', 'error');
          }
        });
      } else {
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

  deleteUser(id: number) {
    this.userService.delete(id).subscribe({
      next: () => this.users = this.users.filter(u => u.id !== id),
      error: err => console.error(err)
    });
  }
}
