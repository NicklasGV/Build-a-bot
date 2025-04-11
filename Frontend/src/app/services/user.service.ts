import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = environment.apiUrl + 'User/';
  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl);
  }

  delete(userId: number): Observable<User> {
    return this.http.delete<User>(this.apiUrl + '/' + userId);
  }

  findById(userId: number): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/' + userId);
  }

}
