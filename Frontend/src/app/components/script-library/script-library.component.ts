import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScriptService } from '../../services/script.service';
import { Router } from '@angular/router';
import { resetScript, Script } from '../../models/script.model';
import { HttpClientModule } from '@angular/common/http';
import { UIState } from '../../interfaces/IUiState';
import { SnackbarService } from '../../services/snackbar.service';
import { User, resetUser } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import e from 'express';

@Component({
  selector: 'app-script-library',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
  ],
  templateUrl: './script-library.component.html',
  styleUrl: './script-library.component.scss'
})
export class ScriptLibraryComponent {
  scripts: Script[] = [];
  script: Script = resetScript();
  user: User = resetUser();
  expanded?: boolean = false;
  activeTab?: 'tab1' | 'tab2';
  hasGuide: boolean = false;

  constructor(
    private authService: AuthService,
    private scriptService: ScriptService, 
    private snackbar: SnackbarService
  ) {}

  scriptStates: Record<number, UIState> = {};

  async ngOnInit(): Promise<void> {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
    this.loadScripts();
  }

  private loadScripts(): void {
    this.scriptService.getAll().subscribe({
      next: (result) => {
        this.scripts = result.filter(s => s.status == null);
        this.scripts.forEach(script => {
          if (!this.scriptStates[script.id]) {
            const hasGuide = !!script.guideLocationId?.trim();
            this.scriptStates[script.id] = {
              expanded: false,
              activeTab: hasGuide ? 'tab1' : 'tab2',
              loadingGuide: false,
              loadingCode: false,
              guideContent: undefined,
              codeContent: undefined,
              guideError: false,
              codeError: false
            };
          }
        });
      },
    });
  }

  toggleExpanded(scriptId: number): void {
    const state = this.scriptStates[scriptId];
    state.expanded = !state.expanded;
    // Optionally pre-load whichever tab is default:
    if (state.expanded && state.activeTab === 'tab1') {
      this.loadGuideContent(scriptId, this.getScript(scriptId).guideLocationId);
    } else if (state.expanded && state.activeTab === 'tab2') {
      this.loadCodeContent(scriptId, this.getScript(scriptId).codeLocationId);
    }
  }

  setActiveTab( scriptId: number, tab: 'tab1' | 'tab2', script: Script): void {
    const state = this.scriptStates[scriptId];
    if (tab === 'tab1' && !(script.guideLocationId?.trim())) {
      return;
    }
    state.activeTab = tab;

    if (tab === 'tab1' && !state.guideContent && !state.loadingGuide) {
      this.loadGuideContent(scriptId, script.guideLocationId);
    }
    if (tab === 'tab2' && !state.codeContent && !state.loadingCode) {
      this.loadCodeContent(scriptId, script.codeLocationId);
    }
  }

  private loadGuideContent(scriptId: number, filename: string) {
    const state = this.scriptStates[scriptId];
    state.loadingGuide = true;
    state.guideError = false;

    this.scriptService.getGuideContent(filename).subscribe({
      next: content => {
        state.guideContent = content;
      },
      error: () => {
        state.guideError = true;
      },
      complete: () => {
        state.loadingGuide = false;
      }
    });
  }

  private loadCodeContent(scriptId: number, filename: string) {
    const state = this.scriptStates[scriptId];
    state.loadingCode = true;
    state.codeError = false;

    this.scriptService.getScriptContent(filename).subscribe({
      next: content => {
        state.codeContent = content;
      },
      error: () => {
        state.codeError = true;
      },
      complete: () => {
        state.loadingCode = false;
      }
    });
  }

  private getScript(id: number): Script {
    return this.scripts.find(s => s.id === id)!;
  }

  isIdInArray(script: any, targetId: any): boolean {
    return script.favorites.some(
      (scriptFav: { id: any }) => scriptFav.id === targetId
    );
  }

  isFavorited(script: Script): boolean {
    return script.favorites.some(({ id }) => id === this.user.id);
  }

  toggleFavorite(script: Script): void {
    script.userIds = script.favorites.map((user) => user.id);
    if (this.user.id === 0) {
      this.snackbar.openSnackBar('Please log in to favorite scripts.', '', 'warning');
    } else if (this.isFavorited(script)) {
      script.userIds = script.userIds.filter(userId => userId !== this.user.id);
    } else {
      script.userIds.push(this.user.id);
    }

    this.scriptService.update(script.id, script).subscribe({
      error: (err) => {},
      complete: () => {
        this.scriptService.getAll().subscribe({
          next: (results) => {
            this.scripts = results;
          }
        })
      }
    })
  }
}
