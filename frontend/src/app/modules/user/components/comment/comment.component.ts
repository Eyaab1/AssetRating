import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Comment } from '../../../../shared/models/comment';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { UserServiceService } from '../../../../shared/services/user-service.service';
import { User } from '../../../../shared/models/user';
import { CommentService } from '../../../../shared/services/comment.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { ReportModelComponent } from '../../../common/components/report-model/report-model.component';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
// <app-review-component [assetId]="assetSelected?.id || ''"></app-review-component>
export class CommentComponent implements OnInit {
  @Input() comment!: Comment;

  userC!: User;
  currentUserId: number | null = null;

  replying = false;
  replyText = '';
  reportReason = '';
  showReplies = false;
  showFullComment = false;
  selectedReviewId!: number;
  liked = false;
  likesCount = 0;

  private vcr = inject(ViewContainerRef);

  constructor(
    private userService: UserServiceService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.userService.getUserById(Number(this.comment.userId)).subscribe({
      next: (user) => {
        if (user) this.userC = user;
      },
      error: (error) => console.error('Error fetching user:', error)
    });

    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.currentUserId = decoded.userId ? Number(decoded.userId) : null;
    }

    this.likesCount = this.comment.likes ? this.comment.likes.length : 0;

    if (this.comment.likes?.includes(this.currentUserId!)) {
      this.liked = true;
    }
  }

  toggleLikeComment(): void {
    if (!this.currentUserId) return;

    if (this.liked) {
      this.commentService.unlikeReview(this.comment.id, this.currentUserId).subscribe({
        next: () => {
          this.liked = false;
          this.likesCount = Math.max(this.likesCount - 1, 0);
        },
        error: (err) => console.error('Error unliking comment', err)
      });
    } else {
      this.commentService.likeReview(this.comment.id, this.currentUserId).subscribe({
        next: () => {
          this.liked = true;
          this.likesCount += 1;
        },
        error: (err) => console.error('Error liking comment', err)
      });
    }
  }

  replyToComment(): void {
    this.replying = true;
  }

  sendReply(): void {
    if (!this.replyText.trim() || !this.currentUserId) return;

    this.commentService.replyToReview(this.comment.id, {
      userId: this.currentUserId,
      comment: this.replyText
    }).subscribe({
      next: () => {
        this.replyText = '';
        this.replying = false;
      },
      error: (err) => console.error('Error replying to comment', err)
    });
  }

  toggleShowFull(): void {
    this.showFullComment = true;
  }

  cancelReply(): void {
    this.replying = false;
    this.replyText = '';
  }

  openReportPopup(): void {
    const modal = this.vcr.createComponent(ReportModelComponent);
    modal.instance.reviewId = this.comment.id;

    modal.instance.submitted.subscribe((reason: string) => {
      this.submitReport(reason);
      modal.destroy();
    });

    modal.instance.cancelled.subscribe(() => {
      modal.destroy();
    });

    document.body.style.overflow = 'hidden';
  }

  submitReport(reason: string): void {
    this.commentService.reportReview(this.comment.id, reason).subscribe({
      next: () => {
        alert('Review reported successfully.');
        document.body.style.overflow = 'auto';
      },
      error: (err) => {
        console.error('Error reporting review', err);
        alert('Failed to report review.');
        document.body.style.overflow = 'auto';
      }
    });
  }

  cancelReport(): void {
    document.body.style.overflow = 'auto';
  }
}





