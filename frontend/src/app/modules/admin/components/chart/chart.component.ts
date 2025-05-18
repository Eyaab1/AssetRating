import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule,NgChartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  @Input() type: ChartType = 'bar'; 
  @Input() data!: ChartConfiguration['data'];
  @Input() options?: ChartConfiguration['options'];
}