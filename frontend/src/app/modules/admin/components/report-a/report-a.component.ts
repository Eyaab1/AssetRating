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

  constructor(private reviewService: AdminReviewService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reviewService.getAllReports().subscribe({
      next: (res) => this.reports = res,
      error: () => Swal.fire('Error', 'Could not fetch reports.', 'error')
    });
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
