import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Script } from '../../app/models/script.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  private readonly apiUrl = environment.apiUrl + 'Script/';
  private readonly fileServerUrl = environment.fileServerUrl;

  private readonly fileServerHeaders = new HttpHeaders({
    Authorization:
      'Basic ' + btoa(`${environment.fileServerUser}:${environment.fileServerPass}`)
  });

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

  create(script: Script): Observable<Script> {
    return this.http.post<Script>(this.apiUrl, script);
  }

  update(scriptId: number, script: Script): Observable<Script> {
    return this.http.put<Script>(this.apiUrl + '/' + scriptId, script);
  }

  getScriptContent(filename: string): Observable<string> {
    const url = `${this.fileServerUrl}/file/${encodeURIComponent(filename)}`;
    return this.http.get(url, {
      headers: this.fileServerHeaders,
      responseType: 'text'
    });
  }
}
