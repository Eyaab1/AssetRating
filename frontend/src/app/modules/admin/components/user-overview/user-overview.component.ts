import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminUserService } from '../../../../shared/services/adminServices/admin-user.service';
import { CommonModule } from '@angular/common';
import { UserDTO } from '../../../../shared/models/user-dto.model';
import { ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from "../chart/chart.component";
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-overview',
  standalone: true,
  imports: [CommonModule, NgChartsModule, ChartComponent],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent implements OnInit {
  totalUsers = 0;
  users = 0;
  contributors = 0;
  admins = 0;
  newUsersThisMonth: UserDTO[] = [];
  mostActiveUsers: any[] = [];
  topContributors: any[] = [];

  // ✅ Chart data properly typed
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

  constructor(
    private route: ActivatedRoute,
    private adminUserService: AdminUserService,
    private location: Location
  ) {}

  ngOnInit(): void {
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

  }

  goBack(): void {
    this.location.back();
  }
}
