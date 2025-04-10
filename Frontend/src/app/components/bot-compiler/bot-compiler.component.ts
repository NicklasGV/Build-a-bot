import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bot-compiler',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './bot-compiler.component.html',
  styleUrl: './bot-compiler.component.scss'
})
export class BotCompilerComponent {
  searchTerm: string = '';

  scripts: { name: string }[] = [];

  filteredScripts: { name: string }[] = [];

  chosenScripts: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.scripts = [
      { name: 'Authentication Script' },
      { name: 'Data Processing Script' },
      { name: 'UI Rendering Script' },
      { name: 'Notification Script' },
      { name: 'Logging Script' }
    ];
    this.filteredScripts = this.scripts;
  }

  filterScripts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredScripts = this.scripts.filter(script =>
      script.name.toLowerCase().includes(term)
    );
  }

  addToChosenScripts(script: { name: string }): void {
    if (!this.chosenScripts.includes(script.name)) {
      this.chosenScripts.push(script.name);
    }
  }
}
