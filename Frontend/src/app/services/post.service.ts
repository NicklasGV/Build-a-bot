import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly apiUrl = environment.apiUrl + 'Post/';
  constructor(private http: HttpClient) { }

  getAll(): Observable<Post[]>{
    return this.http.get<Post[]>(this.apiUrl);
  }

  delete(postId: number): Observable<Post> {
    return this.http.delete<Post>(this.apiUrl + postId);
  }

  findById(postId: number): Observable<Post> {
    return this.http.get<Post>(this.apiUrl + postId);
  }

  create(post: Post): Observable<Post> {
        const formData = new FormData();
    
        if (post.user?.id) {
          formData.append('userId', post.user.id.toString())
        }
        formData.append('Title', post.title);
        formData.append('Content', post.content);

        return this.http.post<Post>(this.apiUrl, formData);
      }

  update(post: Post): Observable<Post> {
    const formData = new FormData();
    if (post.user?.id) {
      formData.append('userId', post.user.id.toString())
    }
    formData.append('Title', post.title);
    formData.append('Content', post.content);

    return this.http.put<Post>(this.apiUrl + post.id, formData);
  }
}
