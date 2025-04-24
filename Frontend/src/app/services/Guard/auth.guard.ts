import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../auth.service';
import { SnackbarService } from '../snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private router: Router, private authService: AuthService, private snackBar: SnackbarService) { }

  canActivate() {
    const currentUser = this.authService.currentUserValue;

  // if (currentUser && currentUser.role == 'Admin') {
  //   return true;
  // } else {
  //   this.snackBar.openSnackBar('You are not authorized to access this page', '', 'error');
  //   this.router.navigate(['/']);
  //   return false;
  // }
}
  
}