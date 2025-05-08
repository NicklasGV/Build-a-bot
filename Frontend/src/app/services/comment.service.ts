import { Comment } from './../models/comment.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly apiUrl = environment.apiUrl + 'Comment/';
  constructor(private http: HttpClient) { }

  delete(commentId: number): Observable<Comment> {
    return this.http.delete<Comment>(this.apiUrl + commentId);
  }

  userdelete(commentId: number): Observable<Comment> {
    return this.http.delete<Comment>(this.apiUrl + 'Status/' + commentId);
  }

  findById(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(this.apiUrl + commentId);
  }

  create(comment: Comment): Observable<Comment> {
        const formData = new FormData();
    
        if (comment.post?.id) {
          formData.append('postId', comment.post.id.toString())
        }
        if (comment.user?.id) {
          formData.append('userId', comment.user.id.toString())
        }
        if (comment.parentCommentId) {
          formData.append('parentCommentId', comment.parentCommentId.toString())
        }
        formData.append('IsDeleted', 'false');
        formData.append('Text', comment.text);
        

        return this.http.post<Comment>(this.apiUrl, formData);
      }
}
