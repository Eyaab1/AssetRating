import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Asset } from '../../../../shared/models/asset';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { RatingService } from '../../../../shared/services/rating.service';
import { CommentService } from '../../../../shared/services/comment.service';
import { StatusType } from '../../../../shared/enums/StatusType';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-full-asset-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './full-asset-list.component.html',
  styleUrl: './full-asset-list.component.css'
})
export class FullAssetListComponent {
  allAssets: Asset[] = [];
  userEmail = '';
  showMyAssetsOnly = true;
  publishedCount = 0;
  unpublishedCount = 0;

  constructor(
    private assetService: AssetServiceService,
    private ratingService: RatingService,
    private commentService: CommentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userEmail = decoded.sub;

      this.assetService.getAllAssets().subscribe({
        next: (data) => {
          this.allAssets = data.filter(a => a.publisherMail === this.userEmail);
          this.publishedCount = this.allAssets.filter(a => a.status === StatusType.Published).length;
          this.unpublishedCount = this.allAssets.filter(a => a.status === StatusType.Unpublished).length;

          this.allAssets.forEach(asset => {
            this.ratingService.getAveragerating(asset.id).subscribe(avg => asset.averageRating = avg || 0);
            this.commentService.getCommentsByAsset(asset.id).subscribe(reviews => asset.reviewsCount = reviews.length);
          });
        }
      });
    }
  }

  filteredAssets(): Asset[] {
    return this.showMyAssetsOnly
      ? this.allAssets.filter(a => a.publisherMail === this.userEmail)
      : this.allAssets;
  }
  goToAddAseet() {
    this.router.navigate(['/contributorLayout/addAsset']);
  }
}
