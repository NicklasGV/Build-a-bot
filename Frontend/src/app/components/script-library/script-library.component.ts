import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScriptService } from '../../services/script.service';
import { Router } from '@angular/router';
import { Script } from '../../models/script.model';
import { HttpClientModule } from '@angular/common/http';
import { UIState } from '../../interfaces/IUiState';

@Component({
  selector: 'app-script-library',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
  ],
  templateUrl: './script-library.component.html',
  styleUrl: './script-library.component.scss'
})
export class ScriptLibraryComponent {
  scripts: Script[] = [];
  expanded?: boolean = false;
  activeTab?: 'about' | 'source';

  constructor(private scriptService: ScriptService, private router: Router) {}

  scriptStates: Record<number, UIState> = {};

  async ngOnInit(): Promise<void> {
    this.scriptService.getAll().subscribe({
      next: (result) => {
        this.scripts = result.filter(s => s.status == null);
        console.log(this.scripts);

        result.forEach(script => {
          if (!this.scriptStates[script.id]) {
            this.scriptStates[script.id] = { expanded: false, activeTab: 'about' };
          }
        });
      },
    });
  }

  toggleExpanded(scriptId: number): void {
    if (!this.scriptStates[scriptId]) {
      this.scriptStates[scriptId] = { expanded: false, activeTab: 'about' };
    }
    this.scriptStates[scriptId].expanded = !this.scriptStates[scriptId].expanded;
  }

  setActiveTab(scriptId: number, tab: 'about' | 'source'): void {
    if (!this.scriptStates[scriptId]) {
      this.scriptStates[scriptId] = { expanded: false, activeTab: 'about' };
    }
    this.scriptStates[scriptId].activeTab = tab;
  }
}
