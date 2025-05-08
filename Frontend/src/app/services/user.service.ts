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
    return this.http.delete<User>(this.apiUrl + userId);
  }

  softDelete(userId: number): Observable<User> {
    return this.http.delete<User>(this.apiUrl + 'Status/' + userId);
  }

  findById(userId: number): Observable<User> {
    return this.http.get<User>(this.apiUrl + userId);
  }

  create(user: User): Observable<User> {
    const formData = new FormData();

    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('userName', user.userName);

    if (user.scripts) {
      user.scripts.forEach(script => {
        formData.append('scripts', script.id.toString());
      });
    }

    if (user.role) {
      formData.append('role', user.role.toString());
    }

    return this.http.post<User>(this.apiUrl + 'register', formData);
  }

  update(user: User): Observable<User> {
    const formData = new FormData();
  
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('userName', user.userName);
    if (user.discord_id) {
      formData.append('discord_id', user.discord_id.toString())
    }

    if (user.scripts) {
      console.log(user.scripts);
      user.scripts.forEach(script => {
        formData.append('scriptIds', script.id.toString());
      });
    }

    if (user.role) {
      formData.append('role', user.role.toString());
    }

    if (user.token) {
      formData.append('token', user.token);
    }
    return this.http.put<User>(this.apiUrl + user.id, formData);
  }
}
