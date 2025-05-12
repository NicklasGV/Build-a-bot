import { Component } from '@angular/core';
import { Post, resetPost } from '../../../models/post.model';
import { UserService } from '../../../services/user.service';
import { Comment } from '../../../models/comment.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { resetUser, User } from '../../../models/user.model';
import { RouterModule } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { CommentService } from '../../../services/comment.service';
import { SnackbarService } from '../../../services/snackbar.service';

interface FeedItem {
  id: number;
  postId: number;
  type: 'Post' | 'Comment';
  title?: string;
  text: string;
  createdAt: Date;
}

@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [CommonModule,
    RouterModule
  ],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.scss'
})


export class UserPostsComponent {
  currentUser: User = resetUser();  
  message: string = "";
    feedItems: FeedItem[] = [];
    post: Post = resetPost();
    users: { id: number; userName: string }[] = [];
    formData = new FormData();
  
    sortField: 'type' | 'title' | 'text' | 'createdAt' = 'createdAt';
    sortDir: 'asc' | 'desc' = 'desc';
    
    constructor(
      private userService: UserService,
      private postService: PostService,
      private commentService: CommentService,
      private authService: AuthService,
      private snackBar: SnackbarService
    ) {this.authService.currentUser.subscribe((x) => (this.currentUser = x)); }
  
    ngOnInit() {
      this.userService.findById(this.currentUser.id).subscribe({
        next: (result) => {
          this.feedItems = this.combinePostsAndComments(
            result.posts,
            result.comments 
          );
          if (this.feedItems.length === 0) {
            this.snackBar.openSnackBar('No posts or comments found', '', 'error');
          } else {
            this.applySort();
          }
        },
        error: () => {
          this.snackBar.openSnackBar('Failed to load in user Posts', '', 'error');
        }
      });
    }

    private combinePostsAndComments(posts: Post[], userComments: Comment[]): FeedItem[] {
      const result: FeedItem[] = [];
    
      const flattenReplies = (comments: Comment[]) => {
        for (const c of comments) {
          if (!c.isDeleted) {
            result.push({
              id: c.id,
              postId: c.postId,
              type: 'Comment',
              text: c.text,
              createdAt: c.createdAt
            });
          }
          if (c.replies?.length) {
            flattenReplies(c.replies);
          }
        }
      };
    
      for (const p of posts) {
        result.push({
          id: p.id,
          postId: p.id,
          type: 'Post',
          title: p.title,
          text: p.content,
          createdAt: p.createdAt
        });
        if (p.comments?.length) {
          flattenReplies(p.comments);
        }
      }
    
      for (const c of userComments) {
        if (!c.isDeleted) {
          result.push({
            id: c.id,
            postId: c.postId,
            type: 'Comment',
            text: c.text,
            createdAt: c.createdAt
          });
        }
        if (c.replies?.length) {
          flattenReplies(c.replies);
        }
      }
    
      return result;
    }
    

  sortBy(field: typeof this.sortField) {
    if (this.sortField === field) {
      this.sortDir = this.sortDir==='asc'?'desc':'asc';
      this.feedItems.reverse();
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
      this.applySort();
    }
  }

  private applySort() {
    this.feedItems.sort((a, b) => {
      let aVal: any = (a as any)[this.sortField];
      let bVal: any = (b as any)[this.sortField];

      // title only on posts; comments have undefined → treat as ''
      if (this.sortField==='title') {
        aVal = a.title || '';
        bVal = b.title || '';
      }
      if (this.sortField==='type') {
        // ensure Post < Comment if needed
        aVal = a.type;
        bVal = b.type;
      }

      if (aVal == null) return -1;
      if (bVal == null) return 1;
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
    if (this.sortDir==='desc') this.feedItems.reverse();
  }
  
    deleteItem(item: FeedItem) {
      if (item.type === 'Comment') {
        this.commentService.userdelete(item.id).subscribe({
          next: () => this.feedItems = this.feedItems.filter(c => c.id !== item.id),
          error: err => console.error(err)
        });
      }
      else if (item.type === 'Post') {
        this.postService.delete(item.id).subscribe({
          next: () => this.feedItems = this.feedItems.filter(p => p.id !== item.id),
          error: err => console.error(err)
        });
      }
    }
    
}
