import { Component, Input, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AnalyticsService } from '../../../../../shared/services/analytics.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-chart',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  templateUrl: './rating-chart.component.html',
  styleUrl: './rating-chart.component.css'
})
export class RatingChartComponent implements OnInit {
  @Input() mode: 'top-rated-assets' | 'assets-by-status' = 'top-rated-assets';
  showAll = false;
  fullData: any[] = [];

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    if (this.mode === 'top-rated-assets') {
      this.analyticsService.getTopRatedAssets().subscribe(data => {
        this.fullData = data;
        this.chartOptions.scales!['y']!['max'] = 5;
        this.updateChart();
      });
    } else if (this.mode === 'assets-by-status') {
      this.analyticsService.getAssetStatusDistribution().subscribe(data => {
        this.fullData = Object.entries(data).map(([status, count]) => ({ status, count }));
        this.chartOptions.scales = { y: { beginAtZero: true } };
        this.updateChart();
      });
    }
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
    this.updateChart();
  }

  updateChart() {
    const displayedData = this.showAll ? this.fullData : this.fullData.slice(0, 5);

    if (this.mode === 'top-rated-assets') {
      this.chartData = {
        labels: displayedData.map(d => d.label),
        datasets: [
          {
            label: 'Average Rating',
            data: displayedData.map(d => d.averageRating),
            backgroundColor: '#4F46E5'
          }
        ]
      };
    } else if (this.mode === 'assets-by-status') {
      this.chartData = {
        labels: displayedData.map(d => d.status),
        datasets: [
          {
            label: 'Asset Count',
            data: displayedData.map(d => d.count),
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
          }
        ]
      };
    }
  }
}
