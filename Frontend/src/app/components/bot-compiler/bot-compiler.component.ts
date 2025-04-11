import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Script } from '../../models/script.model';
import { ScriptService } from '../../services/script.service';

@Component({
  selector: 'app-bot-compiler',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './bot-compiler.component.html',
  styleUrl: './bot-compiler.component.scss'
})
export class BotCompilerComponent {
  searchTerm: string = '';

  scripts: Script[] = [];

  filteredScripts: Script[] = [];

  chosenScripts: Script[] = [];

  constructor(private scriptService: ScriptService) { }

  ngOnInit(): void {
    this.scriptService.getAll().subscribe({
      next: (result) => {
        this.scripts = result;
      },
    });
    
    this.filteredScripts = this.scripts;
  }

  filterScripts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredScripts = this.scripts.filter(script =>
      script.title.toLowerCase().includes(term)
    );
  }

  addToChosenScripts(script: Script): void {
    if (!this.chosenScripts.includes(script)) {
      this.chosenScripts.push(script);
    }
  }

  removeFromChosenScripts(script: Script): void {
    const index = this.chosenScripts.indexOf(script);
    if (index > -1) {
      this.chosenScripts.splice(index, 1);
    }
  }
}
