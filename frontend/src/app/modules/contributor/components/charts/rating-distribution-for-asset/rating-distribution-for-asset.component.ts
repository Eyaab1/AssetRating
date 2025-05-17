import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AnalyticsService } from '../../../../../shared/services/analytics.service';

@Component({
  selector: 'app-rating-distribution-for-asset',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './rating-distribution-for-asset.component.html',
  styleUrl: './rating-distribution-for-asset.component.css'
})
export class RatingDistributionForAssetComponent implements OnChanges {
  @Input() distribution: any;

  chartData!: ChartConfiguration<'bar'>['data'];
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };

  ngOnChanges(): void {
    if (!this.distribution) return;
    const labels = Object.keys(this.distribution).sort();
    const values = labels.map(key => this.distribution[key]);

    this.chartData = {
      labels,
      datasets: [{
        label: 'Ratings Count',
        data: values,
        backgroundColor: '#4F46E5'
      }]
    };
  }
}
