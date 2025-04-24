import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { resetUser, User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  private userService = inject(UserService);
  private fb          = inject(FormBuilder);

  users: User[] = [];

  userForm = this.fb.group({
    email:    ['', { nonNullable: true, validators: [] }],
    userName: ['', { nonNullable: true, validators: [] }],
    password: ['', { nonNullable: true, validators: [] }],
    scripts:  [[] as number[]],
    role:     [null as number | null]
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: users => this.users = users,
      error: err   => console.error(err)
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const raw = this.userForm.value;

    // map scripts number[] → string[]
    const scriptsAsString = (raw.scripts || []).map(id => id.toString());

    // start from a fully reset user
    const newUser: User = {
      ...resetUser(),
      id:       0,
      email:    raw.email!,
      userName: raw.userName!,
      password: raw.password!,
      scripts:  (raw.scripts || []).map(id => id.toString()),
      role:     raw.role ?? undefined
    };

    this.userService.create(newUser).subscribe({
      next: created => {
        this.users.push(created);
        // clear only those fields we care about
        this.userForm.reset({ scripts: [], role: null });
      },
      error: err => console.error(err)
    });
  }

  deleteUser(id: number) {
    this.userService.delete(id).subscribe({
      next: () => this.users = this.users.filter(u => u.id !== id),
      error: err => console.error(err)
    });
  }
}
