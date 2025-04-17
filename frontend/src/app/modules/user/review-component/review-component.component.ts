import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { CommentService } from '../../../shared/services/comment.service';
import { RatingService } from '../../../shared/services/rating.service';
import { Comment } from '../../../shared/models/comment';
import { CommentComponent } from '../components/comment/comment.component';

@Component({
  selector: 'app-review-component',
  standalone: true,
  imports: [CommonModule,FormsModule,CommentComponent],
  templateUrl: './review-component.component.html',
  styleUrl: './review-component.component.css'
})
export class ReviewComponentComponent {
  @Input() assetId!: string;

  comments: Comment[] = [];
  commentText: string = '';
  userId: string = '';
  averageRating: number = 0;

  constructor(private commentService: CommentService, private ratingService: RatingService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId?.toString() ?? '';
    }

    if (this.assetId) {
      this.loadComments();
      this.loadAverageRating();
    }
  }

  loadComments() {
    this.commentService.getCommentsByAsset(this.assetId).subscribe({
      next: data => {
        this.comments = data;
        console.log('Comments loaded:', data);
      },
      
      error: err => console.error('Error loading comments', err)
    });
  }

  loadAverageRating() {
    // this.ratingService.getAverageRating(this.assetId).subscribe({
    //   next: data => this.averageRating = data,
    //   error: err => console.error('Error loading average rating', err)
    // });
  }

  submitComment() {
    if (!this.commentText.trim()) return;

    const payload = {
      userId: Number(this.userId),
      assetId: this.assetId,
      comment: this.commentText
    };

    this.commentService.addComment(payload).subscribe({
      next: () => {
        this.commentText = '';
        this.loadComments();
      },
      error: err => console.error('Error adding comment', err)
    });
  }
}
