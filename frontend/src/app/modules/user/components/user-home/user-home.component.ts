import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { Asset } from '../../../../shared/models/asset';
import { FormsModule } from '@angular/forms';
import { TagAndcategoryService } from '../../../../shared/services/tag-andcategory.service';
import { DecodedToken } from '../../../../shared/decoded-token';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { RatingService } from '../../../../shared/services/rating.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit {
  assets: Asset[] = [];
  filteredAssets: Asset[] = [];

  availableAssets: Asset[] = [];
  recommendedAssets: Asset[] = [];
  trendingAssets: Asset[] = [];
loadingRecommendations = true;

  groupedAssets: { label: string; assets: Asset[] }[] = [];

  allCategories: { id: number; name: string }[] = [];
  selectedCategoryIds: number[] = [];

  allTags: { id: number; name: string }[] = [];
  selectedTagNames: string[] = [];

  searchQuery: string = '';

  constructor(
    private assetService: AssetServiceService,
    private tagCatgService: TagAndcategoryService,
    private authService: AuthService,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {

    this.assetService.getAllAssets().subscribe({
      next: (data) => {
        this.assets = data;
        this.filteredAssets = [...data];
        this.groupByType();
        this.updateSections();
      },
      error: (err) => console.error('Failed to fetch assets:', err)
    });

    this.tagCatgService.getAllCategories().subscribe({
      next: (data) => this.allCategories = data,
      error: (err) => console.error('Failed to fetch categories:', err)
    });

    this.tagCatgService.getAllTags().subscribe({
      next: (data) => this.allTags = data,
      error: (err) => console.error('Failed to fetch tags:', err)
    });
    const decoded: DecodedToken | null = this.authService.decodeToken();
    if (decoded) {
      const userId = decoded.userId;
      this.assetService.getRecommendedAssets(userId).subscribe({
        next: (assets) => {
          this.recommendedAssets = assets;
          this.loadingRecommendations = false;
        },
        error: () => this.loadingRecommendations = false
      });
    }

  }
  
  onFilterChange(type: 'tags' | 'categories', event: Event): void {
    const checkbox = event.target as HTMLInputElement;
  
    if (type === 'tags') {
      const value: string = checkbox.value;
      if (checkbox.checked) {
        this.selectedTagNames.push(value);
      } else {
        this.selectedTagNames = this.selectedTagNames.filter(tag => tag !== value);
      }
    } else {
      const value: number = +checkbox.value; 
      if (checkbox.checked) {
        this.selectedCategoryIds.push(value);
      } else {
        this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== value);
      }
    }
  
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredAssets = this.assets.filter(asset => {
      const matchesCategory = this.selectedCategoryIds.length === 0 ||
        asset.categories?.some(c => c.id !== null && this.selectedCategoryIds.includes(c.id));
      
      const matchesTag = this.selectedTagNames.length === 0 ||
        asset.tags?.some(t => this.selectedTagNames.includes(t.name));
      
      return matchesCategory && matchesTag;
    });

    this.groupByType();
    this.updateSections();
  }

  getAssetDetailLink(assetId: string): string {
    const decoded: DecodedToken | null = this.authService.decodeToken();
    const role = decoded?.role || '';
    return role === 'CONTRIBUTOR' 
      ? `/contributorLayout/detail/${assetId}` 
      : `/detail/${assetId}`;
  }
  
  filterAssets(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredAssets = this.assets.filter(asset =>
      (asset.name?.toLowerCase().includes(query) || asset.description?.toLowerCase().includes(query))
    );
    this.groupByType();
    this.updateSections();
        this.trendingAssets = [...this.filteredAssets]
      .sort((a, b) => (b.ratings?.length || 0) - (a.ratings?.length || 0))
      .slice(0, 5);
  }

 updateSections(): void {
  const ratingRequests = this.filteredAssets.map(asset =>
    this.ratingService.getAveragerating(asset.id).pipe()
  );

  forkJoin(ratingRequests).subscribe((averages) => {
    const ratedAssets = this.filteredAssets.map((asset, index) => ({
      asset,
      average: averages[index] || 0
    }));

    const trendingSorted = ratedAssets
      .filter(entry => entry.average > 0)
      .sort((a, b) => b.average - a.average)
      .slice(0, 5)
      .map(entry => entry.asset);

    this.trendingAssets = trendingSorted;

    this.availableAssets = this.filteredAssets.filter(
      asset => !this.trendingAssets.includes(asset)
    );
  });
}


  groupByType(): void {
    const grouped: any = {};
    this.filteredAssets.forEach(asset => {
      const type = asset.type || 'Others';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(asset);
    });

    this.groupedAssets = Object.keys(grouped).map(type => ({
      label: this.capitalizeFirst(type),
      assets: grouped[type]
    }));
  }

  capitalizeFirst(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  getIcon(img: string): string {
    return img ? `assets/images/${img}` : 'assets/images/default3.jpg';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/default3.jpg';
  }
}
