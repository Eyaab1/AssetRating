import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Widget } from '../../../../shared/models/widget';
import { RouterModule } from '@angular/router';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { Asset } from '../../../../shared/models/asset';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {
  
  assets: Asset[] = [];
  filteredAssets: Asset[] = [];
  topRatedAssets: Asset[] = [];
  availableAssets: Asset[] = [];
  searchQuery: string = '';

  selectedFilters: any = {
    projectType: [],
    framework: [],
    license: []
  };

  projectTypes = ['Frontend', 'Backend'];
  frameworks = ['Angular', 'React', 'Vue', 'Custom'];
  licenses = ['Free', 'Paid'];

  constructor(private assetService: AssetServiceService) {}

  ngOnInit() {
    this.assetService.getAllAssets().subscribe({
      next: (data) => {
        this.assets = data;
        this.filteredAssets = [...this.assets];
        this.updateSections();
      },
      error: (err) => {
        console.error('Failed to fetch assets:', err);
      }
    });
  }

  onFilterChange(filterType: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedFilters[filterType].push(checkbox.value);
    } else {
      this.selectedFilters[filterType] = this.selectedFilters[filterType].filter((f: string) => f !== checkbox.value);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.filteredAssets = this.assets.filter(asset => {
      return (
        (this.selectedFilters.projectType.length === 0 || this.selectedFilters.projectType.includes(asset.projectType)) &&
        // (this.selectedFilters.framework.length === 0 || this.selectedFilters.framework.includes(asset['framework'])) &&
        (this.selectedFilters.license.length === 0 || this.selectedFilters.license.includes(asset.license))
      );
    });
    this.updateSections();
  }

  filterAssets() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredAssets = this.assets.filter(asset =>
      (asset.name?.toLowerCase().includes(query) || asset.description?.toLowerCase().includes(query))
    );
    this.applyFilters(); // apply filters after search
  }

  updateSections() {
    // Top Rated => Assets with highest number of ratings
    this.topRatedAssets = [...this.filteredAssets].sort((a, b) => (b.ratings?.length || 0) - (a.ratings?.length || 0)).slice(0, 5);
    this.availableAssets = [...this.filteredAssets].filter(asset => !this.topRatedAssets.includes(asset));
  }
}
