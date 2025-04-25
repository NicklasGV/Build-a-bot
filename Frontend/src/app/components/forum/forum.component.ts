import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { UIState } from '../../interfaces/IUiState';

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
  posts: Post[] = [];
  expanded?: boolean = false;
  activeTab?: 'about' | 'source';

  constructor(private postService: PostService, private router: Router) {}

  postStates: Record<number, UIState> = {};

  async ngOnInit(): Promise<void> {
    this.postService.getAll().subscribe({
      next: (result) => {
        this.posts = result;
        console.log(this.posts);

        result.forEach(script => {
          if (!this.postStates[script.id]) {
            this.postStates[script.id] = { expanded: false, activeTab: 'about' };
          }
        });
      },
    });
  }
}
