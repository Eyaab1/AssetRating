import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { Asset } from '../../../../shared/models/asset';
import { FormsModule } from '@angular/forms';
import { TagAndcategoryService } from '../../../../shared/services/tag-andcategory.service';
import { DecodedToken } from '../../../../shared/decoded-token';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { RatingService } from '../../../../shared/services/rating.service';
import { catchError, forkJoin, of } from 'rxjs';

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
  assetTypes: string[] = ['widget', 'theme', 'sheet', 'template', 'utility', 'connector'];
  selectedTypes: string[] = [];
  availableAssets: Asset[] = [];
  recommendedAssets: Asset[] = [];
  topRated: Asset[] = [];
  loadingRecommendations = true;
  role: string='';
  groupedAssets: { label: string; assets: Asset[] }[] = [];
  allCategories: { id: number; name: string }[] = [];
  selectedCategoryIds: number[] = [];
  allTags: { id: number; name: string }[] = [];
  selectedTagNames: string[] = [];
  searchQuery: string = '';
  quickViewRating: number | null = null;
breadcrumb: string[] = ['Homepage'];



  constructor(
    private assetService: AssetServiceService,
    private tagCatgService: TagAndcategoryService,
    private authService: AuthService,
    private ratingService: RatingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    console.log("role: "+this.role);
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
onFilterChange(type: 'tags' | 'categories' | 'type', event: Event): void {
  const checkbox = event.target as HTMLInputElement;
  if (type === 'tags') {
    const value: string = checkbox.value;
    if (checkbox.checked) {
      this.selectedTagNames.push(value);
    } else {
      this.selectedTagNames = this.selectedTagNames.filter(tag => tag !== value);
    }
  } else if (type === 'categories') {
    const value: number = +checkbox.value;
    if (checkbox.checked) {
      this.selectedCategoryIds.push(value);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== value);
    }
  } else if (type === 'type') {
    const value: string = checkbox.value;
    if (checkbox.checked) {
      this.selectedTypes.push(value);
    } else {
      this.selectedTypes = this.selectedTypes.filter(t => t !== value);
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

    const matchesType = this.selectedTypes.length === 0 ||
      this.selectedTypes.includes(asset.type?.toLowerCase());
   

    return matchesCategory && matchesTag && matchesType;
  });
 if (this.selectedTypes.length === 1) {
      this.breadcrumb = ['Homepage', this.capitalizeFirst(this.selectedTypes[0])];
    } else if (this.selectedCategoryIds.length === 1) {
      const catName = this.getCategoryNameById(this.selectedCategoryIds[0]);
      this.breadcrumb = ['Homepage', 'Category', catName];
    } else {
      this.breadcrumb = ['Homepage'];
    }
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
        this.topRated = [...this.filteredAssets]
      .sort((a, b) => (b.ratings?.length || 0) - (a.ratings?.length || 0))
      .slice(0, 5);

  }

 updateSections(): void {
  const ratingRequests = this.filteredAssets.map(asset =>
    this.ratingService.getAveragerating(asset.id).pipe(
      catchError(err=>{
        console.error(`Failed to fetch rating for asset ${asset.id}:`, err);
        return of(0); //hedha lel defaut rating ken fama error
      })
    )
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

    this.topRated = trendingSorted;

    this.availableAssets = this.filteredAssets.filter(
      asset => !this.topRated.includes(asset)
    );

    this.recommendedAssets = this.recommendedAssets.filter(asset =>
      this.selectedTypes.length === 0 || this.selectedTypes.includes(asset.type?.toLowerCase())
    );
  });
}

//  if (this.role === 'USER') {
//     this.router.navigate(['/profile']);
//   } else if (this.role === 'CONTRIBUTOR') {
//     this.router.navigate(['/contributorLayout/profile']);
//   } else if (this.role === 'ADMIN') {
//     this.router.navigate(['/admin/profile']);
//   }
goToDetail(assetId: string) {
  if(this.role === 'CONTRIBUTOR') {
  this.router.navigate(['/contributorLayout/detail', assetId])} 
  else if (this.role === 'USER') {
  this.router.navigate(['/detail', assetId]);}
  else if (this.role === 'ADMIN') {
  this.router.navigate(['/admin/detail', assetId]);
  }
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
  onDownloadClicked(assetId: string): void {
  this.assetService.incrementDownload(assetId).subscribe({
    next: () => {
      const asset = this.assets.find(a => a.id === assetId);
      if (asset) {
        asset.downloadCount = (asset.downloadCount || 0) + 1;
      }
    },
    error: err => console.error('Failed to increment download count', err)
  });
}
quickViewAsset: any = null;

openQuickView(asset: any) {
  this.quickViewAsset = asset;
  console.log("aasset ", this.quickViewAsset);
  this.quickViewRating = null; 
  console.log("categories: ", this.quickViewAsset.categories[0].name);
  this.ratingService.getAveragerating(asset.id).subscribe({
   next: (res) => {
  console.log("resultat: ", res);
  console.log('type:', typeof res);
  
  this.quickViewRating = res ?? 0;},
    error: () => this.quickViewRating = null
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

getImage(img:string): string{
    return img ? `http://localhost:8081${img}` : 'assets/images/default4.jpg';
  }

hasActiveFilters(): boolean {
  return this.selectedTypes.length > 0 || this.selectedCategoryIds.length > 0 || this.selectedTagNames.length > 0;
}

getCategoryNameById(id: number): string {
  return this.allCategories.find(cat => cat.id === id)?.name || '';
}

removeFilter(type: 'type' | 'category' | 'tag', value: any): void {
  if (type === 'type') {
    this.selectedTypes = this.selectedTypes.filter(t => t !== value);
  } else if (type === 'category') {
    this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== value);
  } else if (type === 'tag') {
    this.selectedTagNames = this.selectedTagNames.filter(t => t !== value);
  }
  this.applyFilters();
}

clearAllFilters(): void {
  this.selectedTypes = [];
  this.selectedCategoryIds = [];
  this.selectedTagNames = [];
  this.applyFilters();
}

}
