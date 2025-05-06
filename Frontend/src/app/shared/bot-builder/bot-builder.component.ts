import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { Script } from './../../models/script.model';
import { Bot } from '../../models/bot.model';
import { User, resetUser } from '../../models/user.model';

import { ScriptService }    from '../../services/script.service';
import { AuthService }      from '../../services/auth.service';
import { SnackbarService }  from './../../services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bot-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MonacoEditorModule
  ],
  templateUrl: './bot-builder.component.html',
  styleUrls: ['./bot-builder.component.scss']
})
export class BotBuilderComponent implements OnInit {
  currentUser:     User | null = null;
  scripts:         Script[] = [];
  selectedScripts: Script[] = [];
  botName = 'My Discord Bot';
  searchTerm = '';
  showPreview   = false;
  scriptContent = '';
  editorOptions = { theme: 'vs-dark', language: 'python' };
  @ViewChild('botBuilderDialog', { static: false })
  botBuilderDialogRef!: ElementRef<HTMLDialogElement>;

  isFilterOpen  = false;
  get isMobile(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia('(max-width: 767px)').matches;
  }

  private scriptService = inject(ScriptService);
  private router    = inject(Router);
  private authService   = inject(AuthService);
  private snackBar      = inject(SnackbarService);

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.fetchScripts();
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  handleBotFilterClick(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  fetchScripts(): void {
    this.scriptService.getAll().subscribe({
      next: scripts => {
        this.scripts = scripts.map(s => ({ ...s, selected: false }));
        this.scripts = scripts.filter(s => s.status == null);
      },
      error: () => this.snackBar.openSnackBar('Failed to load scripts', '', 'error')
    });
  }

  filteredScripts(): Script[] {
    const term = this.searchTerm.trim().toLowerCase();
    return term
      ? this.scripts.filter(s =>
          s.title.toLowerCase().includes(term) ||
          (s.description ?? '').toLowerCase().includes(term))
      : this.scripts;
  }

  onScriptSelectionChange(script: Script): void {
    if (script.selected) {
      this.scriptService.getScriptContent(script.codeLocationId).subscribe({
        next: content => {
          script.content = content;
          this.selectedScripts.push(script);
          this.updateScriptPreview();
        },
        error: () => {
          this.snackBar.openSnackBar(`Failed to load "${script.title}"`, '', 'error');
          script.selected = false;
        }
      });
    } else {
      this.removeScript(script);
    }
  }

  removeScript(script: Script): void {
    script.selected = false;
    this.selectedScripts = this.selectedScripts.filter(s => s.id !== script.id);
    this.updateScriptPreview();
  }

  handleLoginClick(): void {
    const fullScript = this.buildBotScript();
    const bot: Bot = {
      id: 0,
      name: this.botName,
      user: this.currentUser || resetUser(),
      botScripts: this.selectedScripts,
    };
    localStorage.setItem('savedBot', JSON.stringify(bot));
    this.router.navigate(['/login'], { queryParams: { redirect: this.router.url } });
  }

  private buildBotScript(): string {
    const baseImports = [
      `import discord`,
      `from discord.ext import commands`,
      ``,
      `bot = commands.Bot(command_prefix='!')`,
      ``
    ];
  
    const importSet = new Set<string>();
    const bodies = this.selectedScripts.map(s => {
      const lines = s.content.split('\n');
      const bodyLines: string[] = [];
  
      for (let line of lines) {
        const trimmed = line.trim();
        if (/^(import\s+\w)|(from\s+\S+\s+import\s+)/.test(trimmed)) {
          importSet.add(trimmed);
        } else {
          bodyLines.push(line);
        }
      }
  
      return [
        `# ——— ${s.title} ———`,
        bodyLines.join('\n').trim()
      ].join('\n');
    });
  
    const scriptImports = Array.from(importSet).sort();
    const allImports = [
      ...baseImports,
      ...scriptImports,
      ``
    ];
  
    const footer = [
      ``,
      `if __name__ == "__main__":`,
      `    bot.run("YOUR_BOT_TOKEN")`,
      ``
    ];
  
    return [
      allImports.join('\n'),
      bodies.join('\n\n'),
      footer.join('\n')
    ].join('\n');
  }

  private updateScriptPreview(): void {
    this.scriptContent = this.buildBotScript();
  }

  generateScript(): void {
    const fullScript = this.buildBotScript();
    const blob = new Blob([fullScript], { type: 'text/plain' });
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const fileName = this.botName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '') || 'bot';
    
    a.href     = url;
    a.download = `${fileName}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    if (this.currentUser?.id == 0) {
      this.botBuilderDialogRef.nativeElement.showModal();
    }
  }
}
