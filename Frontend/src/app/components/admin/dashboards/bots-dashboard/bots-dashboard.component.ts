import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap, map } from 'rxjs';
import { Role, constRoles } from '../../../../models/role.model';
import { User, resetUser } from '../../../../models/user.model';
import { ScriptService } from '../../../../services/script.service';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BotService } from '../../../../services/bot.service';
import { Bot, resetBot } from '../../../../models/bot.model';
import { Script } from '../../../../models/script.model';

@Component({
  selector: 'app-bots-dashboard',
  standalone: true,
  imports: [
      CommonModule,
      HttpClientModule,
      ReactiveFormsModule
    ],
  templateUrl: './bots-dashboard.component.html',
  styleUrl: './bots-dashboard.component.scss'
})
export class BotsDashboardComponent implements OnInit{
  bots: Bot[] = [];

  sortField: 'id' | 'name' | 'userName' | 'scriptCount' = 'id';
  sortDir: 'asc' | 'desc' = 'asc';

  private botService = inject(BotService);
  private fb = inject(FormBuilder);

  botForm = this.fb.group({
    id: new FormControl<number>(0),
    name: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required]
             }),
    user: new FormControl<User | null>(null, {
                validators: [Validators.required]
             }),
    scripts: new FormControl<Script[]>([], {
                nonNullable: true
             })
  });

  ngOnInit() {
    this.botService.getAll().subscribe({
      next: bots => this.bots = bots,
      error: err   => console.error(err)
    });
    console.log(this.bots)
  }

  sortBy(field: 'id' | 'name' | 'userName' | 'scriptCount') {
    if (this.sortField === field) {
      // same column → just flip direction
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      this.bots.reverse();
    } else {
      this.sortField = field;
      this.sortDir   = 'asc';
      this.applySort();
    }
  }

  private applySort() {
    this.bots.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (this.sortField) {
        case 'userName':
          aVal = a.user.userName;
          bVal = b.user.userName;
          break;
        case 'scriptCount':
          aVal = a.botScripts?.length || 0;
          bVal = b.botScripts?.length || 0;
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
      this.bots.reverse();
    }
  }

  editBot(botId: number) {
    
  }

  cancelEdit() {
    this.botForm.reset({
      id:      0,
      name:    '',
      user:    null,
      scripts: []
    });
  }

  onSubmit() {
    if (this.botForm.invalid) return;

    const raw = this.botForm.value;
    const payload: Bot = {
      ...resetBot(),
      id: raw.id!,
      name: raw.name!,
      user: raw.user as User,
      botScripts:  raw.scripts as Script[]
    };

    this.botService.create(payload).subscribe({
      next: created => {
        this.bots.push(created);
        this.cancelEdit();
      },
      error: err => console.error(err)
    });
  }

  deleteBot(id: number) {
    this.botService.delete(id).subscribe({
      next: () => this.bots = this.bots.filter(b => b.id !== id),
      error: err => console.error(err)
    });
  }
}
