import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Bot } from '../../../models/bot.model';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { BotService } from '../../../services/bot.service';
import { BotBuilderComponent } from '../../../shared/bot-builder/bot-builder.component';

@Component({
  selector: 'app-user-bots',
  standalone: true,
  templateUrl: './user-bots.component.html',
  styleUrls: ['./user-bots.component.scss'],
  imports: [CommonModule, RouterModule, BotBuilderComponent],
})
export class UserBotsComponent implements OnInit, AfterViewInit {
  bots: Bot[] = [];
  loading = false;

  @ViewChild('botBuilderDialog', { static: true })
  dialogEl!: HTMLDialogElement;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService,
    private botService: BotService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const raw = sessionStorage.getItem('currentUser');
    if (!raw) return;

    const { id: userId } = JSON.parse(raw) as Pick<User, 'id'>;
    this.loading = true;

    this.userService
      .findById(userId)
      .pipe(
        switchMap((user) => {
          const botRefs = user.bots;
          if (!botRefs?.length) {
            return of([] as Bot[]);
          }
          const calls = botRefs.map((b) => this.botService.findById(b.id));
          return forkJoin(calls);
        })
      )
      .subscribe({
        next: (bots) => {
          this.bots = bots;
          this.loading = false;
        },
        error: (err) => {
          console.error('Could not load bots', err);
          this.loading = false;
        },
      });
  }

  ngAfterViewInit(): void {
    this.dialogEl.addEventListener('cancel', () => this.dialogEl.close());
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogEl) {
      this.dialogEl.close();
    }
  }
}
