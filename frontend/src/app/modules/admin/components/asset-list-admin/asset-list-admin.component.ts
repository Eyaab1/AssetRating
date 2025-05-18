import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminAssetService } from '../../../../shared/services/adminServices/admin-asset.service';
import { Asset } from '../../../../shared/models/asset';
import { FormsModule } from '@angular/forms';
import { Format } from '../../../../shared/enums/Format';
import { Framework } from '../../../../shared/enums/framework';
import { ProjectType } from '../../../../shared/enums/ProjectType';
import Swal from 'sweetalert2';
import { AssetType } from '../../../../shared/enums/AssetType';

@Component({
  selector: 'app-asset-list-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './asset-list-admin.component.html',
  styleUrl: './asset-list-admin.component.css'
})
export class AssetListAdminComponent implements OnInit {
  assetType: string = '';
  assets: Asset[] = [];
  paginatedAssets: Asset[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  name: string = '';
  publisher: string = '';
  status: string = '';
  framework: string = '';
  format: string = '';
  projectType: string = '';
  showMoreFilters: boolean = false;
  frameworkList: string[] = [];
  formatList: string[] = [];
  projectTypeList: string[] = [];

  distinctNames: string[] = [];
  distinctPublishers: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private assetService: AdminAssetService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const rawType = params.get('type') || '';
      this.assetType = rawType as AssetType;
      this.frameworkList = Object.keys(Framework);
      this.formatList = Object.keys(Format);
      this.projectTypeList = Object.keys(ProjectType);
      this.calculateItemsPerPage();
      this.loadAssets(this.assetType);
      this.fetchDistinctValues(); 
    });
  }

  fetchDistinctValues(): void {
    this.assetService.getDistinctAssetNames(this.assetType).subscribe(data => this.distinctNames = data || []);
    this.assetService.getDistinctPublishers(this.assetType).subscribe(data => this.distinctPublishers = data || []);
  }


applyFilters(): void {
  const filters: any = {
    type: this.assetType,
    name: this.name.trim() || undefined,
    publisher: this.publisher.trim() || undefined,
    status: this.status || undefined,
  };

  // Type-specific filters
  if (this.assetType === 'Widget' && this.framework) filters.framework = this.framework;
  if (this.assetType === 'Sheet' && this.format) filters.format = this.format;
  if (this.assetType === 'Template' && this.projectType) filters.projectType = this.projectType;

  this.assetService.filterAssets(filters).subscribe(res => {
    this.assets = res || [];
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.assets.length / this.itemsPerPage);
    this.updatePaginatedAssets();
  });
}
resetFilters(): void {
  this.name = '';
  this.publisher = '';
  this.status = '';
  this.framework = '';
  this.format = '';
  this.projectType = '';
  this.showMoreFilters = false;
  this.loadAssets(this.assetType);
}

loadAssets(type: string): void {
    this.assetService.getAssetsByType(type).subscribe({
      next: (res) => {
        this.assets = res.filter(asset => !!asset).map(asset => {
          const { releases, ...rest } = asset;
          return rest;
        });
        this.totalPages = Math.ceil(this.assets.length / this.itemsPerPage);
        this.updatePaginatedAssets();
      },
      error: (err) => {
        console.error('Error fetching assets:', err);
      }
    });
  }

deleteAsset(id: string): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will delete the asset.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then(result => {
    if (result.isConfirmed) {
      this.assetService.deleteAsset(id).subscribe({
        next: () => {
          this.assets = this.assets.filter(asset => asset.id !== id);
          this.totalPages = Math.ceil(this.assets.length / this.itemsPerPage);
          this.updatePaginatedAssets();

          Swal.fire('Deleted!', 'The asset has been marked as deleted.', 'success');
        },
        error: () => {
          Swal.fire('Error', 'Failed to delete the asset.', 'error');
        }
      });
    }
  });
}

  updatePaginatedAssets(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAssets = this.assets.slice(start, end);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedAssets();
    }
  }

  @HostListener('window:resize')
  calculateItemsPerPage(): void {
    const screenHeight = window.innerHeight;
    const headerHeight = 450;
    const rowHeight = 60;
    this.itemsPerPage = Math.max(1, Math.floor((screenHeight - headerHeight) / rowHeight));
    this.totalPages = Math.ceil(this.assets.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedAssets();
  }
}