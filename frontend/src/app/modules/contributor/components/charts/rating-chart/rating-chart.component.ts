import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AnalyticsService } from '../../../../../shared/services/analytics.service';

@Component({
  selector: 'app-rating-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './rating-chart.component.html',
  styleUrl: './rating-chart.component.css'
})
export class RatingChartComponent implements OnInit {
  @Input() mode: 'category' | 'tag' = 'category';
  // @ViewChild(BaseChartDirective) chartRef?: BaseChartDirective;
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
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

constructor(private analyticsService: AnalyticsService) {}
toggleShowAll() {
  this.showAll = !this.showAll;
  this.updateChart();
}

  ngOnInit(): void {
    if (this.mode === 'category') {
      this.analyticsService.getAllRatedCatg().subscribe(data => {
        this.fullData = data;
        this.updateChart();
      });
    } else {
      this.analyticsService.getAllRatedTags().subscribe(data => {
        this.fullData = data;
        this.updateChart();
      });
    }
  }
  
  updateChart() {
    const displayedData = this.showAll ? this.fullData : this.fullData.slice(0, 3);
  
    this.chartData = {
      labels: displayedData.map(d => d.category),
      datasets: [
        {
          label: this.mode === 'category' ? 'Avg Score by Category' : 'Avg Score by Tag',
          data: displayedData.map(d => Number(d.averageRating)),
          backgroundColor: this.mode === 'category' ? '#42A5F5' : '#66BB6A'
        }
      ]
    };
    }
  }

  
  



