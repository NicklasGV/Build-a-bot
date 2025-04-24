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

  findById(userId: string): Observable<User> {
    return this.http.get<User>(this.apiUrl + userId);
  }

  create(user: User): Observable<User> {
    const formData = new FormData();

    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('userName', user.userName);

    if (user.scripts) {
      user.scripts.forEach(scriptId => {
        formData.append('scripts', scriptId.toString());
      });
    }

    if (user.role) {
      formData.append('role', user.role.toString());
    }

    return this.http.post<User>(this.apiUrl + 'register', formData);
  }

}
