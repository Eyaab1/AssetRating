import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from '../../../../shared/services/analytics.service';
import { CommonModule } from '@angular/common';
import { SentimentChartComponentComponent } from '../charts/sentiment-chart-component/sentiment-chart-component.component';
import { RatingDistributionForAssetComponent } from '../charts/rating-distribution-for-asset/rating-distribution-for-asset.component';
import { SpamChartComponentComponent } from '../charts/spam-chart-component/spam-chart-component.component';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { RatingLevelComponent } from '../charts/rating-level/rating-level.component';
import { TopKeywordsComponent } from '../charts/top-keywords/top-keywords.component';
import { ContributorChatBotComponent } from '../contributor-chat-bot/contributor-chat-bot.component';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { Asset } from '../../../../shared/models/asset';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-asset-analytics',
  standalone: true,
  imports: [CommonModule,FormsModule,NgChartsModule,SentimentChartComponentComponent,RatingDistributionForAssetComponent,SpamChartComponentComponent,RatingLevelComponent,TopKeywordsComponent,ContributorChatBotComponent],
  templateUrl: './asset-analytics.component.html',
  styleUrl: './asset-analytics.component.css'
})
export class AssetAnalyticsComponent implements OnInit {
assetAnalytics: any;

quickStats: { label: string; value: any }[] = [];
topKeywords: { [key: string]: number } = {};
ratingDistributionLabels: string[] = ['1★', '2★', '3★', '4★', '5★'];
ratingDistributionData: number[] = [0, 0, 0, 0, 0];
topKeywordsArray: any;
assetId: string = ''; 
constructor(private route: ActivatedRoute, private analyticsService: AnalyticsService, private assetService: AssetServiceService,private cdr: ChangeDetectorRef) { }
selectedAsset:Asset | null = null;



ngOnInit(): void {
this.assetId = this.route.snapshot.paramMap.get('id') || '';
  if (this.assetId) {
    this.assetService.getAssetById(this.assetId).subscribe(asset => {
      console.log('Selected Asset:', asset);
      this.selectedAsset = asset;
    });
    this.analyticsService.getAssetAnalytics(this.assetId).subscribe(data => {
      this.assetAnalytics = data;
    });
    this.analyticsService.getRatingDistribution(this.assetId).subscribe((data) => {
  
    this.ratingDistributionData = [0, 0, 0, 0, 0];

    for (let i = 1; i <= 5; i++) {
      this.ratingDistributionData[i - 1] = data[i] || 0;
  }
    });
    this.analyticsService.getTopKeywords(this.assetId).subscribe(data => {
    this.topKeywords = data;
});


  }
  
}
  isChatbotModalOpen = false;

toggleChatbotModal() {
  this.isChatbotModalOpen = !this.isChatbotModalOpen;
}


}
