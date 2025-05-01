import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './snackbar.component.html',
  styles: [`
    $success-color: #28a745;
    $error-color:   #dc3545;
    $warning-color: #ffc107;
    $info-color:    #17a2b8;

    .snack-container {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      background: rgba(0,0,0,0.05);

      .snack-icon {
        font-size: 1.5rem;
        // give all icons a little breathing room
        margin-right: 0.75rem;

        &.success-icon { color: $success-color; }
        &.error-icon   { color: $error-color; }
        &.warning-icon { color: $warning-color; }
        &.info-icon    { color: $info-color; }
      }

      .snack-message {
        // replaces Bootstrap’s ms-3 + d-flex
        display: flex;
        align-items: center;
        margin-left: 0.75rem;
        flex: 1; // stretch if you like
        font-size: 1rem;
      }
    }
    `]
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { 
  }

  ngOnInit() {}

  get getIcon() {
    switch (this.data.snackType) {
      case 'Success':
        return 'done';
      case 'Error':
        return 'error';
      case 'Warn':
        return 'warning';
      case 'Info':
        return 'info';
    }
    return {type: this.data.snackType, icon: 'check'};
  }

  closeSnackbar() {
    this.data.snackBar.dismiss();
  }
}
