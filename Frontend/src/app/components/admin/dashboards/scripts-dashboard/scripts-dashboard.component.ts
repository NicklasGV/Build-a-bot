import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { FileService } from '../../../../services/file.service';
import { ScriptService } from '../../../../services/script.service';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Script } from '../../../../models/script.model';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-scripts-dashboard',
  standalone: true,
  imports: [
      CommonModule,
      HttpClientModule,
      ReactiveFormsModule,
      FormsModule,
      MonacoEditorModule
    ],
  templateUrl: './scripts-dashboard.component.html',
  styleUrl: './scripts-dashboard.component.scss'
})
export class ScriptsDashboardComponent {
  scripts: Script[] = [];
  users: { id: number; userName: string }[] = [];
  scriptForm: FormGroup;
  isWriting = false;
  selectedFile: File | null = null;
  scriptText = '';
  editorOptions = {
    theme: 'vs-dark', language: 'python'
  };

  sortField: 'id' | 'title' | 'description' | 'userId' = 'id';
  sortDir: 'asc' | 'desc' = 'asc';

  private scriptService = inject(ScriptService);
  private userService   = inject(UserService);
  private fileService   = inject(FileService)
  private fb            = inject(FormBuilder);


  constructor() {
    this.scriptForm = this.fb.group({
      id:     [0],
      title:  ['', Validators.required],
      description:  [''],
      userId: [null, Validators.required],
      codeId: [''],
      scriptText:  ['']
    });
  }

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
      next: users => 
        this.users = users.map(u => ({ id: u.id, userName: u.userName })),
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

  sortBy(field: 'id' | 'title' | 'description' | 'userId') {
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
        case 'userId':
          aVal = a.userId;
          bVal = b.userId;
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
    if (this.scriptForm.invalid) return;

    // 1) if writing, turn text → blob → file
    if (this.isWriting && this.scriptText.trim()) {
      const blob = new Blob([this.scriptText], { type: 'text/plain' });
      this.selectedFile = new File([blob], `${this.scriptForm.value.title}.txt`, {
        type: 'text/plain'
      });
    }

    // 3) build payload
    const raw = this.scriptForm.value;
    const payload: Script = {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      userId: raw.userId,
      codeLocationId: raw.codeId,
      guideLocationId: '',
      botIds: [],
      scriptFile: raw.scriptFile,
      guideFile: null,
      userIds: []
    };

    // 4) create vs update
    if (payload.id && payload.id !== 0) {
      this.scriptService.update(payload.id, payload).subscribe({
        next: updated => {
          const i = this.scripts.findIndex(s => s.id === updated.id);
          if (i > -1) this.scripts[i] = updated;
          this.cancelEdit();
        },
        error: err => console.error('Update failed', err)
      });
    } else {
      this.scriptService.create(payload).subscribe({
        next: created => {
          this.scripts.push(created);
          this.cancelEdit();
        },
        error: err => console.error('Create failed', err)
      });
    }
  }

  editScript(id: number) {
    this.scriptService.findById(id).subscribe({
      next: s => {
        this.cancelEdit();
        this.scriptForm.patchValue({
          id:     s.id,
          title:  s.title,
          userId: s.userId,
          codeId: s.codeLocationId
        });
      },
      error: e => console.error('Load single failed', e)
    });
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
    this.scriptForm.reset({ id: 0, title: '', userId: null });
  }
}
