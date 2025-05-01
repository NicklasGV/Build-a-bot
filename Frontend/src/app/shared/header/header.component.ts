import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User, resetUser } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { RoleId } from '../../models/role.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  currentUser: User = resetUser();
  public RoleId = RoleId;
  isLoggedIn: boolean = false;
  isMobileMenuActive = false;
  isDropdownOpen = false;
  isSideDropdownOpen = false;
  isProfileDropdownOpen = false;
  isProfileDropdownOpenMobile = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private authService: AuthService, 
    private router: Router,
    private snackBar: SnackbarService
  ) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener("DOMContentLoaded", () => {
        const header = document.querySelector('.navbar');
        const sideNav = document.getElementById('sideNav');

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              sideNav?.classList.add('active');
            } else {
              sideNav?.classList.remove('active');
            }
          });
        }, { threshold: 0 });

        if (header) {
          observer.observe(header);
        }
      });
    }
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user?.token;
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuActive = !this.isMobileMenuActive;
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleProfileDropdown(event: Event): void {
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  toggleProfileDropdownMobile(event: Event): void {
    event.stopPropagation();
    this.isProfileDropdownOpenMobile = !this.isProfileDropdownOpenMobile;
  }

  toggleSideDropdown(event: Event): void {
    event.stopPropagation();
    this.isSideDropdownOpen = !this.isSideDropdownOpen;
  }

  collapseNavbar(): void {
    this.isMobileMenuActive = false;
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.openSnackBar('Logged out', '', 'info');
    this.router.navigate(['/']);
  }
}
