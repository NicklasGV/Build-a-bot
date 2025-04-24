import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';
type snackType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}
  
  public openSnackBar(message: string, action:string , type: snackType) {
    const _snackType = type !== undefined ? type : 'success';
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      data: { message: message, action: action , snackType: _snackType }
    });
  }
}
