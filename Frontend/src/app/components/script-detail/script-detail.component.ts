import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { resetScript, Script } from '../../models/script.model';
import { AuthService } from '../../services/auth.service';
import { ScriptService } from '../../services/script.service';
import { SnackbarService } from '../../services/snackbar.service';
import { resetUser, User } from '../../models/user.model';

@Component({
  selector: 'app-script-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './script-detail.component.html',
  styleUrl: './script-detail.component.scss'
})
export class ScriptDetailComponent {
  scripts: Script[] = [];
  script: Script = resetScript();
  user: User = resetUser();
  activeTab: 'guide' | 'code' = 'guide';
  guideContent?: string;
  codeContent?: string;
  loadingGuide = false;
  loadingCode = false;
  guideError = false;
  codeError = false;
  loading = true;
  error = false;

  constructor(
    private authService: AuthService,
    private scriptService: ScriptService, 
    private snackbar: SnackbarService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    
  }

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.scriptService.findById(id).subscribe({
      next: s => {
        this.script = s;
        this.loading = false;
        if (s.guideLocationId) {
          this.loadGuide();
        } else {
          this.activeTab = 'code';
          this.loadCode();
        }
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
    this.user.id = this.authService.currentUserValue.id;
  }

  setTab(tab: 'guide' | 'code') {
    this.activeTab = tab;
    if (tab === 'guide' && this.guideContent == null && !this.loadingGuide) {
      this.loadGuide();
    }
    if (tab === 'code' && this.codeContent == null && !this.loadingCode) {
      this.loadCode();
    }
  }

  private loadGuide() {
    this.loadingGuide = true;
    this.scriptService.getGuideContent(this.script.guideLocationId).subscribe({
      next: c => this.guideContent = c,
      error: () => this.guideError = true,
      complete: () => this.loadingGuide = false
    });
  }

  private loadCode() {
    this.loadingCode = true;
    this.scriptService.getScriptContent(this.script.codeLocationId).subscribe({
      next: c => this.codeContent = c,
      error: () => this.codeError = true,
      complete: () => this.loadingCode = false
    });
  }
}
