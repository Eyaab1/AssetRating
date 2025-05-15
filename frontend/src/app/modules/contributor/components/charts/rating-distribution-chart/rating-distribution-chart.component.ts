import { Component, SimpleChanges } from '@angular/core';
import {  Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-rating-distribution-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './rating-distribution-chart.component.html',
  styleUrl: './rating-distribution-chart.component.css'
})
export class RatingDistributionChartComponent {
  @Input() distribution: number[] = [];

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['1★', '2★', '3★', '4★', '5★'],
    datasets: [
      {
        label: 'Assets per Rating',
        data: this.distribution,
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderRadius: 6
      }
    ]
  };
  

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', 
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['distribution'] && this.distribution.length > 0) {
      this.chartData.datasets = [
        {
          label: 'Assets per Rating',
          data: this.distribution,
          backgroundColor: 'rgba(79, 70, 229, 0.7)',
          borderRadius: 6
        }
      ];
    }
  }
}
