import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommentComponent } from '../comment/comment.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { ReviewPopupComponent } from '../review-popup/review-popup.component';
import { Comment } from '../../../../shared/models/comment';
import { Asset } from '../../../../shared/models/asset';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { CommentService } from '../../../../shared/services/comment.service';
import { RatingService } from '../../../../shared/services/rating.service';
import { Rating } from '../../../../shared/models/rating';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../../../shared/decoded-token';
import { ReviewComponentComponent } from '../../review-component/review-component.component';

@Component({
  selector: 'app-detail-asset',
  standalone: true,
  imports: [CommonModule, CommentComponent, CommentFormComponent, ReviewPopupComponent,ReviewComponentComponent],
  templateUrl: './detail-asset.component.html',
  styleUrl: './detail-asset.component.css'
})
export class DetailAssetComponent {
  comments: Comment[] = [];
  ratings: Rating[] = [];
  assetSelected!: Asset | undefined;

  categoryAverages: { [key: string]: number } = {};

  ratingCategories: { label: string, field: string }[] = [
    { label: 'Functionality', field: 'functionality' },
    { label: 'Performance', field: 'performance' },
    { label: 'Integration', field: 'integration' },
    { label: 'Documentation', field: 'documentation' }
  ];

  private userId: string = '123';

  constructor(
    private route: ActivatedRoute,
    private assetService: AssetServiceService,
    private commentService: CommentService,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      this.userId = decoded.userId?.toString() ?? '';
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assetService.getAssetById(id).subscribe({
        next: (data) => {
          this.assetSelected = data;
          if (this.assetSelected) {
            this.loadComments(this.assetSelected.id);
            this.loadRatings(this.assetSelected.id);
            this.ratingService.getAverageRatingPerCategory(this.assetSelected.id).subscribe({
              next: (averages) => {
                this.categoryAverages = averages;
              },
              error: (err) => {
                console.error('Error fetching average ratings by category', err);
              }
            });
          }
        },
        error: (err) => console.error('Error fetching asset', err)
      });
    }
  }

  handleReviewSubmit(review: { review: { rating: number, text: string } }): void {
    if (!this.assetSelected || !this.userId) return;

    const assetId = this.assetSelected.id;

    const backendRatingPayload = {
      userId: Number(this.userId),
      assetId: assetId,
      functionality: 5,
      performance: 4,
      integration: 4,
      documentation: 5
    };

    this.ratingService.addRating(backendRatingPayload).subscribe({
      next: () => {
        console.log('Rating submitted to backend successfully');
        this.loadRatings(assetId);
        this.ratingService.getAverageRatingPerCategory(assetId).subscribe({
          next: (averages) => {
            this.categoryAverages = averages;
          }
        });
      },
      error: (err) => console.error('Error submitting rating', err)
    });

    const commentPayload = {
      userId: Number(this.userId),
      assetId: assetId,
      comment: review.review.text
    };

    this.commentService.addComment(commentPayload).subscribe({
      next: () => {
        console.log('Comment added successfully');
        this.loadComments(assetId);
      },
      error: (err) => console.error('Error adding comment', err)
    });
  }

  loadComments(assetId: string) {
    this.commentService.getCommentsByAsset(assetId).subscribe({
      next: (data) => (this.comments = data),
      error: (err) => console.error('Error fetching comments', err)
    });
  }

  loadRatings(assetId: string) {
    this.ratingService.getRatingsByAsset(assetId).subscribe({
      next: (data) => (this.ratings = data),
      error: (err) => console.error('Error fetching ratings', err)
    });
  }

  createStarDisplay(average: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(average);
    const hasHalfStar = average - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push('full');
    if (hasHalfStar) stars.push('half');
    while (stars.length < 5) stars.push('empty');

    return stars;
  }

  goBack() {
    window.history.back();
  }
}
