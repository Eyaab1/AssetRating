import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from '../../../../shared/services/analytics.service';
import { CommonModule } from '@angular/common';
import { SentimentChartComponentComponent } from '../charts/sentiment-chart-component/sentiment-chart-component.component';
import { RatingDistributionForAssetComponent } from '../charts/rating-distribution-for-asset/rating-distribution-for-asset.component';
import { SpamChartComponentComponent } from '../charts/spam-chart-component/spam-chart-component.component';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-asset-analytics',
  standalone: true,
  imports: [CommonModule,FormsModule,NgChartsModule,SentimentChartComponentComponent,RatingDistributionForAssetComponent,SpamChartComponentComponent],
  templateUrl: './asset-analytics.component.html',
  styleUrl: './asset-analytics.component.css'
})
export class AssetAnalyticsComponent implements OnInit {
assetAnalytics: any;

quickStats: { label: string; value: any }[] = [];


constructor(private route: ActivatedRoute, private analyticsService: AnalyticsService) { }
ngOnInit(): void {
  const assetId = this.route.snapshot.paramMap.get('id');
  if (assetId) {
    this.analyticsService.getAssetAnalytics(assetId).subscribe(data => {
      this.assetAnalytics = data;
    });
  }
}
}
