import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Bot {
  bot_id: number;
  user_id: number;
  bot_name: string;
  description: string;
  code_id: string;
  guide_id: string;
}

interface BotUIState {
  expanded: boolean;
  activeTab: 'about' | 'source';
}

@Component({
  selector: 'app-bot-library',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './bot-library.component.html',
  styleUrl: './bot-library.component.scss'
})
export class BotLibraryComponent {
  expanded?: boolean = false;
  activeTab?: 'about' | 'source';
  dummyBots: Bot[] = [
    {
      bot_id: 1,
      user_id: 101,
      bot_name: 'Welcome Bot',
      description: 'A script to greet new users.',
      code_id: 'Source code for the Welcome Bot script. It includes functions for greeting users, handling commands, and managing user interactions. Make sure to test the script thoroughly before deploying it.',
      guide_id: 'This guide will help you set up the Welcome Bot. It includes steps for installation, configuration, and usage. Make sure to follow each step carefully to ensure the bot works as intended. If you encounter any issues, refer to the troubleshooting section at the end of the guide.',
    },
    {
      bot_id: 2,
      user_id: 102,
      bot_name: 'Reminder Bot',
      description: 'A script that sends reminders.',
      code_id: 'C002',
      guide_id: 'G002'
    },
    {
      bot_id: 3,
      user_id: 103,
      bot_name: 'Info Bot',
      description: 'A script that provides information.',
      code_id: 'C003',
      guide_id: 'G003'
    },
    {
      bot_id: 4,
      user_id: 103,
      bot_name: 'Info Bot',
      description: 'A script that provides information.',
      code_id: 'C003',
      guide_id: 'G003'
    },
    {
      bot_id: 5,
      user_id: 103,
      bot_name: 'Info Bot',
      description: 'A script that provides information.',
      code_id: 'C003',
      guide_id: 'G003'
    },
    {
      bot_id: 6,
      user_id: 103,
      bot_name: 'Info Bot',
      description: 'A script that provides information.',
      code_id: 'C003',
      guide_id: 'G003'
    }
  ];

  botStates: Record<number, BotUIState> = {};

  // Toggle the expanded state for the given script
  toggleExpanded(scriptId: number): void {
    if (!this.botStates[scriptId]) {
      // Initialize the state if it doesn't exist
      this.botStates[scriptId] = { expanded: false, activeTab: 'about' };
    }
    this.botStates[scriptId].expanded = !this.botStates[scriptId].expanded;
  }

  // Set the active tab for a given script
  setActiveTab(scriptId: number, tab: 'about' | 'source'): void {
    if (!this.botStates[scriptId]) {
      // Initialize the state if it doesn't exist
      this.botStates[scriptId] = { expanded: false, activeTab: 'about' };
    }
    this.botStates[scriptId].activeTab = tab;
  }
}
