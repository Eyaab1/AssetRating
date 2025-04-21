import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Asset } from '../../../../shared/models/asset';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  allAssets: Asset[] = [];
  userEmail = '';
  publishedCount = 0;
  unpublishedCount = 0;
  recentAssets: Asset[] = [];

  constructor(private assetService: AssetServiceService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userEmail = decoded.sub;

      this.assetService.getAllAssets().subscribe({
        next: (data) => {
          this.allAssets = data.filter(asset => asset.publisherMail === this.userEmail);
          this.publishedCount = this.allAssets.filter(a => a.status === 'published').length;
          this.unpublishedCount = this.allAssets.filter(a => a.status === 'unpublished').length;
          this.recentAssets = this.allAssets.slice(0, 5);
        },
        error: (err) => {
          console.error('Error loading contributor assets:', err);
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
    // You can implement routing logic here
    console.log('Redirect to edit', id);
  }
}
