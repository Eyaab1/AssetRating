import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReviewService } from '../../../../shared/services/adminServices/admin-review.service';
import { AdminReviewReport } from '../../../../shared/models/admin-review-report.model';
import Swal from 'sweetalert2';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  templateUrl: './report-a.component.html',
  styleUrls: ['./report-a.component.css'],
  imports: [CommonModule],
  animations: [
    trigger('slideExpand', [
      state('collapsed', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden',
        padding: '0 0'
      })),
      state('expanded', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden',
        padding: '1rem 0'
      })),
      transition('collapsed <=> expanded', animate('200ms ease'))
    ])
  ]


})
export class ReportAComponent implements OnInit {
  reports: AdminReviewReport[] = [];
  expandedReviews: Set<number> = new Set();
  reportsPerPage = 10;
  currentPage = 1;
  totalPages = 1;
  paginatedReports: AdminReviewReport[] = [];

  constructor(private reviewService: AdminReviewService) {}

  ngOnInit(): void {
    this.loadReports();
  }

loadReports(): void {
  this.reviewService.getAllReports().subscribe((data) => {
    this.reports = data;
    this.totalPages = Math.ceil(this.reports.length / this.reportsPerPage);
    this.updatePaginatedReports();
  });
}
  
  updatePaginatedReports(): void {
    const start = (this.currentPage - 1) * this.reportsPerPage;
    const end = start + this.reportsPerPage;
    this.paginatedReports = this.reports.slice(start, end);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedReports();
    }
  }

  deleteReview(reviewId: number): void {
    Swal.fire({
      title: 'Delete Review?',
      text: 'This will delete the review and notify the user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewService.deleteReportedReview(reviewId).subscribe({
          next: () => {
            this.reports = this.reports.filter(r => r.reviewId !== reviewId); // ✅ fixed line
            Swal.fire('Deleted!', 'Review has been removed.', 'success');
          },
          error: () => Swal.fire('Error', 'Could not delete the review.', 'error')
        });
      }
    });
  }
  toggleExpanded(reviewId: number): void {
    if (this.expandedReviews.has(reviewId)) {
      this.expandedReviews.delete(reviewId);
    } else {
      this.expandedReviews.add(reviewId);
    }
  }
}
