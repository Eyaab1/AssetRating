import { Component } from '@angular/core';
import { TopRatedDTO } from '../../../../../shared/models/top-rated-dto';
import { AnalyticsService } from '../../../../../shared/services/analytics.service';
import { jwtDecode } from 'jwt-decode';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-most-downloads',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  templateUrl: './most-downloads.component.html',
  styleUrl: './most-downloads.component.css'
})
export class MostDownloadsComponent {
  userEmail = '';
  chartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.label}: ${ctx.formattedValue} downloads`
        }
      }
    }
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userEmail = decoded.sub;

      this.analyticsService.getTopDownloadedAssets(this.userEmail).subscribe(data => {
        console.log('Top downloaded assets:', data);
        this.chartData = {
  labels: data.map(d => d.label),
  datasets: [
    {
      label: 'Downloads',
      data: data.map(d => d.averageRating), 
      backgroundColor: [
        '#4F46E5',
        '#6366F1',
        '#818CF8',
        '#A5B4FC',
        '#C7D2FE'
      ]
    }
  ]
};

      });
    }
  }
}
