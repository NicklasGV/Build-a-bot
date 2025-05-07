import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SnackbarService } from '../snackbar.service';
import { RoleId } from '../../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  public RoleId = RoleId;

  constructor(private router: Router, private authService: AuthService, private snackBar: SnackbarService) { }

  canActivate() {
    const currentUser = this.authService.currentUserValue;

  if (currentUser && currentUser.role == RoleId.Admin) {
    return true;
  } else {
    this.snackBar.openSnackBar('You are not authorized to access this page', '', 'error');
    this.router.navigate(['/']);
    return false;
  }
}
  
}