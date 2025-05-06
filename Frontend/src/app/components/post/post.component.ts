import { CommonModule }         from '@angular/common';
import { Component, OnInit }    from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule }          from '@angular/forms';

import { PostService }          from '../../services/post.service';
import { Post, resetPost }      from '../../models/post.model';
import { resetUser, User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
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
}
