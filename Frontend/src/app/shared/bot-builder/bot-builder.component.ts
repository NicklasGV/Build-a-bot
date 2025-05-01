import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

import { Script } from './../../models/script.model';
import { Bot } from '../../models/bot.model';
import { User } from '../../models/user.model';

import { ScriptService }    from '../../services/script.service';
import { BotService }       from '../../services/bot.service';
import { AuthService }      from '../../services/auth.service';
import { SnackbarService }  from './../../services/snackbar.service';

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

  /** ======== state ======== */
  currentUser:     User | null = null;
  scripts:         ScriptWithSelection[] = [];
  selectedScripts: ScriptWithSelection[] = [];

  botName = 'My Discord Bot';
  searchTerm = '';

  /** preview / monaco */
  showPreview   = false;
  scriptContent = '';
  editorOptions = { theme: 'vs-dark', language: 'python', automaticLayout: true };

  /** mobile filter modal */
  isFilterOpen  = false;
  get isMobile(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia('(max-width: 767px)').matches;
  }

  /** ======== services ======== */
  private scriptService = inject(ScriptService);
  private botService    = inject(BotService);
  private authService   = inject(AuthService);
  private snackBar      = inject(SnackbarService);

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.fetchScripts();
  }

  /* ---------- ui helpers ---------- */

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  handleBotFilterClick(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  /* ---------- data ---------- */

  fetchScripts(): void {
    this.scriptService.getAll().subscribe({
      next: scripts => {
        this.scripts = scripts.map(s => ({ ...s, selected: false }));
      },
      error: () => this.snackBar.openSnackBar('Failed to load scripts', '', 'error')
    });
  }

  filteredScripts(): ScriptWithSelection[] {
    const term = this.searchTerm.trim().toLowerCase();
    return term
      ? this.scripts.filter(s =>
          s.title.toLowerCase().includes(term) ||
          (s.description ?? '').toLowerCase().includes(term))
      : this.scripts;
  }

  onScriptSelectionChange(script: ScriptWithSelection): void {
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

  removeScript(script: ScriptWithSelection): void {
    script.selected = false;
    this.selectedScripts = this.selectedScripts.filter(s => s.id !== script.id);
    this.updateScriptPreview();
  }

  /* ---------- script‐wrapping helpers ---------- */

  /** Wrap raw script code into a Python module with a register(bot) function */
  private wrapScriptAsModule(content: string): string {
    const body = content
      .split('\n')
      .map(line => '    ' + line)
      .join('\n');
    return `# auto-generated module
def register(bot):
${body}
`;
  }

  /** Turn a script title into a safe Python module name */
  private sanitizeModuleName(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /** Build the main.py that imports & calls every register_XXX */
  private buildMainPy(): string {
    const imports = this.selectedScripts
      .map(s => {
        const mod = this.sanitizeModuleName(s.title);
        return `from ${mod} import register as register_${mod}`;
      })
      .join('\n');

    const calls = this.selectedScripts
      .map(s => {
        const mod = this.sanitizeModuleName(s.title);
        return `    register_${mod}(bot)`;
      })
      .join('\n');

    return `
import discord
from discord.ext import commands
${imports}

bot = commands.Bot(command_prefix='!')

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')


def register_all():
${calls}

register_all()

bot.run('YOUR_BOT_TOKEN')
`.trim() + '\n';
  }

  /* ---------- preview ---------- */

  private updateScriptPreview(): void {
    // Show the generated main.py in the editor
    this.scriptContent = this.buildMainPy();
  }

  /* ---------- generate & download ---------- */

  generateScript(): void {
  //   if (!this.botName.trim()) {
  //     this.snackBar.openSnackBar('Bot name cannot be empty', '', 'error');
  //     return;
  //   }
  //   if (!this.currentUser) {
  //     this.snackBar.openSnackBar('No user in session', '', 'error');
  //     return;
  //   }

  //   const zip = new JSZip();

  //   // 1) One module file per script
  //   this.selectedScripts.forEach(ui => {
  //     const modName = this.sanitizeModuleName(ui.title);
  //     const moduleContent = this.wrapScriptAsModule(ui.content!);
  //     zip.file(`${modName}.py`, moduleContent);
  //   });

  //   // 2) Add the main launcher
  //   zip.file('main.py', this.buildMainPy());

  //   // 3) Generate & trigger download
  //   zip.generateAsync({ type: 'blob' })
  //     .then((blob: any) => saveAs(blob, `${this.botName.replace(/\s+/g,'_')}.zip`))
  //     .catch(() =>
  //       this.snackBar.openSnackBar('Failed to bundle bot files', '', 'error')
  //     );
  }
}

/* ---------- extra typing ---------- */
export interface ScriptWithSelection extends Script {
  selected: boolean;
  content?: string;
}
