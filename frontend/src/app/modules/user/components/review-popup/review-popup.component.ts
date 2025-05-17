import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
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

  isVisible = false;
  commentText = '';
  errorMessage = '';
  addComment = false;
  hasPreviousRating = false;
  isEditing = false;

  @Input() versionLabel: string = '';

  stars = Array(5).fill(0);
  userId: number | null = null;
  assetId = '';

  ratings = {
    functionality: 0,
    performance: 0,
    integration: 0,
    documentation: 0
  };

  constructor(
    private commentService: CommentService,
    private ratingService: RatingService,
    private cd: ChangeDetectorRef

  ) {}

  open(assetId: string | null, versionLabel: string = '') {
  console.log('opened ');
  if (!assetId) return;
  this.assetId = assetId;
  this.versionLabel = versionLabel;
  this.isVisible = true;
  this.resetForm();
  this.cd.detectChanges();
  document.body.style.overflow = 'hidden';

    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.userId ?? null;
    }

    if (this.userId !== null) {
      this.ratingService.getUserRating(this.userId, this.assetId).subscribe({
        next: (rating) => {
          if (rating) {
            this.hasPreviousRating = true;
            this.isEditing = false; // require clicking "Edit"
            this.ratings = {
              functionality: rating.functionality,
              performance: rating.performance,
              integration: rating.integration,
              documentation: rating.documentation
            };
          } else {
            this.isEditing = true; 
          }
        },
        error: () => {
          this.hasPreviousRating = false;
          this.isEditing = true;
        }
      });
    }
    
  }

  close() {
    this.isVisible = false;
    this.errorMessage = '';
    document.body.style.overflow = ''; // ✅ restore scroll

  }

  onOverlayClick(event: MouseEvent) {
    this.close();
  }
  setRating(category: keyof typeof this.ratings, value: number): void {
    if (!this.isEditing) return;
    this.ratings[category] = value;
  }
  

  calculateOverallRating(): number {
    const values = Object.values(this.ratings);
    const sum = values.reduce((total, current) => total + current, 0);
    return values.some(val => val === 0) ? 0 : Math.round((sum / values.length) * 10) / 10;
  }

  isValidReview(): boolean {
    return Object.values(this.ratings).every(r => r > 0);
  }

  submitReview(): void {
    this.errorMessage = '';

    if (!this.isValidReview()) {
      this.errorMessage = 'Please rate all categories.';
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
      comment: '__REVIEW__ ' + this.commentText.trim()
    };

    const handleSuccess = () => {
      this.reviewSubmitted.emit();
      this.isEditing = false;
      this.close();
    };
    

    const request$ = this.hasPreviousRating
      ? this.ratingService.updateRating(ratingPayload)
      : this.ratingService.addRating(ratingPayload);

    request$.subscribe({
      next: () => {
        if (this.addComment && this.commentText.trim()) {
          this.commentService.addComment(commentPayload).subscribe({
            next: handleSuccess,
            error: (err) => {
              console.error('Comment error:', err);
              this.errorMessage = '⚠️ ' + (err.error?.error || err.message || 'Failed to submit comment.');
            }
          });
        } else {
          handleSuccess();
        }
      },
      error: (err) => {
        console.error('Rating error:', err);
        this.errorMessage = '⚠️ ' + (err.error?.error || err.message || 'Failed to submit rating.');
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
    this.commentText = '';
    this.errorMessage = '';
    this.addComment = false;
    this.hasPreviousRating = false;
    this.isEditing = false;

  }
}
