import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScriptService } from '../../../../services/script.service';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { resetScript, Script } from '../../../../models/script.model';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-scripts-dashboard',
  standalone: true,
  imports: [
      CommonModule,
      HttpClientModule,
      FormsModule,
      MonacoEditorModule
    ],
  templateUrl: './scripts-dashboard.component.html',
  styleUrl: './scripts-dashboard.component.scss'
})
export class ScriptsDashboardComponent {
  scripts: Script[] = [];
  script: Script = resetScript();
  users: { id: number; userName: string }[] = [];
  message = '';
  isWriting = false;
  selectedFile: File | null = null;
  scriptText = '';
  editorOptions = {
    theme: 'vs-dark', language: 'python'
  };

  sortField: 'id'|'title'|'description'|'user'|'filePath' = 'id';
  sortDir: 'asc' | 'desc' = 'asc';

  constructor(
    private scriptService: ScriptService,
    private userService: UserService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadScripts();
    this.loadUsers();
  }

  private loadScripts(): void {
    this.scriptService.getAll().subscribe({
      next: scripts => this.scripts = scripts,
      error: err   => console.error('Failed to load scripts', err)
    });
  }

  private loadUsers(): void {
    this.userService.getAll().subscribe({
      next: users => this.users = users,
      error: err =>
        console.error('Failed to load users', err)
    });
  }

  toggleEditor() {
    this.isWriting = !this.isWriting;
    if (!this.isWriting) {
      this.scriptText = '';
    }
  }

  onFileSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    if (input.files?.length) {
      const f = input.files[0];
      const ext = f.name.split('.').pop()?.toLowerCase();
      if (ext === 'py' || ext === 'txt') {
        this.selectedFile = f;
      } else {
        input.value = '';
        this.selectedFile = null;
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
          aVal = a.user.id;
          bVal = b.user.id;
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
      this.selectedFile = new File([blob], `${this.script.title}.txt`, { type: 'text/plain' });
    }
    this.message = "";
    if (this.selectedFile) {
      this.script.scriptFile = this.selectedFile
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
    this.scriptService.delete(scriptId).subscribe({
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
}
