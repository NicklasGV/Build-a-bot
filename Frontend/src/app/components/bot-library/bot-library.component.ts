import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BotService } from '../../services/bot.service';
import { Bot } from '../../models/bot.model';
import { UIState } from '../../interfaces/IUiState';

@Component({
  selector: 'app-bot-library',
  standalone: true,
  imports: [
    RouterModule, 
    CommonModule
  ],
  templateUrl: './bot-library.component.html',
  styleUrl: './bot-library.component.scss'
})
export class BotLibraryComponent {
  bots: Bot[] = [];
  expanded?: boolean = false;
  activeTab?: 'about' | 'source';

  constructor(private botService: BotService, private router: Router) {}
  
  botStates: Record<number, UIState> = {};

  async ngOnInit(): Promise<void> {
    this.botService.getAll().subscribe({
      next: (result) => {
        this.bots = result;

        result.forEach(bot => {
          if (!this.botStates[bot.id]) {
            this.botStates[bot.id] = { expanded: false, activeTab: 'about' };
          }
        });
      },
    });
  }


  toggleExpanded(botId: number): void {
    if (!this.botStates[botId]) {
      this.botStates[botId] = { expanded: false, activeTab: 'about' };
    }
    this.botStates[botId].expanded = !this.botStates[botId].expanded;
  }

  setActiveTab(botId: number, tab: 'about' | 'source'): void {
    if (!this.botStates[botId]) {
      this.botStates[botId] = { expanded: false, activeTab: 'about' };
    }
    this.botStates[botId].activeTab = tab;
  }
}
