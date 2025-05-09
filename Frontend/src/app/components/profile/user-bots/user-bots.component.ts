import { Bot } from './../../../models/bot.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { resetUser, User } from '../../../models/user.model';
import { BotService } from '../../../services/bot.service';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { BotBuilderComponent } from "../../../shared/bot-builder/bot-builder.component";

@Component({
  selector: 'app-user-bots',
  standalone: true,
  templateUrl: './user-bots.component.html',
  styleUrls: ['./user-bots.component.scss'],
  imports: [CommonModule, RouterModule, BotBuilderComponent],
})
export class UserBotsComponent implements OnInit {
  message = '';
  bots: Bot[] = [];
  user: User = resetUser();
  loading = false;
  sortField: 'id'|'name'|'botScripts' = 'id';
  sortDir: 'asc' | 'desc' = 'asc';
  showBuilder = false;

  constructor(
      private botService: BotService,
      private snackBar: SnackbarService,
      private authService: AuthService
    ) {}

  ngOnInit(): void {
    this.authService.currentUser
      .pipe(
        filter((u): u is User => u != null),
        tap(u => this.user = u),
        switchMap(u => this.botService.getAll()), 
        map(bots => bots.filter(b => b.user?.id === this.user.id))
      )
      .subscribe({
        next: userBots => this.bots = userBots,
        error: err    => console.error('Failed to load User bots', err)
      });
  }

  toggleBuilder() {
    this.showBuilder = !this.showBuilder;
  }

  private loadBots(): void {
      this.botService.getAll()
        .pipe(
          map(bots =>
            this.user.id == null
              ? []
              : bots.filter(b => b.user?.id === this.user.id)
          )
        )
        .subscribe({
          next: userBots => this.bots = userBots,
          error: err   => {
            this.message = 'Failed to load in user bots' + err;
            this.snackBar.openSnackBar(this.message, '', 'error')
          }
        });
  }

  sortBy(field: 'id'|'name'|'botScripts') {
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
        case 'name':
          aVal = a.user?.id;
          bVal = b.user?.id;
          break;
        default:
          aVal = (a as any)[this.sortField];
          bVal = (b as any)[this.sortField];
      }
      if (aVal == null) return -1;
      if (bVal == null) return 1;
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });

    if (this.sortDir === 'desc') {
      this.bots.reverse();
    }
  }

  deleteBot(botId: number): void {
    this.botService.delete(botId).subscribe({
      next: () => {
        this.snackBar.openSnackBar('Bot deleted successfully', '', 'success');
        this.bots = this.bots.filter(b => b.id !== botId);
      },
      error: err => {
        this.message = 'Bot deletion resulted in an error' + err;
        this.snackBar.openSnackBar(this.message, '', 'error')
      }
    });
  }
}
