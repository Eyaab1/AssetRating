import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { CommentService } from '../../../shared/services/comment.service';
import { RatingService } from '../../../shared/services/rating.service';
import { Comment } from '../../../shared/models/comment';
import { CommentComponent } from '../components/comment/comment.component';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-review-component',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentComponent],
  templateUrl: './review-component.component.html',
  styleUrl: './review-component.component.css'
})
export class ReviewComponentComponent implements OnChanges {
  @Input() assetId!: string;
  @Output() commentAdded = new EventEmitter<void>();


  allComments: any[] = [];        
  visibleComments: any[] = [];    
  showAllComments = false;
  maxVisible = 3;

  commentText: string = '';
  userId: string = '';
  averageRating: number = 0;
  loading = false;
  errorMessage: string = '';
@Input() highlightReviewId: string | null = null;
@Input() highlightReportId: string | null = null;

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
      next: (data) => {
        const ratingRequests = data.map((c: any) => {
          const isReview = c.comment.startsWith('__REVIEW__ ');
          const cleanedComment = isReview ? c.comment.replace('__REVIEW__ ', '') : c.comment;

          const baseComment = {
            ...c,
            comment: cleanedComment
          };

          return isReview
            ? this.ratingService.getUserRating(Number(c.userId), this.assetId).pipe(
                map((rating) => ({
                  ...baseComment,
                  userRating: { average: rating.average }
                })),
                catchError(() =>
                  of({
                    ...baseComment,
                    userRating: undefined
                  })
                )
              )
            : of(baseComment);
        });

        forkJoin(ratingRequests).subscribe({
          next: (mergedComments) => {
            this.allComments = mergedComments.sort((a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            this.updateVisibleComments();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading ratings/comments', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading comments', err);
        this.loading = false;
      }
    });
  }

  updateVisibleComments() {
    this.visibleComments = this.showAllComments
      ? this.allComments
      : this.allComments.slice(0, this.maxVisible);
  }

  toggleShowAllComments() {
    this.showAllComments = !this.showAllComments;
    this.updateVisibleComments();
  }

  loadAverageRating() {
    this.ratingService.getAveragerating(this.assetId).subscribe({
      next: (avg: number) => {
        this.averageRating = avg;
      },
      error: (err) => {
        console.error('Failed to load average rating', err);
      }
    });
  }

  submitComment() {
    if (!this.commentText.trim()) return;

    const payload = {
      userId: Number(this.userId),
      assetId: this.assetId,
      comment: this.commentText.trim()
    };

    this.commentService.addComment(payload).subscribe({
      next: () => {
        this.commentText = '';
        this.errorMessage = '';
        this.commentAdded.emit(); 
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
}
