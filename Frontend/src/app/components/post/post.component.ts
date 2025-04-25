import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post, resetPost } from '../../models/post.model';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
post: Post = resetPost();
loading = true;

  constructor(private route: ActivatedRoute, private postService: PostService) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => { this.postService.findById(params['id']).subscribe({
      next: (value) => {
        this.post = value
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    })
  });

}
}
