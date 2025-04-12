import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { CommentService } from '../../../../shared/services/comment.service';
import { RatingService } from '../../../../shared/services/rating.service';

interface RatingCategories {
  functionality: number;
  performance: number;
  integration: number;
  documentation: number;
}

interface ReviewSubmission {
  ratings: RatingCategories;
  overallRating: number;
  text: string;
  userName?: string;
  date: string;
}
@Component({
  selector: 'app-review-popup',
  standalone: true,
  imports: [ CommonModule,FormsModule],
  templateUrl: './review-popup.component.html',
  styleUrl: './review-popup.component.css'
})
export class ReviewPopupComponent {

  constructor(
    private commentService: CommentService,
    private ratingService: RatingService,
  ) { }
  @Output() reviewSubmitted = new EventEmitter<{ rating: number, text: string }>();
  isVisible: boolean = false;
  rating: number = 0;
  reviewText: string = '';
  stars = Array(5).fill(0);
  userName = '';

  ratings: RatingCategories = {
    functionality: 0,
    performance: 0,
    integration: 0,
    documentation: 0
  };
  
  isValidReview(): boolean {
    // Check if all categories have been rated
    return Object.values(this.ratings).every(rating => rating > 0) && this.reviewText.trim() !== '';
  }
  open() {
    this.isVisible = true;
    this.rating = 0;
    this.reviewText = '';
    this.resetForm();
  }

  close() {
    this.isVisible = false;
  }

  onOverlayClick(event: MouseEvent) {
    this.close();
  }

  setRating(category: keyof RatingCategories, value: number): void {
    this.ratings[category] = value;
  }

  calculateOverallRating(): number {
    const values = Object.values(this.ratings);
    const sum = values.reduce((total, current) => total + current, 0);
    return values.some(val => val === 0) ? 0 : Math.round((sum / values.length) * 10) / 10;
  }
  submitReview(): void {
    if (!this.isValidReview()) {
      alert('Please rate all categories and provide a review text');
      return;
    }

    const review: ReviewSubmission = {
      ratings: { ...this.ratings },
      overallRating: this.calculateOverallRating(),
      text: this.reviewText,
      date: new Date().toLocaleDateString()
    };

    this.reviewSubmitted.emit({ rating: review.overallRating, text: review.text });
    this.close();
  }

  private resetForm(): void { 
    this.ratings = {
      functionality: 0,
      performance: 0,
      integration: 0,
      documentation: 0
    };
    this.reviewText = '';
    this.userName = '';
  }

}








