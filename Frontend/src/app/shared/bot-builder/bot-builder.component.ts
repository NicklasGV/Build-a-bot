import { join } from 'node:path';
import { Bot, resetBot } from './../../models/bot.model';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import {  Script } from './../../models/script.model';
import { User, resetUser } from '../../models/user.model';

import { ScriptService }    from '../../services/script.service';
import { AuthService }      from '../../services/auth.service';
import { SnackbarService }  from './../../services/snackbar.service';
import { Router } from '@angular/router';
import { BotService } from '../../services/bot.service';

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
  guidesText = '';
  editorOptions = { theme: 'vs-dark', language: 'python' };
  message: string = '';
  bots: Bot[] = [];
  bot: Bot = resetBot();
  saveToLibrary = true;
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
  private botService = inject(BotService);

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
    const bot: Bot = {
      id: 0,
      name: this.botName,
      user: this.currentUser || resetUser(),
      botScripts: this.selectedScripts,
    };
    localStorage.setItem('savedBot', JSON.stringify(bot));
    this.router.navigate(['/login'], { queryParams: { redirect: this.router.url } });
  }

  private buildBotGuides(): Observable<string> {
    const withGuides = this.selectedScripts
      .filter(s => !!s.guideLocationId);
    if (withGuides.length === 0) {
      return of('');
    }
    const guideStreams = withGuides.map(s =>
      this.scriptService.getGuideContent(s.guideLocationId!).pipe(
        map(content =>
          `--- Guide: ${s.title} ---\n\n${content.trim()}\n`
        ),
        catchError(() => of(''))
      )
    );
    return forkJoin(guideStreams).pipe(
      map(guides =>
        guides
          .map(g => g.trim())
          .filter(g => g.length > 0)
          .join('\n')
      )
    );
  }

  private buildBotScript(): string {
    const baseImports = [
      `import discord`,
      `from discord.ext import commands`,
    ];

    const botCommand = [
      `intents = discord.Intents.default()
      intents.message_content = True
      bot = commands.Bot(command_prefix='/', intents=intents)`,
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
      botCommand.join('\n'),
      bodies.join('\n\n'),
      footer.join('\n')
    ].join('\n');
  }

  private updateScriptPreview(): void {
    this.scriptContent = this.buildBotScript();
  }

  saveBot(): void {
    this.message = "";
    if (this.bot.id == 0) {
      //create
      this.botService.create(this.bot)
      .subscribe({
        next: (x) => {
          this.bots.push(x);
          this.bot = resetBot();
          this.snackBar.openSnackBar("Script created", '', 'success');
        },
        error: (err) => {
          console.log(err);
          this.message = Object.values(err.error.errors).join(", ");
          this.snackBar.openSnackBar(this.message, '', 'error');
        }
      });
    }
    this.bot = resetBot();
  }

  generateScript(): void {
    const fileBaseName = this.botName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '') || 'bot';
    const pythonCode = this.buildBotScript();

    this.buildBotGuides().subscribe(guidesText => {
      this.guidesText = guidesText;
    });
    
    const zip = new JSZip();
  
    zip.file(`${fileBaseName}.py`, pythonCode);

    if (this.guidesText.trim().length > 0) {
      zip.file(`Guide.txt`, this.guidesText);
    }

    zip.generateAsync({ type: 'blob' }).then(blob => {
      saveAs(blob, `${fileBaseName}.zip`);
    });
    if (this.currentUser?.id == 0) {
      this.botBuilderDialogRef.nativeElement.showModal();
      return;
    }
    if (this.saveToLibrary) {
      this.bot.name       = this.botName.trim();
      this.bot.user       = this.currentUser || resetUser();
      this.bot.botScripts = this.selectedScripts;
      this.saveBot();
    }
  }
}
