import { Component, HostListener } from '@angular/core';
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
  paginatedAssets: Asset[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

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

          this.calculateItemsPerPage();
        }
      });
    }
  }

  @HostListener('window:resize')
  calculateItemsPerPage(): void {
    const screenHeight = window.innerHeight;
    const headerHeight = 350;
    const rowHeight = 60;
    this.itemsPerPage = Math.max(1, Math.floor((screenHeight - headerHeight) / rowHeight));
    this.totalPages = Math.ceil(this.filteredAssets().length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedAssets();
  }

  updatePaginatedAssets(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const assets = this.filteredAssets();
    this.paginatedAssets = assets.slice(start, end);
    this.totalPages = Math.ceil(assets.length / this.itemsPerPage);
  }

  filteredAssets(): Asset[] {
    const assets = this.showMyAssetsOnly
      ? this.allAssets.filter(a => a.publisherMail === this.userEmail)
      : this.allAssets;
    return assets;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedAssets();
    }
  }

  goToAddAseet(): void {
    this.router.navigate(['/contributorLayout/addAsset']);
  }
}


