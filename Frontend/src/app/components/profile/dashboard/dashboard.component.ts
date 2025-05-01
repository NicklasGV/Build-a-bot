import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { User, resetUser } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { CommonModule } from '@angular/common';
import { UserBotsComponent } from "../user-bots/user-bots.component";
import { UserPostsComponent } from "../user-posts/user-posts.component";
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserBotsComponent,
    UserPostsComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  message: string = "";
  user: User = resetUser();
  msg: string = '';
  selectedTab: 'bots' | 'posts' = 'bots';

  selectTab(tab: 'bots' | 'posts') {
    this.selectedTab = tab;
  }

  constructor(private userService: UserService,private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute, private snackBar: SnackbarService) {
  }

  ngOnInit(): void {
    this.authService.currentUser.pipe(
      filter(user => !!user && !!user.id),
      tap(user => this.user = user),
      switchMap(user => this.userService.findById(user.id))
    ).subscribe({
      next: fullUser => {
        this.user = fullUser;
        this.setGreeting();
      },
      error: err => {
        console.error('Error loading user profile', err);
        this.router.navigate(['/']);
      }
    });
  }

  setGreeting() {
    var today = new Date().getHours();
    if (today >= 6 && today <= 11)
    {
      return this.msg = "Good Morning"
    }
    else if (today >= 12 && today <= 13)
    {
      return this.msg = "Good Afternoon"
    }
    return this.msg = "Good Evening"
  }
}
