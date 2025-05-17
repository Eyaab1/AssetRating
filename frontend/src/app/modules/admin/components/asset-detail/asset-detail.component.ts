import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Asset } from '../../../../shared/models/asset';
@Component({
  selector: 'app-asset-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-detail.component.html',
  styleUrl: './asset-detail.component.css'
})
export class AssetDetailComponent implements OnInit {
  asset: Asset | null = null;
  activeTab: string = 'releases';
  tags: string[] = [];
  categories: string[] = [];

  constructor(private route: ActivatedRoute, private assetService: AssetServiceService,  private location: Location) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.assetService.getAssetById(id).subscribe(data => {
      this.asset = data;
      this.tags = data.tags?.map(t => t.name) || [];
      this.categories = data.categories?.map(c => c.name) || [];
    });


  }
get additionalTab(): string | null {
  if (!this.asset) return null;
  switch (this.asset.type) {
    case 'Widget': return 'Framework';
    case 'Sheet': return 'Format';
    case 'Template': return 'Project Type';
    default: return null;
  }
}

get additionalValue(): string | null {
  if (!this.asset) return null;
  switch (this.asset.type) {
    case 'Widget': return (this.asset as any).framework;
    case 'Sheet': return (this.asset as any).format;
    case 'Template': return (this.asset as any).projectType;
    default: return null;
  }
}
goBack(): void {
  this.location.back();
}
}
