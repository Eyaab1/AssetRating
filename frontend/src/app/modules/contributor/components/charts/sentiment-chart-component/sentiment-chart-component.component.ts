import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AnalyticsService } from '../../../../../shared/services/analytics.service';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-sentiment-chart-component',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './sentiment-chart-component.component.html',
  styleUrl: './sentiment-chart-component.component.css'
})
export class SentimentChartComponentComponent implements OnChanges {
@Input() sentiments: any;

  chartData!: ChartConfiguration<'doughnut'>['data'];
  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  ngOnChanges(): void {
    if (!this.sentiments) return;
    this.chartData = {
      labels: Object.keys(this.sentiments),
      datasets: [{
        data: Object.values(this.sentiments),
        backgroundColor: ['#6EE7B7', '#FCA5A5']
      }]
    };
  }
}
