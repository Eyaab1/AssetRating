import { CommonModule } from '@angular/common';
import { Component, Input,OnChanges  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-rating-level',
  standalone: true,
  imports: [FormsModule,CommonModule,NgChartsModule],
  templateUrl: './rating-level.component.html',
  styleUrl: './rating-level.component.css'
})
export class RatingLevelComponent implements OnChanges {
  @Input() ratingDistributionLabels: string[] = [];
  @Input() ratingDistributionData: number[] = [];

  public barChartOptions: ChartOptions<'bar'> = { 
    responsive: true,
    plugins: { legend: { display: false } }
  };

  public barChartLabels: string[] = [];
  public barChartData: ChartDataset<'bar'>[] = [];

  public barChartDataObject: { labels: string[], datasets: ChartDataset<'bar'>[] } = {
    labels: [],
    datasets: []
  };

  ngOnChanges(): void {
    if (!this.ratingDistributionLabels?.length || !this.ratingDistributionData?.length) return;

    this.barChartLabels = this.ratingDistributionLabels;
    this.barChartData = [
      {
        data: this.ratingDistributionData,
        label: 'Ratings Count',
        backgroundColor: '#4e79a7'
      }
    ];

    this.barChartDataObject = {
      labels: this.barChartLabels,
      datasets: this.barChartData
    };
  }

}
