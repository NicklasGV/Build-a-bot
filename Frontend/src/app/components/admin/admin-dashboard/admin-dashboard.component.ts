import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User, resetUser } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../../services/snackbar.service';
import { BotsDashboardComponent } from "../dashboards/bots-dashboard/bots-dashboard.component";
import { ScriptsDashboardComponent } from "../dashboards/scripts-dashboard/scripts-dashboard.component";
import { UserDashboardComponent } from "../dashboards/user-dashboard/user-dashboard.component";
import { PostsDashboardComponent } from "../dashboards/posts-dashboard/posts-dashboard.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BotsDashboardComponent,
    ScriptsDashboardComponent,
    UserDashboardComponent,
    PostsDashboardComponent
],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
message: string = "";
  user: User = resetUser();
  msg: string = '';
  selectedTab: 'bots' | 'posts' | 'scripts' | 'users' = 'users';

  selectTab(tab: 'bots' | 'posts' | 'scripts' | 'users') {
    this.selectedTab = tab;
  }

  constructor(private authService: AuthService, private snackBar: SnackbarService) {
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
          this.user = user;
        });
  }
}
