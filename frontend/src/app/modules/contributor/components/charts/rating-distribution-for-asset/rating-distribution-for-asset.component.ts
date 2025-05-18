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
@Input() ratingCommentTrend: any;

  chartData!: ChartConfiguration<'line'>['data'];
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#555',
          font: {
            size: 13,
            weight: 500
          }
        }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#444',
        borderColor: '#eee',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: { color: '#999' },
        grid: { color: '#f3f4f6' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#999' },
        grid: { color: '#f3f4f6' }
      }
    }
  };

  ngOnChanges(): void {
    if (!this.ratingCommentTrend) return;
    const labels = Object.keys(this.ratingCommentTrend);
    const ratingData = labels.map(l => this.ratingCommentTrend[l]?.rating ?? 0);
    const commentData = labels.map(l => this.ratingCommentTrend[l]?.comment ?? 0);
    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Ratings',
          data: ratingData,
          borderColor: '#FB7185',  // soft red
          backgroundColor: 'rgba(251, 113, 133, 0.2)',
          tension: 0.4,
          fill: true,
          pointRadius: 4
        },
        {
          label: 'Comments',
          data: commentData,
          borderColor: '#6366F1',  // soft blue
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          tension: 0.4,
          fill: true,
          pointRadius: 4
        }
      ]
    };
  }
}
