import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { Asset } from '../../../../shared/models/asset';
import { FormsModule } from '@angular/forms';
import { TagAndcategoryService } from '../../../../shared/services/tag-andcategory.service';

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
  topRatedAssets: Asset[] = [];
  availableAssets: Asset[] = [];

  groupedAssets: { label: string; assets: Asset[] }[] = [];

  allCategories: { id: number; name: string }[] = [];
  selectedCategoryIds: number[] = [];

  allTags: { id: number; name: string }[] = [];
  selectedTagNames: string[] = [];

  searchQuery: string = '';

  constructor(
    private assetService: AssetServiceService,
    private tagCatgService: TagAndcategoryService
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

  filterAssets(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredAssets = this.assets.filter(asset =>
      (asset.name?.toLowerCase().includes(query) || asset.description?.toLowerCase().includes(query))
    );
    this.groupByType();
    this.updateSections();
  }

  updateSections(): void {
    this.topRatedAssets = [...this.filteredAssets]
      .sort((a, b) => (b.ratings?.length || 0) - (a.ratings?.length || 0))
      .slice(0, 5);

    this.availableAssets = [...this.filteredAssets].filter(
      asset => !this.topRatedAssets.includes(asset)
    );
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
