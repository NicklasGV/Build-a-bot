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
  activeTab?: 'about' | 'source';

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

        result.forEach(script => {
          if (!this.scriptStates[script.id]) {
            this.scriptStates[script.id] = { expanded: false, activeTab: 'about' };
          }
        });
      },
    });
  }

  toggleExpanded(scriptId: number): void {
    if (!this.scriptStates[scriptId]) {
      this.scriptStates[scriptId] = { expanded: false, activeTab: 'about' };
    }
    this.scriptStates[scriptId].expanded = !this.scriptStates[scriptId].expanded;
  }

  setActiveTab(scriptId: number, tab: 'about' | 'source'): void {
    if (!this.scriptStates[scriptId]) {
      this.scriptStates[scriptId] = { expanded: false, activeTab: 'about' };
    }
    this.scriptStates[scriptId].activeTab = tab;
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
