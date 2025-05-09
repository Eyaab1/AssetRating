import { Component, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Comment } from '../../../../shared/models/comment';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { UserServiceService } from '../../../../shared/services/user-service.service';
import { User } from '../../../../shared/models/user';
import { CommentService } from '../../../../shared/services/comment.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { ReportModelComponent } from '../../../common/components/report-model/report-model.component';
import { RatingService } from '../../../../shared/services/rating.service';
@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule,FormsModule ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  @Input() comment!: Comment & { userRating?: { average: number } };

  userC!: User;
  currentUserId: number | null = null;
  replyUsers: Record<number, User> = {};
  replying = false;
  replyText = '';
  reportReason = '';
  showReplies = false;
  showFullComment = false;
  selectedReviewId!: number;
  liked = false;
  likesCount = 0;
  profanityWarning: string = '';

  private vcr = inject(ViewContainerRef);

  constructor(
    private userService: UserServiceService,
    private commentService: CommentService,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    // Fetch main comment author
    this.userService.getUserById(Number(this.comment.userId)).subscribe({
      next: (user) => {
        if (user) this.userC = user;
      },
      error: (error) => console.error('Error fetching user:', error)
    });
  console.log(this.comment);
    // Fetch each reply user
    this.comment.replies?.forEach(reply => {
      const userId = Number(reply.userId); // safely convert once
      if (!this.replyUsers[userId]) {
        this.userService.getUserById(userId).subscribe({
          next: (user) => {
            if (user) {
              this.replyUsers[userId] = user;
            }
          },
          error: (error) => console.error(`Error fetching user ${userId}`, error)
        });
      }
    });
    
    
  
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.currentUserId = decoded.userId ? Number(decoded.userId) : null;
    }
  
    this.likesCount = this.comment.likes?.length ?? 0;
    this.liked = this.comment.likes?.includes(this.currentUserId!) ?? false;
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
  getReplyUser(userId: number | string): User | undefined {
    const id = Number(userId);
    return this.replyUsers[id];
  }
  
  createStarDisplay(average: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(average);
    const hasHalf = average - fullStars >= 0.5;
  
    for (let i = 0; i < fullStars; i++) stars.push('full');
    if (hasHalf) stars.push('half');
    while (stars.length < 5) stars.push('empty');
  
    return stars;
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
        this.profanityWarning = ''; // clear warning on success
      },
      error: (err) => {
        if (err.status === 400 && err.error === 'Reply contains inappropriate language.') {
          this.profanityWarning = '⚠️ Your reply contains inappropriate language.';
        } else {
          console.error('Error replying to comment', err);
        }
      }
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

  // edit and delete logic 
  editing = false;
editText = '';

startEditing(): void {
  this.editing = true;
  this.editText = this.comment.comment;
}

cancelEdit(): void {
  this.editing = false;
  this.editText = '';
}

submitEdit(): void {
  if (!this.editText.trim()) return;

  this.commentService.updateReview(this.comment.id, this.editText).subscribe({
    next: () => {
      this.comment.comment = this.editText;
      this.editing = false;
    },
    error: err => console.error('Edit failed', err)
  });
}

deleteComment(): void {
  if (confirm('Are you sure you want to delete this comment?')) {
    this.commentService.deleteReview(this.comment.id).subscribe({
      next: () => {
        // Optionally emit an event to parent to reload comments
        alert('Comment deleted');
      },
      error: err => console.error('Delete failed', err)
    });
  }
}

}





