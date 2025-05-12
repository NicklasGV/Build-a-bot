import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ScriptService } from '../../../services/script.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import { resetScript, Script } from '../../../models/script.model';
import { User, resetUser } from '../../../models/user.model';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-favorites',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.scss'
})
export class UserFavoritesComponent {
  scripts: Script[] = [];
  script: Script = resetScript();
  user: User = resetUser();
  sortField: 'id'|'title'|'description'|'user'|'filePath' = 'id';
  sortDir: 'asc' | 'desc' = 'asc';

  constructor(
    private scriptService: ScriptService,
    private userService: UserService,
    private snackBar: SnackbarService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
    this.loadScripts();
  }

  isFavorited(script: Script): boolean {
    return (script.favorites ?? [])
      .some(u => u.id === this.user.id);
  }

  private loadScripts(): void {
    if (!this.user.id) {
      this.scripts = [];
      return;
    }
  
    this.scriptService.getAll()
      .pipe(
        map(scripts =>
          scripts.filter(s =>
            !!s.favorites?.some(favUser => favUser.id === this.user.id)
          )
        )
      )
      .subscribe({
        next: filtered => this.scripts = filtered,
        error: err   => {
          console.error('Failed to load scripts', err);
          this.snackBar.openSnackBar('Could not load favorites', '', 'error');
        }
      });
  }

  sortBy(field: 'id'|'title'|'description'|'user'|'filePath') {
    if (this.sortField === field) {
      // same column → just flip direction
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      this.scripts.reverse();
    } else {
      this.sortField = field;
      this.sortDir   = 'asc';
      this.applySort();
    }
  }

  private applySort() {
    this.scripts.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (this.sortField) {
        case 'user':
          aVal = a.user?.id;
          bVal = b.user?.id;
          break;
        default:
          aVal = (a as any)[this.sortField];
          bVal = (b as any)[this.sortField];
      }
      if (aVal == null) return -1;
      if (bVal == null) return 1;
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });

    if (this.sortDir === 'desc') {
      this.scripts.reverse();
    }
  }

  toggleFavorite(script: Script): void {
    script.userIds = script.favorites.map((user) => user.id);
    if (this.user.id === 0) {
      this.snackBar.openSnackBar('Please log in to favorite scripts.', '', 'warning');
    } else if (this.isFavorited(script)) {
      script.userIds = script.userIds.filter(userId => userId !== this.user.id);
    } else {
      script.userIds.push(this.user.id);
    }

    this.scriptService.update(script.id, script).subscribe({
      error: (err) => {},
      complete: () => {
        this.loadScripts();
      }
    })
  }
}
