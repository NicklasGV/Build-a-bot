import { Script } from './../../models/script.model';
import { SnackbarService } from './../../services/snackbar.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ScriptService } from '../../services/script.service';
import { BotService } from '../../services/bot.service';
import { AuthService } from '../../services/auth.service';
import { Bot } from '../../models/bot.model';
import { User } from '../../models/user.model';

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
  get isMobile(): boolean { return window.matchMedia('(max-width: 767px)').matches; }

  /** base template */
  private baseTemplate = `
import discord
from discord.ext import commands

bot = commands.Bot(command_prefix='!')

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user}')

{% for script in scripts %}
{{ script.content }}
{% endfor %}

bot.run('YOUR_BOT_TOKEN')
`;

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

  private updateScriptPreview(): void {
    const scriptsCode = this.selectedScripts.map(s => s.content).join('\n\n');
    this.scriptContent = this.baseTemplate.replace(
      /{% for script in scripts %}[\s\S]*{% endfor %}/,
      scriptsCode
    );
  }

  /* ---------- generate ---------- */
  generateScript(): void {
    if (!this.botName.trim()) {
      this.snackBar.openSnackBar('Bot name cannot be empty', '', 'error');
      return;
    }
    if (!this.currentUser) {
      this.snackBar.openSnackBar('No user in session', '', 'error');
      return;
    }
    const currentUser = this.currentUser as User;
    const scriptsForApi: Script[] = this.selectedScripts.map(ui => ({
      id:             ui.id,
      title:          ui.title,
      description:    ui.description,
      codeLocationId: ui.codeLocationId,
      guideLocationId:ui.guideLocationId,
      user:       currentUser,
      botScripts: [],
      favorites:  []
    }));
  
    const botData: Bot = {
      id: 0,
      name: this.botName,
      user: currentUser,
      botScripts: scriptsForApi
    };
    this.botService.create(botData).subscribe({
      next: () => this.downloadScript(this.scriptContent, `${this.botName}.py`),
      error: () => this.snackBar.openSnackBar('Failed to create bot', '', 'error')
    });
  }

  private downloadScript(code: string, filename: string): void {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

/* ---------- extra typing ---------- */
export interface ScriptWithSelection extends Script {
  selected: boolean;
  content?: string;
}
