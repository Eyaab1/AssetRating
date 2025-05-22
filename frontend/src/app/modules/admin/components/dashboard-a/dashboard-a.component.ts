import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAssetService } from '../../../../shared/services/adminServices/admin-asset.service';
import { AdminUserService } from '../../../../shared/services/adminServices/admin-user.service';
import { Asset } from '../../../../shared/models/asset';
import { ChartComponent } from '../chart/chart.component';
import { UserDTO } from '../../../../shared/models/user-dto.model';
import { ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Location } from '@angular/common';
import { RatingDistributionChartComponent } from '../../../contributor/components/charts/rating-distribution-chart/rating-distribution-chart.component';
import { RatingService } from '../../../../shared/services/rating.service';
@Component({
  selector: 'app-dashboard-a',
  standalone: true,
  imports: [CommonModule, NgChartsModule, ChartComponent,RatingDistributionChartComponent],
  templateUrl: './dashboard-a.component.html',
  styleUrl: './dashboard-a.component.css'
})
export class DashboardAComponent implements OnInit {
  // Chart data
  statusChart: any;
  ratingChart: any;
  uploadTrendChart: any;
  activeTab: 'users' | 'assets' = 'users';


  // Raw data
  topRatedAssets: string[] = [];
  mostDownloadedAsset?: Asset;
  topPositiveAssetsChart: any;
  topNegativeAssetsChart: any;
  activeSentimentChart: 'positive' | 'negative' = 'positive';
  totalUsers = 0;
  users = 0;
  contributors = 0;
  admins = 0;
  newUsersThisMonth: UserDTO[] = [];
  mostActiveUsers: any[] = [];
  topContributors: any[] = [];
  topRatedAsset: Asset | null = null;
  allAssets: Asset[] = [];
  lastUploadedAsset?: Asset;
  totalAssets: number = 0;

  mostActiveUsersChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Activity Score',
        data: [],
        backgroundColor: '#6366f1'
      }
    ]
  };

  topContributorsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Uploads',
        data: [],
        backgroundColor: '#10b981'
      }
    ]
  };
  constructor(private assetService: AdminAssetService,
    private adminUserService: AdminUserService,
    private location: Location,
    private ratingService : RatingService
  ) {}

  ngOnInit(): void {
    this.assetService.getTopRatedAssets().subscribe(res => {
      this.topRatedAssets = res.map(a => a.name || a.label);
    });

    this.assetService.getMostDownloadedAsset().subscribe(res => {
      this.mostDownloadedAsset = res;
    });

    this.assetService.getStatusBreakdown().subscribe(res => {
      this.statusChart = {
        type: 'pie',
        data: {
          labels: Object.keys(res),
          datasets: [{ data: Object.values(res) }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } }
        }
      };
    });
  this.assetService.getTopAssetsBySentiment().subscribe(data => {
    this.topPositiveAssetsChart = {
      type: 'bar',
      data: {
        labels: data.topPositive,
        datasets: [{ data: Array(data.topPositive.length).fill(1), 
          label: 'Positive Reviews' ,
          backgroundColor: '#096B68'
}]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    };

    this.topNegativeAssetsChart = {
      type: 'bar',
      data: {
        labels: data.topNegative,
        datasets: [{ 
          data: Array(data.topNegative.length).fill(1),
           label: 'Negative Reviews',
          backgroundColor: '#096B68'

           }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    };
  });
    this.assetService.getUploadTrend().subscribe(res => {
      this.uploadTrendChart = {
        type: 'line',
        data: {
          labels: Object.keys(res),
          datasets: [{ data: Object.values(res), label: 'Uploads' }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } }
        }
      };
    });
    this.adminUserService.getUserSummary().subscribe(res => {
      this.totalUsers = res.total;
      this.users = res.users;
      this.contributors = res.contributors;
      this.admins = res.admins;
    });

    this.adminUserService.getNewUsersThisMonthList().subscribe(res => {
      this.newUsersThisMonth = res;
    });

    this.adminUserService.getMostActiveUsers().subscribe(res => {
    this.mostActiveUsers = res;

    this.mostActiveUsersChartData = {
      labels: res.map(user => `${user.firstName} ${user.lastName}`),
      datasets: [
        {
          label: 'Activity Score',
          data: res.map(user => user.activityScore),
          backgroundColor: '#6366f1'
        }
      ]
    };
  });

    this.adminUserService.getTopContributors().subscribe(res => {
      this.topContributors = res;

      this.topContributorsChartData = {
        labels: res.map(user => `${user.firstName} ${user.lastName}`),
        datasets: [
          {
            label: 'Uploads',
            data: res.map(user => user.activityScore),
            backgroundColor: '#10b981'
          }
        ]
      };
    });
       this.assetService.getAllAssets().subscribe({
        next: (data) => {
          this.allAssets = data;
          this.totalAssets = data.length;
          console.log('All Assets:', this.allAssets);
           this.lastUploadedAsset = [...data].sort((a, b) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
          )[0];
          let maxRating = -1;
          this.allAssets.forEach(asset => {
            this.ratingService.getAveragerating(asset.id).subscribe(avg => {
              asset.averageRating = avg || 0;
      
              if ((asset.averageRating ?? 0) > maxRating) {
                maxRating = asset.averageRating ?? 0;
                this.topRatedAsset = asset;
                console.log('Top Rated Asset:', this.topRatedAsset);
              }
            });
      
          
          });
        }
      });
  }
  goBack(): void {
    this.location.back();
  }

}
