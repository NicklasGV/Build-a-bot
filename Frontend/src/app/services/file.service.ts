import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly apiUrl = environment.fileServerUrl;
  //private readonly apiUrl = '/files'
  private readonly fileServerHeaders = new HttpHeaders({
    Authorization: 'Basic ' + btoa(
      `${environment.fileServerUser}:${environment.fileServerPass}`
    )
  });

  constructor(private http: HttpClient) { }

  /** List all files for a given codeId */
  getFiles(codeId: string): Observable<any> {
    const url = `${this.apiUrl}/${encodeURIComponent(codeId)}`;
    return this.http.get<any>(url, { headers: this.fileServerHeaders });
  }

  /** Upload a new file */
  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(this.apiUrl, formData, {
      headers: this.fileServerHeaders
    });
  }

  /** Fetch the _text_ contents of a file */
  getFileContent(filename: string): Observable<string> {
    const url = `${this.apiUrl}/${encodeURIComponent(filename)}`;
    return this.http.get(url, {
      headers: this.fileServerHeaders,
      responseType: 'text'
    });
  }

  /** Download raw Blob */
  download(fileName: string): Observable<Blob> {
    const url = `${this.apiUrl}/${encodeURIComponent(fileName)}`;
    return this.http.get(url, {
      headers: this.fileServerHeaders,
      responseType: 'blob'
    });
  }

  /** Replace an existing file */
  update(fileName: string, newFile: File): Observable<any> {
    const url = `${this.apiUrl}/${encodeURIComponent(fileName)}`;
    const formData = new FormData();
    formData.append('file', newFile, newFile.name);
    return this.http.put<any>(url, formData, {
      headers: this.fileServerHeaders
    });
  }

  /** Delete a file */
  delete(fileName: string): Observable<any> {
    const url = `${this.apiUrl}/${encodeURIComponent(fileName)}`;
    return this.http.delete<any>(url, {
      headers: this.fileServerHeaders
    });
  }
}
