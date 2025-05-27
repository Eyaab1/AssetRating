import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserServiceService } from '../../../../shared/services/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDTO } from '../../../../shared/models/user-dto.model';
import { Comment } from '../../../../shared/models/comment';
import Swal from 'sweetalert2';
import { CommentService } from '../../../../shared/services/comment.service';
import { Asset } from '../../../../shared/models/asset';
import { AssetServiceService } from '../../../../shared/services/asset-service.service';
import { StatusType } from '../../../../shared/enums/StatusType';
import { RatingService } from '../../../../shared/services/rating.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user!: UserDTO;
  userRole: string = '';

  // Reviews
  reviews: Comment[] = [];
  filteredReviews: Comment[] = [];
  selectedTimeFilter: string = 'all';

  // Assets
  assets: Asset[] = [];
  publishedCount = 0;
  unpublishedCount = 0;

  // Password change
  showPasswordModal = false;
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private router: Router,
    private userService: UserServiceService,
    private commentService: CommentService,
    private assetService: AssetServiceService,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    const email = decoded?.sub;
    this.userRole = decoded?.role;

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserByEmail(email).subscribe({
      next: (data) => {
        this.user = data;

        if (this.userRole === 'USER') {
          this.loadUserReviews(data.id);
        } else {
          this.loadUserAssets(data.email); // 🔁 Use email for publisherMail comparison
        }
      },
      error: () => Swal.fire('Error', 'Failed to load user info', 'error')
    });
  }
  getIcon(img: string): string {
    return img ? `assets/images/${img}` : 'assets/images/default4.jpg';
  }
  loadUserReviews(userId: number): void {
    this.commentService.getReviewsByUser(userId).subscribe({
      next: (comments) => {
        this.reviews = comments;
        this.filterReviewsByTime();
      },
      error: (err) => console.error('❌ Failed to load user reviews:', err)
    });
  }

  loadUserAssets(userEmail: string): void {
    this.assetService.getAllAssets().subscribe({
      next: (data) => {
        this.assets = data.filter(a => a.publisherMail === userEmail);
        this.publishedCount = this.assets.filter(a => a.status === StatusType.Published).length;
        this.unpublishedCount = this.assets.filter(a => a.status === StatusType.Unpublished).length;

        // Fetch stats per asset
        this.assets.forEach(asset => {
          this.ratingService.getAveragerating(asset.id).subscribe(avg => asset.averageRating = avg || 0);
          this.commentService.getCommentsByAsset(asset.id).subscribe(reviews => asset.reviewsCount = reviews.length);
        });
      },
      error: (err) => console.error('❌ Failed to load user assets:', err)
    });
  }

  filterReviewsByTime(): void {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    this.filteredReviews = this.reviews.filter(review => {
      const createdAt = new Date(review.created_at);
      switch (this.selectedTimeFilter) {
        case 'today': return createdAt >= today;
        case 'week': return createdAt >= startOfWeek;
        case 'month': return createdAt >= startOfMonth;
        case 'earlier': return createdAt < startOfMonth;
        default: return true; // 'all'
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  openPasswordModal(): void {
    this.showPasswordModal = true;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  confirmPasswordChange(): void {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      Swal.fire('Error', 'All password fields are required', 'error');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      Swal.fire('Error', 'New passwords do not match', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to change your password.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.updatePassword({
          userId: this.user.id,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }).subscribe({
          next: (res) => {
            Swal.fire('Success', res.message, 'success');
            this.closePasswordModal();
          },
          error: (err) => {
            console.error('❌ Password change failed:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: typeof err.error === 'string' ? err.error : 'Password change failed'
            });
          }
        });
      }
    });
  }
  navigateToAsset(assetId: string): void {
    const baseRoute = this.user.role === 'CONTRIBUTOR' ? '/contributorLayout/detail' : '/detail';
    this.router.navigate([`${baseRoute}/${assetId}`]);
  }

  navigateToReview(assetId: string, reviewId: number): void {
    const baseRoute = '/detail';
    this.router.navigate([`${baseRoute}/${assetId}`], {
      queryParams: { focusReviewId: reviewId }
    });
  }
}