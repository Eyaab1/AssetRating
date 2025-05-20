import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AnalyticsService } from '../../../../../shared/services/analytics.service';

@Component({
  selector: 'app-spam-chart-component',
  standalone: true,
  imports: [CommonModule,NgChartsModule],
  templateUrl: './spam-chart-component.component.html',
  styleUrl: './spam-chart-component.component.css'
})
export class SpamChartComponentComponent implements OnChanges {
  @Input() spam: any;

  chartData!: ChartConfiguration<'doughnut'>['data'];
  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  ngOnChanges(): void {
    if (!this.spam) return;
    this.chartData = {
      labels: Object.keys(this.spam),
      datasets: [{
        data: Object.values(this.spam),
  backgroundColor: ['#3B82F6', '#FEC06E'],     
 }]
    };
  }
}
