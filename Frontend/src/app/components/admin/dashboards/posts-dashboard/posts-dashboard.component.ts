import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { switchMap, map } from 'rxjs';
import { Role, constRoles } from '../../../../models/role.model';;
import { ScriptService } from '../../../../services/script.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SnackbarService } from '../../../../services/snackbar.service';
import { PostService } from '../../../../services/post.service';
import { Post, resetPost } from '../../../../models/post.model';
import { UserService } from '../../../../services/user.service';
import { Comment } from '../../../../models/comment.model';

@Component({
  selector: 'app-posts-dashboard',
  standalone: true,
  imports: [
      CommonModule,
      HttpClientModule,
      FormsModule
    ],
  templateUrl: './posts-dashboard.component.html',
  styleUrl: './posts-dashboard.component.scss'
})
export class PostsDashboardComponent {
  message: string = "";
  posts: Post[] = [];
  post: Post = resetPost();
  users: { id: number; userName: string }[] = [];
  formData = new FormData();

  sortField: 'id' | 'title' | 'userName' | 'text' | 'createdAt' | 'commentsCount' = 'id';
  sortDir: 'asc' | 'desc' = 'asc';
  
  constructor(
      private postService: PostService,
      private userService: UserService,
      private snackbar: SnackbarService
    ) {}

  ngOnInit() {
    this.postService.getAll().subscribe(x => this.posts = x);
    this.userService.getAll().subscribe({
      next: users => this.users = users,
      error: err =>
        console.error('Failed to load users', err)
    });
  }

  sortBy(field: 'id' | 'title' | 'userName' | 'text' | 'createdAt' | 'commentsCount') {
    if (this.sortField === field) {
      // same column → just flip direction
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      this.posts.reverse();
    } else {
      this.sortField = field;
      this.sortDir   = 'asc';
      this.applySort();
    }
  }

  private applySort() {
    this.posts.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (this.sortField) {
        case 'userName':
          aVal = a.user?.userName;
          bVal = b.user?.userName;
          break;
        case 'text':
          aVal = a.content;
          bVal = b.content;
          break;
        default:
          aVal = (a as any)[this.sortField];
          bVal = (b as any)[this.sortField];
      }

      // null-safe compare
      if (aVal == null) return -1;
      if (bVal == null) return 1;

      // string vs number
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });

    if (this.sortDir === 'desc') {
      this.posts.reverse();
    }
  }

  getTotalComments(comments: Comment[] = []): number {
    return comments.reduce(
      (sum, comment) =>
        sum + 1 + this.getTotalComments(comment.replies), // add 1 for this comment, then recurse
      0
    );
  }

  editPost(post: Post) {
    Object.assign(this.post, post);
  }

  cancelEdit() {
    this.post = resetPost();
      this.snackbar.openSnackBar('Post canceled.', '','warning');
  }

  onSubmit() {
    this.message = "";
    console.log(this.post);
      if (this.post.id == 0) {
        //create
        this.postService.create(this.post)
        .subscribe({
          next: (x) => {
            this.posts.push(x);
            this.post = resetPost();
            this.snackbar.openSnackBar("Post created", '', 'success');
          },
          error: (err) => {
            console.log(err);
            this.message = Object.values(err.error.errors).join(", ");
            this.snackbar.openSnackBar(this.message, '', 'error');
          }
        });
      } else {
        //update
        this.postService.update(this.post)
        .subscribe({
          error: (err) => {
            this.message = Object.values(err.error.errors).join(", ");
            this.snackbar.openSnackBar(this.message, '', 'error');
          },
          complete: () => {
            this.postService.getAll().subscribe(x => this.posts = x);
            this.post = resetPost();
            this.snackbar.openSnackBar("Post updated", '', 'success');
          }
        });
      }
      this.post = resetPost();
  }

  deletePost(id: number) {
    this.postService.delete(id).subscribe({
      next: () => this.posts = this.posts.filter(p => p.id !== id),
      error: err => console.error(err)
    });
  }
  
}
