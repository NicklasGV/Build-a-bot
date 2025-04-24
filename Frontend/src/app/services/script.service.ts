import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Script } from '../../app/models/script.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  private readonly apiUrl = environment.apiUrl + 'Script/';
  constructor(private http: HttpClient) { }

  getAll(): Observable<Script[]>{
    return this.http.get<Script[]>(this.apiUrl);
  }

  delete(scriptId: number): Observable<Script> {
    return this.http.delete<Script>(this.apiUrl + '/' + scriptId);
  }

  findById(scriptId: number): Observable<Script> {
    return this.http.get<Script>(this.apiUrl + '/' + scriptId);
  }
}
