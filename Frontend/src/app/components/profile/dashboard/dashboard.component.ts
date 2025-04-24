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
    // this.userService.findById(this.authService.currentUserValue.id).subscribe(x => this.user = x);
    // this.activatedRoute.paramMap.subscribe( params => {
    //   if (this.authService.currentUserValue == null || this.authService.currentUserValue.id == '' || this.authService.currentUserValue.id != String(params.get('id')))
    //   {
    //     this.router.navigate(['/']);
    //   }
    //   //Store user in variable
    //   this.user = this.authService.currentUserValue;
    // });

    this.authService.currentUser.subscribe(user => {
          this.user = user;
        });

    this.WelcomeUser();
  }

  WelcomeUser() {
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
