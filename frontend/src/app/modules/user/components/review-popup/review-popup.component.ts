import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { CommentService } from '../../../../shared/services/comment.service';
import { RatingService } from '../../../../shared/services/rating.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-review-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-popup.component.html',
  styleUrl: './review-popup.component.css'
})
export class ReviewPopupComponent {
  @Output() reviewSubmitted = new EventEmitter<void>();

  isVisible: boolean = false;
  reviewText: string = '';
  errorMessage: string = '';
  stars = Array(5).fill(0);
  userId: number | null = null;
  assetId: string = '';

  ratings = {
    functionality: 0,
    performance: 0,
    integration: 0,
    documentation: 0
  };

  constructor(
    private commentService: CommentService,
    private ratingService: RatingService
  ) {}

  open(assetId: string | null) {
    if (!assetId) return;

    this.assetId = assetId;
    this.isVisible = true;
    this.resetForm();

    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId ?? null;
    }
  }

  close() {
    this.isVisible = false;
    this.errorMessage = '';
  }

  onOverlayClick(event: MouseEvent) {
    this.close();
  }

  setRating(category: keyof typeof this.ratings, value: number): void {
    this.ratings[category] = value;
  }

  calculateOverallRating(): number {
    const values = Object.values(this.ratings);
    const sum = values.reduce((total, current) => total + current, 0);
    return values.some(val => val === 0) ? 0 : Math.round((sum / values.length) * 10) / 10;
  }

  isValidReview(): boolean {
    return Object.values(this.ratings).every(r => r > 0) && this.reviewText.trim() !== '';
  }

  submitReview(): void {
    this.errorMessage = '';
  
    if (!this.isValidReview()) {
      this.errorMessage = 'Please rate all categories and write a review.';
      return;
    }
  
    if (!this.userId || !this.assetId) {
      this.errorMessage = 'Missing user or asset information.';
      return;
    }
  
    const ratingPayload = {
      userId: this.userId,
      assetId: this.assetId,
      functionality: this.ratings.functionality,
      performance: this.ratings.performance,
      integration: this.ratings.integration,
      documentation: this.ratings.documentation
    };
  
    const commentPayload = {
      userId: this.userId,
      assetId: this.assetId,
      comment: this.reviewText
    };
  
    // ✅ FIRST: check comment for profanity
    this.commentService.addComment(commentPayload).subscribe({
      next: () => {
        // ✅ ONLY if comment passed, submit the rating
        this.ratingService.addRating(ratingPayload).subscribe({
          next: () => {
            this.reviewSubmitted.emit();
            this.close();
          },
          error: (err) => {
            if (err.status === 400 && err.error === 'You have already rated this asset.') {
              this.errorMessage = '⚠️ You have already rated this asset.';
            } else {
              this.errorMessage = 'Failed to submit rating.';
              console.error(err);
            }
          }
        });
      },
      error: (err) => {
        if (err.status === 400 && err.error === 'Review contains inappropriate language.') {
          this.errorMessage = '⚠️ Your review contains inappropriate language.';
        } else {
          this.errorMessage = 'Failed to submit comment.';
          console.error(err);
        }
      }
    });
  }
  

  private resetForm(): void {
    this.ratings = {
      functionality: 0,
      performance: 0,
      integration: 0,
      documentation: 0
    };
    this.reviewText = '';
    this.errorMessage = '';
  }
}
