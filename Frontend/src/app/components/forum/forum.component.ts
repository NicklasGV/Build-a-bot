import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { UIState } from '../../interfaces/IUiState';
import { AuthService } from '../../services/auth.service';
import { resetUser, User } from '../../models/user.model';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [
      CommonModule,
      RouterModule,
    ],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss'
})
export class ForumComponent {
  currentUser: User = resetUser();  
  posts: Post[] = [];
  expanded?: boolean = false;
  activeTab?: 'about' | 'source';

  constructor(private postService: PostService, private authService: AuthService, private router: Router)
  {this.authService.currentUser.subscribe((x) => (this.currentUser = x)); }

  postStates: Record<number, UIState> = {};

  async ngOnInit(): Promise<void> {
    this.postService.getAll().subscribe({
      next: (result) => {
        this.posts = result;
      },
    });
  }
}
