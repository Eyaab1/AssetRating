import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Asset } from '../../../../shared/models/asset';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import{ RatingService } from '../../../../shared/services/rating.service';
import { CommentService } from '../../../../shared/services/comment.service';
import { FormsModule } from '@angular/forms';
import { RatingChartComponent } from '../charts/rating-chart/rating-chart.component';
import { RatingDistributionChartComponent } from '../charts/rating-distribution-chart/rating-distribution-chart.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule,RatingChartComponent,RatingDistributionChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  allAssets: Asset[] = [];
  userEmail = '';
  publishedCount = 0;
  unpublishedCount = 0;
  recentAssets: Asset[] = [];
  topRatedAsset: Asset | null = null;
  mostReviewedAsset: Asset | null = null;
  constructor(private router: Router,private assetService: AssetServiceService,public ratingService: RatingService,public commentService:CommentService) {}
  
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userEmail = decoded.sub;

      this.assetService.getAllAssets().subscribe({
        next: (data) => {
          this.allAssets = data.filter(asset => asset.publisherMail === this.userEmail);
      
          let maxRating = -1;
          let maxReviews = -1;
      
          this.allAssets.forEach(asset => {
            this.ratingService.getAveragerating(asset.id).subscribe(avg => {
              asset.averageRating = avg || 0;
      
              if ((asset.averageRating ?? 0) > maxRating) {
                maxRating = asset.averageRating ?? 0;
                this.topRatedAsset = asset;
              }
            });
      
            this.commentService.getCommentsByAsset(asset.id).subscribe(reviews => {
              asset.reviewsCount = reviews.length;
      
              if (asset.reviewsCount > maxReviews) {
                maxReviews = asset.reviewsCount;
                this.mostReviewedAsset = asset;
              }
            });
          });
        }
      });
      
      
    }
  }
  deleteAsset(id: string) {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.assetService.deleteAsset(id).subscribe({
        next: () => {
          this.allAssets = this.allAssets.filter(a => a.id !== id);
          this.recentAssets = this.recentAssets.filter(a => a.id !== id);
        },
        error: err => console.error('Delete failed:', err)
      });
    }
  }

  editAsset(id: string) {
    console.log('Redirect to edit', id);
  }


showMyAssetsOnly = true;

filteredAssets(): Asset[] {
  if (this.showMyAssetsOnly) {
    return this.allAssets.filter(asset => asset.publisherMail === this.userEmail);
  }
  return this.allAssets;
}

viewAnalytics(assetId: string) {

}
getRatingDistribution(): number[] {
  const distribution = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 stars

  this.allAssets.forEach(asset => {
    const rating = Math.round(asset.averageRating ?? 0); // round to nearest int
    if (rating >= 1 && rating <= 5) {
      distribution[rating - 1]++;
    }
  });

  return distribution;
}

goToFullList(): void {
  this.router.navigate(['/contributorLayout/full-asset-list']);
}



}
