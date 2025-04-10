import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Script {
  script_id: number;
  user_id: number;
  script_name: string;
  description: string;
  code_id: string;
  guide_id: string;
}

interface ScriptUIState {
  expanded: boolean;
  activeTab: 'about' | 'source';
}

@Component({
  selector: 'app-script-library',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './script-library.component.html',
  styleUrl: './script-library.component.scss'
})
export class ScriptLibraryComponent {
  expanded?: boolean = false;
  activeTab?: 'about' | 'source';
  dummyScripts: Script[] = [
    {
      script_id: 1,
      user_id: 101,
      script_name: 'Welcome Bot',
      description: 'A script to greet new users.',
      code_id: 'Source code for the Welcome Bot script. It includes functions for greeting users, handling commands, and managing user interactions. Make sure to test the script thoroughly before deploying it.',
      guide_id: 'This guide will help you set up the Welcome Bot. It includes steps for installation, configuration, and usage. Make sure to follow each step carefully to ensure the bot works as intended. If you encounter any issues, refer to the troubleshooting section at the end of the guide.',
    },
    {
      script_id: 2,
      user_id: 102,
      script_name: 'Reminder Bot',
      description: 'A script that sends reminders.',
      code_id: 'C002',
      guide_id: 'G002'
    },
    {
      script_id: 3,
      user_id: 103,
      script_name: 'Info Bot',
      description: 'A script that provides information.',
      code_id: 'C003',
      guide_id: 'G003'
    },
    {
      script_id: 4,
      user_id: 103,
      script_name: 'Info Bot',
      description: 'A script that provides information.',
      code_id: 'C003',
      guide_id: 'G003'
    },
    {
      script_id: 5,
      user_id: 103,
      script_name: 'Info Bot',
      description: 'A script that provides information.',
      code_id: 'C003',
      guide_id: 'G003'
    },
    {
      script_id: 6,
      user_id: 103,
      script_name: 'Info Bot',
      description: 'A script that provides information.',
      code_id: 'C003',
      guide_id: 'G003'
    }
  ];

  scriptStates: Record<number, ScriptUIState> = {};

  // Toggle the expanded state for the given script
  toggleExpanded(scriptId: number): void {
    if (!this.scriptStates[scriptId]) {
      // Initialize the state if it doesn't exist
      this.scriptStates[scriptId] = { expanded: false, activeTab: 'about' };
    }
    this.scriptStates[scriptId].expanded = !this.scriptStates[scriptId].expanded;
  }

  // Set the active tab for a given script
  setActiveTab(scriptId: number, tab: 'about' | 'source'): void {
    if (!this.scriptStates[scriptId]) {
      // Initialize the state if it doesn't exist
      this.scriptStates[scriptId] = { expanded: false, activeTab: 'about' };
    }
    this.scriptStates[scriptId].activeTab = tab;
  }
}
