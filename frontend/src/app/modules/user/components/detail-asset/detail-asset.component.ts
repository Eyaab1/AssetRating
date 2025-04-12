import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Widget } from '../../../../shared/models/widget';
import { ActivatedRoute } from '@angular/router';
import { CommentComponent } from "../comment/comment.component";
import { CommentFormComponent } from "../comment-form/comment-form.component";
import{ Comment } from '../../../../shared/models/comment';
import { ReviewPopupComponent } from "../review-popup/review-popup.component";
import { Asset } from '../../../../shared/models/asset';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { CommentService } from '../../../../shared/services/comment.service';
import { RatingService } from '../../../../shared/services/rating.service';
import { Rating } from '../../../../shared/models/rating';

@Component({
  selector: 'app-detail-asset',
  standalone: true,
  imports: [CommonModule, CommentComponent, CommentFormComponent, ReviewPopupComponent],
  templateUrl: './detail-asset.component.html',
  styleUrl: './detail-asset.component.css'
})
export class DetailAssetComponent {
  comments: Comment[] = [];
  ratings: Rating[] = [];
  assetSelected!: Asset | undefined;
  ratingCategories: { label: string, field: 'functionality' | 'performance' | 'easeOfIntegration' | 'documentationQuality' }[] = [
    { label: 'Functionality', field: 'functionality' },
    { label: 'Performance', field: 'performance' },
    { label: 'Integration', field: 'easeOfIntegration' },
    { label: 'Documentation', field: 'documentationQuality' }
  ];
  
  
  userId: string = '123'; 
  constructor
  (
    private route: ActivatedRoute,
    private assetService: AssetServiceService,
    private commentService:CommentService,
    private ratingService :RatingService
  ) {}
  
  // l init
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assetService.getAssetById(id).subscribe({
        
        next: (data) => {
          this.assetSelected = data;
          if(this.assetSelected){
          console.log('Fetched Asset:', this.assetSelected);
          this.loadComments(this.assetSelected.id); 
          this.loadRatings(this.assetSelected.id)
        }else{
          console.error('No asset found with the provided ID');
        }
        },
        error: (err) => {
          console.error('Error fetching asset', err);
        }
      });
    } else {
      console.error('No ID provided in route parameters');
    }
  }
    //fetching the comment and rating logic 9bal the integration!!!!
  loadComments(assetId: string) {
    if(this.assetSelected) {
    this.commentService.getCommentsByAsset(this.assetSelected.id).subscribe(
      {
        next:(data) =>{
          this.comments = data;
          console.log('Fetched Comments:', this.comments);
        },
        error:(err)=>{
          console.error('Error fetching comments', err);
        }
      }
    )
    } else {
      console.error('No asset selected to fetch comments for');
    }
  }
  
  loadRatings(assetId: string) {
    if(this.assetSelected){
    this.ratingService.getRatingsByAsset(this.assetSelected.id).subscribe(
      {
        next:(data)=>{
          this.ratings=data;
          console.log('rating fetched: ',this.ratings)
        },
        error:(err)=>{
          console.error('Error fetching ratings', err);
        }
      }
    )}else{
      console.error('No asset selected to fetch ratings for');
    }

  }
  createStarDisplay(average: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(average);
    const hasHalfStar = average - fullStars >= 0.5;
  
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    if (hasHalfStar) {
      stars.push('half');
    }
    while (stars.length < 5) {
      stars.push('empty');
    }
    return stars;
  }
  
  
  handleReviewSubmit(review: { review:{rating: number, text: string} }) :void{
    if (!this.assetSelected) 
      {
        console.log("no asset found");
        return
      };
      const assetId = this.assetSelected.id;
      const timestamp= new Date();
      const newRating= new Rating(
        this.generateId(),
        5,
        4,
        4,
        5,
        timestamp,
        this.userId,
      );
      this.ratingService.addRating(newRating).subscribe(
        {
          next:()=>{
            console.log("rating added successfully")
            this.loadRatings(assetId);
          },
          error:(err)=>{
            console.error("error adding rating",err)
          }
        }
      );
      const newComment = new Comment(
        this.generateId(),
        timestamp,
        review.review.text,
        this.userId
      );
      this.commentService.addComment(newComment).subscribe(
        {
          next:()=>{
            console.log("comment added successfully")
            this.loadComments(assetId);
          },
          error:(err)=>{
            console.error("error adding comment",err)
          }
        }
      );
  }
  generateId(): string {
    return Math.random().toString(36).substring(2, 15); }

calculateAverageForCategory(category: 'functionality' | 'performance' | 'easeOfIntegration' | 'documentationQuality'): number {
  if (this.ratings.length === 0) return 0;
  let sum = 0;
  for (const rating of this.ratings) {
    sum += rating[category];
  }
  const average = sum / this.ratings.length;
  return Math.round(average * 10) / 10; 
}
createStarArray(average: number): number[] {
  const rounded = Math.round(average); // Round average to nearest whole number
  return Array(rounded).fill(0);
}
  goBack(){
    window.history.back();
  }
}
