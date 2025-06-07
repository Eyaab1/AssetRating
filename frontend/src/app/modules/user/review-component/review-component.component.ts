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
import { AssetServiceService } from '../../../shared/services/asset-service.service';
import Swal from 'sweetalert2';
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
  @Input() highlightReviewId: string | null = null;
  @Input() highlightReportId: string | null = null;

  allComments: any[] = [];
  visibleComments: any[] = [];
  showAllComments = false;
  maxVisible = 3;

  commentText: string = '';
  userId: string = '';
  userRole: string = '';
  userEmail: string = '';
  averageRating: number = 0;
  loading = false;
  errorMessage: string = '';
  assetPublisherMail: string = '';

  constructor(
    private commentService: CommentService,
    private ratingService: RatingService,
    private assetService: AssetServiceService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId?.toString() ?? '';
      this.userRole = decoded.role ?? '';
      this.userEmail = decoded.sub || decoded.email || '';
      console.log('[DEBUG] currentUserEmail:', this.userEmail);
    }


    if (this.assetId) {
      this.loadComments();
      this.loadAverageRating();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assetId'] && this.assetId) {
      this.loadComments();
      this.loadAverageRating();
    }
  }

  loadComments() {
    this.loading = true;

    // ✅ Step 1: Fetch asset to get the publisherMail
    this.assetService.getAssetById(this.assetId).subscribe({
      next: (asset) => {
        this.assetPublisherMail = asset.publisherMail;
  console.log('[DEBUG] assetPublisherMail:', this.assetPublisherMail);

        // ✅ Step 2: Fetch comments
        this.commentService.getCommentsByAsset(this.assetId).subscribe({
          next: (data) => {
            const ratingRequests = data.map((c: any) => {
              const isReview = c.comment.startsWith('__REVIEW__ ');
              const cleanedComment = isReview ? c.comment.replace('__REVIEW__ ', '') : c.comment;
              const baseComment = { ...c, comment: cleanedComment };

              return isReview
                ? this.ratingService.getUserRating(Number(c.userId), this.assetId).pipe(
                    map((rating) => ({
                      ...baseComment,
                      userRating: { average: rating.average }
                    })),
                    catchError(() =>
                      of({ ...baseComment, userRating: undefined })
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
                console.error('Error merging ratings/comments', err);
                this.loading = false;
              }
            });
          },
          error: (err) => {
            console.error('Error loading comments', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching asset', err);
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
        if (err.status === 400 && err.error === 'Review contains inappropriate language.') {
          Swal.fire({
            icon: 'warning',
            title: 'Inappropriate Comment',
            text: 'Your comment contains inappropriate language. Please revise it before submitting.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f59e0b'
          });
          this.errorMessage = '';
        } else {
          console.error('Error adding comment', err);
          this.errorMessage = '⚠️ Failed to submit comment.';
        }
      }
    });
  }
}