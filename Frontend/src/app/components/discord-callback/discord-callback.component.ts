import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router }    from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discord-callback',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <p *ngIf="loading">Processing Discord login…</p>
    <p *ngIf="error" class="error">{{ error }}</p>
  `
})
export class DiscordCallbackComponent implements OnInit {
  loading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const code = params.get('code');
      if (!code) {
        this.error = 'No code returned from Discord.';
        this.loading = false;
        return;
      }

      this.auth.handleDiscordCallback(code).subscribe({
        next: user => {
          this.router.navigateByUrl('/');
        },
        error: err => {
          console.error(err);
          this.error = 'Discord login failed.';
          this.loading = false;
        }
      });
    });
  }
}
