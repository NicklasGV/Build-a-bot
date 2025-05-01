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
  // private readonly fileServerUrl = environment.fileServerUrl;
  private readonly fileServerUrl = '/files'

  private readonly fileServerHeaders = new HttpHeaders({
    Authorization:
      'Basic ' + btoa(`${environment.fileServerUser}:${environment.fileServerPass}`)
  });

  constructor(private http: HttpClient) { }

  getAll(): Observable<Script[]>{
    return this.http.get<Script[]>(this.apiUrl);
  }

  delete(scriptId: number): Observable<Script> {
    return this.http.delete<Script>(this.apiUrl + scriptId);
  }

  findById(scriptId: number): Observable<Script> {
    return this.http.get<Script>(this.apiUrl + scriptId);
  }

  create(script: Script): Observable<Script> {
    const formData = new FormData();
    
    formData.append('userId', script.user.id.toString())
    formData.append('title', script.title);
    formData.append('description', script.description);
    formData.append('codeLocationId', script.codeLocationId);
    if (script.scriptFile) {
      formData.append('scriptFile', script.scriptFile);
    }
    formData.append('guideLocationId', script.guideLocationId);
    if (script.guideFile) {
      formData.append('guideFile', script.guideFile);
    }
    return this.http.post<Script>(this.apiUrl + 'create', formData);
  }

  update(scriptId: number, script: Script): Observable<Script> {
    const formData = new FormData();
  
    formData.append('userId', script.user.id.toString())
    formData.append('title', script.title);
    formData.append('description', script.description);
    formData.append('codeLocationId', script.codeLocationId);
    if (script.scriptFile) {
      formData.append('scriptFile', script.scriptFile);
    }
    formData.append('guideLocationId', script.guideLocationId);
    if (script.guideFile) {
      formData.append('guideFile', script.guideFile);
    }
    if (script.StatusId) {
      formData.append('statusId', script.StatusId.toString())
    }
    if (script.userIds && script.userIds.length) {
      script.userIds.forEach(id =>
        formData.append('userIds', id.toString())
      );
    }
    if (script.botIds && script.botIds.length) {
      script.botIds.forEach(id =>
        formData.append('botIds', id.toString())
      );
    }
    return this.http.put<Script>(this.apiUrl + scriptId, formData);
  }

  getScriptContent(filename: string): Observable<string> {
    const url = `${this.fileServerUrl}/file/${encodeURIComponent(filename)}`;
    return this.http.get(url, {
      headers: this.fileServerHeaders,
      responseType: 'text'
    });
  }
}
