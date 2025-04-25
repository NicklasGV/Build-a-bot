import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { switchMap, map } from 'rxjs';
import { Role, constRoles } from '../../../../models/role.model';
import { User, resetUser } from '../../../../models/user.model';
import { ScriptService } from '../../../../services/script.service';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Script } from '../../../../models/script.model';

@Component({
  selector: 'app-scripts-dashboard',
  standalone: true,
  imports: [
      CommonModule,
      HttpClientModule,
      ReactiveFormsModule
    ],
  templateUrl: './scripts-dashboard.component.html',
  styleUrl: './scripts-dashboard.component.scss'
})
export class ScriptsDashboardComponent {
  scripts: Script[] = [];
  roles: Role[] = [];

  sortField: 'id' | 'name' | 'userName' | 'scriptCount' = 'id';
  sortDir: 'asc' | 'desc' = 'asc';

  private userService = inject(UserService);
  private scriptService = inject(ScriptService)
  private fb = inject(FormBuilder);


  scriptForm = this.fb.group({
    id:       [0],
    email:    ['', { nonNullable: true, validators: [] }],
    userName: ['', { nonNullable: true, validators: [] }],
    password: ['', { nonNullable: true, validators: [] }],
    scripts:  [[] as number[]],
    role:     [null as number | null]
  });

  ngOnInit() {
    this.scriptService.getAll().subscribe({
      next: scripts => this.scripts = scripts,
      error: err   => console.error(err)
    });
    this.roles = constRoles;
  }

  sortBy(field: 'id' | 'name' | 'userName') {
    if (this.sortField === field) {
      // same column → just flip direction
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      this.scripts.reverse();
    } else {
      this.sortField = field;
      this.sortDir   = 'asc';
      this.applySort();
    }
  }

  private applySort() {
    this.scripts.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (this.sortField) {
        case 'userName':
          aVal = a.user.userName;
          bVal = b.user.userName;
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
      this.scripts.reverse();
    }
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

        this.scriptForm.patchValue({
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
    this.scriptForm.reset({
      id:       0,
      email:    '',
      userName: '',
      password: '',
      scripts:  [],
      role:     null
    });
  }

  onSubmit() {
    if (this.scriptForm.invalid) return;

    const raw = this.scriptForm.value;
    const payload: User = {
      ...resetUser(),
      id:       raw.id!,
      email:    raw.email!,
      userName: raw.userName!,
      password: raw.password!,
      scripts:  (raw.scripts || []).map(id => id.toString()),
      role:     raw.role ?? undefined
    };

    // if (payload.id && payload.id !== 0) {
    //   // **Update** existing
    //   this.userService.update(payload).subscribe({
    //     next: updated => {
    //       // swap it into our local list
    //       const idx = this.scripts.findIndex(u => u.id === updated.id);
    //       if (idx > -1) this.scripts[idx] = updated;
    //       this.cancelEdit();
    //     },
    //     error: err => console.error(err)
    //   });
    // } else {
      // **Create** new
      // this.scriptService.create(payload).subscribe({
      //   next: created => {
      //     this.scripts.push(created);
      //     this.cancelEdit();
      //   },
      //   error: err => console.error(err)
      // });
    // }
  }

  deleteUser(id: number) {
    // this.userService.delete(id).subscribe({
    //   next: () => this.users = this.users.filter(u => u.id !== id),
    //   error: err => console.error(err)
    // });
  }
}
