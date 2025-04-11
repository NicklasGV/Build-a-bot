import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, resetUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  currentUser: Observable<User>;
  @Output() pik: EventEmitter<boolean> = new EventEmitter();
  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('currentUser') == null) {
      let user: User = resetUser();
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(sessionStorage.getItem('currentUser') as string)
    );
    this.currentUser = this.currentUserSubject.asObservable();
   }

   tt(penis: boolean){
    this.pik.emit(penis);
   }

   public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    let authenticateUrl = `${environment.apiUrl}User/authenticate`;
    return this.http.post<any>(authenticateUrl, { "email": email, "password": password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser') as string));
    this.currentUser = this.currentUserSubject.asObservable();
  }
}
