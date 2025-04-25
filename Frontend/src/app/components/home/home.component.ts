import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User, resetUser } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RoleId } from '../../models/role.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  currentUser: User = resetUser();
  isLoggedIn: boolean = false;
  public RoleId = RoleId;

  constructor(
      private authService: AuthService
    ) {
      this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user.token;
    });
  }
}
