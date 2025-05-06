import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap, map } from 'rxjs';
import { Role, constRoles } from '../../../../models/role.model';
import { User, resetUser } from '../../../../models/user.model';
import { ScriptService } from '../../../../services/script.service';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BotService } from '../../../../services/bot.service';
import { Bot, resetBot } from '../../../../models/bot.model';
import { resetScript, Script } from '../../../../models/script.model';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-bots-dashboard',
  standalone: true,
  imports: [
      CommonModule,
      HttpClientModule,
      FormsModule
    ],
  templateUrl: './bots-dashboard.component.html',
  styleUrl: './bots-dashboard.component.scss'
})
export class BotsDashboardComponent implements OnInit{
  message: string = '';
  bots: Bot[] = [];
  bot: Bot = resetBot();
  users: { id: number; userName: string }[] = [];
  scripts: Script[] = [];
  script: Script = resetScript();
    
  sortField: 'id' | 'name' | 'userName' | 'scriptCount' = 'id';
  sortDir: 'asc' | 'desc' = 'asc';

  constructor(
      private botService: BotService,
      private userService: UserService,
      private snackBar: SnackbarService,
      private scriptService: ScriptService,
    ) {}

  ngOnInit() {
    this.loadScripts();
    this.loadUsers();
    this.loadBots();
  }

  private loadScripts(): void {
    this.scriptService.getAll().subscribe({
      next: scripts => this.scripts = scripts,
      error: err   => console.error('Failed to load scripts', err)
    });
  }

  private loadUsers(): void {
    this.userService.getAll().subscribe({
      next: users => this.users = users,
      error: err =>
        console.error('Failed to load users', err)
    });
  }

  private loadBots(): void {
    this.botService.getAll().subscribe({
      next: bots => this.bots = bots,
      error: err =>
        console.error('Failed to load users', err)
    });
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

  editBot(bot: Bot) {
    Object.assign(this.bot, bot)
  }

  cancelEdit() {
    this.bot = resetBot();
  }

  async onSubmit() {
      this.message = "";
      if (this.bot.id == 0) {
        //create
        this.botService.create(this.bot)
        .subscribe({
          next: (x) => {
            this.bots.push(x);
            this.bot = resetBot();
            this.snackBar.openSnackBar("Script created", '', 'success');
          },
          error: (err) => {
            console.log(err);
            this.message = Object.values(err.error.errors).join(", ");
            this.snackBar.openSnackBar(this.message, '', 'error');
          }
        });
      } else {
        // //update
        // this.botService.update(this.bot.id, this.bot)
        // .subscribe({
        //   error: (err) => {
        //     this.message = Object.values(err.error.errors).join(", ");
        //     this.snackBar.openSnackBar(this.message, '', 'error');
        //   },
        //   complete: () => {
        //     this.userService.getAll().subscribe(x => this.users = x);
        //     this.bot = resetScript();
        //     this.snackBar.openSnackBar("Script updated", '', 'success');
        //   }
        // });
      }
      this.script = resetScript();
    }

  deleteBot(id: number) {
    this.botService.delete(id).subscribe({
      next: () => this.bots = this.bots.filter(b => b.id !== id),
      error: err => console.error(err)
    });
  }
}
