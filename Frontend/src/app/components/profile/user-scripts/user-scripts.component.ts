import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScriptService } from '../../../services/script.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { resetScript, Script } from '../../../models/script.model';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { SnackbarService } from '../../../services/snackbar.service';
import { map } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { resetUser, User } from '../../../models/user.model';

@Component({
  selector: 'app-user-scripts',
  standalone: true,
  imports: [
      CommonModule,
      HttpClientModule,
      FormsModule,
      MonacoEditorModule
    ],
  templateUrl: './user-scripts.component.html',
  styleUrl: './user-scripts.component.scss'
})
export class UserScriptsComponent {
  scripts: Script[] = [];
  script: Script = resetScript();
  user: User = resetUser();
  users: { id: number; userName: string }[] = [];
  message = '';
  isWriting = false;
  selectedGuideFile: File | null = null;
  selectedScriptFile: File | null = null;
  scriptText = '';
  editorOptions = {
    theme: 'vs-dark', language: 'python'
  };

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

  private loadScripts(): void {
    this.scriptService.getAll()
      .pipe(
        map(scripts =>
          this.user.id == null
            ? []
            : scripts.filter(s => s.user?.id === this.user.id)
        )
      )
      .subscribe({
        next: filtered => this.scripts = filtered,
        error: err   => console.error('Failed to load scripts', err)
      });
  }

  toggleEditor() {
    this.isWriting = !this.isWriting;
    if (!this.isWriting) {
      this.scriptText = '';
    }
  }

  onGuideFileSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    if (input.files?.length) {
      const f = input.files[0];
      const ext = f.name.split('.').pop()?.toLowerCase();
      if (ext === 'py' || ext === 'txt') {
        this.selectedGuideFile = f;
      } else {
        input.value = '';
        this.selectedGuideFile = null;
      }
    }
  }

  onScriptFileSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    if (input.files?.length) {
      const f = input.files[0];
      const ext = f.name.split('.').pop()?.toLowerCase();
      if (ext === 'py' || ext === 'txt') {
        this.selectedScriptFile = f;
      } else {
        input.value = '';
        this.selectedScriptFile = null;
      }
    }
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

  async onSubmit() {
    if (this.isWriting && this.scriptText.trim()) {
      const blob = new Blob([this.scriptText], { type: 'text/plain' });
      this.selectedScriptFile = new File([blob], `${this.script.title}.txt`, { type: 'text/plain' });
    }
    this.message = "";
    if (this.selectedScriptFile) {
      this.script.scriptFile = this.selectedScriptFile
    }
    if (this.selectedGuideFile) {
      this.script.guideFile = this.selectedGuideFile
    }
    if (this.user.id) {
      this.script.user = this.user;
    }
    if (this.script.id == 0) {
      //create
      this.scriptService.create(this.script)
      .subscribe({
        next: (x) => {
          this.scripts.push(x);
          this.script = resetScript();
          this.snackBar.openSnackBar("Script created", '', 'success');
        },
        error: (err) => {
          console.log(err);
          this.message = Object.values(err.error.errors).join(", ");
          this.snackBar.openSnackBar(this.message, '', 'error');
        }
      });
    } else {
      //update
      this.scriptService.update(this.script.id, this.script)
      .subscribe({
        error: (err) => {
          this.message = Object.values(err.error.errors).join(", ");
          this.snackBar.openSnackBar(this.message, '', 'error');
        },
        complete: () => {
          this.userService.getAll().subscribe(x => this.users = x);
          this.script = resetScript();
          this.snackBar.openSnackBar("Script updated", '', 'success');
        }
      });
    }
    this.script = resetScript();
  }

  editScript(script: Script) {
    Object.assign(this.script, script)
  }

  deleteScript(scriptId: number): void {
    this.scriptService.softDelete(scriptId).subscribe({
      next: () => {
        this.scripts = this.scripts.filter(s => s.id !== scriptId);
      },
      error: err => console.error('Delete failed', err)
    });
  }

  cancelEdit(): void {
    this.script = resetScript();
    this.snackBar.openSnackBar('Script cancelled.', '', 'warning')
  }

  expiryDate(original?: string | Date): Date | undefined {
    if (!original) return undefined;
    const d = new Date(original);
    d.setMonth(d.getMonth() + 6);
    return d;
  }
}
