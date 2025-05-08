import { CommonModule }         from '@angular/common';
import { Component, OnInit }    from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule }          from '@angular/forms';

import { PostService }          from '../../services/post.service';
import { Post, resetPost }      from '../../models/post.model';
import { resetUser, User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { resetComment, Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  currentUser: User = resetUser();
  post: Post = resetPost();
  loading = true;
  isCreateMode = false;

  postEditMode = false;
  private originalPost: Post | undefined;

  newCommentText = '';
  activeReplyId = 0;
  hoveredId?: number;
  replyTextMap: { [parentId: number]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
    private commentService: CommentService,
    private router: Router
  ) {this.authService.currentUser.subscribe((x) => (this.currentUser = x)); }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id === '0') {
        this.isCreateMode = true;
        this.loading = false;
        return;
      }
      else {
        this.isCreateMode = false;
      }

      this.postService.findById(id).subscribe({
        next: post => {
          this.post = post;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    });
  }

  createPost(): void {
    if (!this.post.title?.trim() || !this.post.content?.trim()) {
      return;
    }

    if (this.currentUser.id !== 0){
      this.post.userId = this.currentUser.id;
      this.post.user = this.currentUser;
    }
    console.log('Creating post', this.post);
    this.postService.create(this.post as Post).subscribe({
      next: created => {
        this.router.navigate(['/post', created.id]);
      },
      error: err => {
        console.error('Failed to create', err);
      }
    });
  }

  postComment() {
    const text = this.newCommentText.trim();
    if (!text || !this.currentUser.id) return;

    // start from a fresh Comment object
    const c: Comment = {
      ...resetComment(),
      text,
      user: { id: this.currentUser.id } as any,
      post: { id: this.post.id } as any,
      parentCommentId: null
    };

    this.commentService.create(c).subscribe(created => {
      // ensure replies array exists
      created.replies = [];
      this.post.comments.push(created);
      this.newCommentText = '';
    });
  }

  toggleReply(commentId: number) {
    this.activeReplyId = this.activeReplyId === commentId ? 0 : commentId;
  }

  postReply(parentId: number) {
    const text = (this.replyTextMap[parentId] || '').trim();
    if (!text || !this.currentUser.id) return;

    const c: Comment = {
      ...resetComment(),
      text,
      user: { id: this.currentUser.id } as any,
      post: { id: this.post.id } as any,
      parentCommentId: parentId
    };

    this.commentService.create(c).subscribe(reply => {
      reply.replies = [];
      this.insertReply(this.post.comments, parentId, reply);
      this.replyTextMap[parentId] = '';
      this.activeReplyId = 0;
    });
  }

  private insertReply(list: Comment[], parentId: number, reply: Comment): boolean {
    for (let c of list) {
      if (c.id === parentId) {
        c.replies = c.replies || [];
        c.replies.push(reply);
        return true;
      }
      if (c.replies?.length && this.insertReply(c.replies, parentId, reply)) {
        return true;
      }
    }
    return false;
  }

  enablePostEdit() {
    this.originalPost = { ...this.post };
    this.postEditMode = true;
  }
  
  savePostEdit() {
    this.postService.update(this.post).subscribe(updated => {
      this.post = updated;
      this.postEditMode = false;
    });
  }
  
  cancelPostEdit() {
    this.post = this.originalPost!;
    this.postEditMode = false;
  }
}