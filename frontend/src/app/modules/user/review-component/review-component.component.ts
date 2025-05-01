import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { CommentService } from '../../../shared/services/comment.service';
import { RatingService } from '../../../shared/services/rating.service';
import { Comment } from '../../../shared/models/comment';
import { CommentComponent } from '../components/comment/comment.component';

@Component({
  selector: 'app-review-component',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentComponent],
  templateUrl: './review-component.component.html',
  styleUrl: './review-component.component.css'
})
export class ReviewComponentComponent implements OnChanges {
  @Input() assetId!: string;

  comments: Comment[] = [];
  commentText: string = '';
  userId: string = '';
  averageRating: number = 0;
  loading = false;
  visibleCommentsCount = 3;
  showAllComments = false;
  errorMessage: string = ''; // ✅ Inline error field

  constructor(
    private commentService: CommentService,
    private ratingService: RatingService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assetId'] && this.assetId) {
      this.loadComments();
      this.loadAverageRating();
    }
  }

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
    this.loading = true;

    this.commentService.getCommentsByAsset(this.assetId).subscribe({
      next: data => {
        this.comments = data;
        this.loading = false;
        console.log('Loaded top-level comments:', this.comments);
      },
      error: err => {
        console.error('Error loading comments', err);
        this.loading = false;
      }
    });
  }

  loadAverageRating() {
    // You can implement this if needed
  }

  submitComment() {
    if (!this.commentText.trim()) return;

    const payload = {
      userId: Number(this.userId),
      assetId: this.assetId,
      comment: this.commentText,
    };

    this.commentService.addComment(payload).subscribe({
      next: () => {
        this.commentText = '';
        this.errorMessage = ''; // ✅ Clear error on success
        this.loadComments();
      },
      error: (err) => {
        if (
          err.status === 400 &&
          err.error === 'Review contains inappropriate language.'
        ) {
          this.errorMessage = '⚠️ Your comment contains inappropriate language.';
        } else {
          console.error('Error adding comment', err);
          this.errorMessage = '⚠️ Failed to submit comment.';
        }
      }
    });
  }

  get visibleComments() {
    return this.showAllComments
      ? this.comments
      : this.comments.slice(0, this.visibleCommentsCount);
  }

  toggleShowAllComments(): void {
    this.showAllComments = !this.showAllComments;
  }
}
