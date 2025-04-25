import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { switchMap, map } from 'rxjs';
import { Role, constRoles } from '../../../../models/role.model';
import { User, resetUser } from '../../../../models/user.model';
import { ScriptService } from '../../../../services/script.service';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-posts-dashboard',
  standalone: true,
  imports: [
      CommonModule,
      HttpClientModule,
      ReactiveFormsModule
    ],
  templateUrl: './posts-dashboard.component.html',
  styleUrl: './posts-dashboard.component.scss'
})
export class PostsDashboardComponent {
users: User[] = [];
  roles: Role[] = [];
  private userService = inject(UserService);
  private scriptService = inject(ScriptService)
  private fb = inject(FormBuilder);


  userForm = this.fb.group({
    id:       [0],
    email:    ['', { nonNullable: true, validators: [] }],
    userName: ['', { nonNullable: true, validators: [] }],
    password: ['', { nonNullable: true, validators: [] }],
    scripts:  [[] as number[]],
    role:     [null as number | null]
  });

  ngOnInit() {
    this.userService.getAll().subscribe({
      next: users => this.users = users,
      error: err   => console.error(err)
    });
    this.roles = constRoles;
  }

  editUser(userId: number) {
    this.userService.findById(userId).pipe(
      switchMap(user =>
        this.scriptService.getAll().pipe(
          map(allScripts => ({ user, allScripts }))
        )
      )
    )
    .subscribe({
      next: ({ user, allScripts }) => {
        const scriptIds = allScripts
          .filter(s => s.user.id === user.id)
          .map(s => s.id);

        this.userForm.patchValue({
          id:       user.id,
          email:    user.email,
          userName: user.userName,
          password: '',
          scripts:  scriptIds,
          role:     user.role ?? 0
        });
      },
      error: err => console.error(err)
    });
  }

  cancelEdit() {
    // reset the form back to “create” mode
    this.userForm.reset({
      id:       0,
      email:    '',
      userName: '',
      password: '',
      scripts:  [],
      role:     null
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const raw = this.userForm.value;
    const payload: User = {
      ...resetUser(),
      id:       raw.id!,
      email:    raw.email!,
      userName: raw.userName!,
      password: raw.password!,
      scripts:  (raw.scripts || []).map(id => id.toString()),
      role:     raw.role ?? undefined
    };

    if (payload.id && payload.id !== 0) {
      // **Update** existing
      this.userService.update(payload).subscribe({
        next: updated => {
          // swap it into our local list
          const idx = this.users.findIndex(u => u.id === updated.id);
          if (idx > -1) this.users[idx] = updated;
          this.cancelEdit();
        },
        error: err => console.error(err)
      });
    } else {
      // **Create** new
      this.userService.create(payload).subscribe({
        next: created => {
          this.users.push(created);
          this.cancelEdit();
        },
        error: err => console.error(err)
      });
    }
  }

  deleteUser(id: number) {
    this.userService.delete(id).subscribe({
      next: () => this.users = this.users.filter(u => u.id !== id),
      error: err => console.error(err)
    });
  }
}
