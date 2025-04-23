import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  isMobileMenuActive = false;
  isDropdownOpen = false;
  isSideDropdownOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

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
  }

  toggleMobileMenu(): void {
    this.isMobileMenuActive = !this.isMobileMenuActive;
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSideDropdown(event: Event): void {
    event.stopPropagation();
    this.isSideDropdownOpen = !this.isSideDropdownOpen;
  }

  collapseNavbar(): void {
    this.isMobileMenuActive = false;
  }
}
