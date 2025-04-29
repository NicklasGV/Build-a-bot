import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Bot } from '../../../models/bot.model';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { BotService } from '../../../services/bot.service';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-bots',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule
  ],
  templateUrl: './user-bots.component.html',
  styleUrls: ['./user-bots.component.scss']
})
export class UserBotsComponent implements OnInit {
  bots: Bot[] = [];
  loading = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService,
    private botService: BotService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const raw = sessionStorage.getItem('currentUser');
    if (!raw) return;

    const { id: userId } = JSON.parse(raw) as Pick<User, 'id'>;
    this.loading = true;

    this.userService.findById(userId).pipe(
      switchMap(user => {
        const botRefs = user.bots;
        if (!botRefs || botRefs.length === 0) {
          return of([] as Bot[]);
        }
        const calls = botRefs.map(b => this.botService.findById(b.id));
        return forkJoin(calls);
      })
    ).subscribe({
      next: bots => {
        this.bots = bots;
        this.loading = false;
      },
      error: err => {
        console.error('Could not load bots', err);
        this.loading = false;
      }
    });
  }

  goToCreate() {
    this.router.navigate(['/bot-compiler']);
  }
}
