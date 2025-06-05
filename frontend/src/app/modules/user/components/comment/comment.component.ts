import { Component, inject, Input, OnInit, SimpleChanges, ViewContainerRef,  ElementRef, Renderer2 } from '@angular/core';
import { Comment } from '../../../../shared/models/comment';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { UserServiceService } from '../../../../shared/services/user-service.service';
import { User } from '../../../../shared/models/user';
import { CommentService } from '../../../../shared/services/comment.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { ReportModelComponent } from '../../../common/components/report-model/report-model.component';
import { RatingService } from '../../../../shared/services/rating.service';
import Swal from 'sweetalert2';

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
@Input() highlightReviewId: string | null = null;
@Input() highlightReportId: string | null = null;
highlightActive = false;
sentiment: string | null = null;
spamLabel: string | null = null;
userRole: string | null = null;
replyAnalyses: Record<number, { sentiment: string; spamLabel: string }> = {};

  private vcr = inject(ViewContainerRef);

  constructor(
    private userService: UserServiceService,
    private commentService: CommentService,
    private ratingService: RatingService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

ngOnChanges(changes: SimpleChanges): void {
  const commentId = this.comment?.id?.toString();
  const isReviewMatch = this.highlightReviewId === commentId;
  const isReportMatch = this.highlightReportId === commentId;

  const shouldHighlight =
    (changes['highlightReviewId'] && isReviewMatch) ||
    (changes['highlightReportId'] && isReportMatch);

  if (shouldHighlight && commentId) {
    setTimeout(() => {
      const container = this.el.nativeElement.querySelector('.comment-container');
      if (container) {
        const className = isReviewMatch ? 'highlight-review' : 'highlight-report';

        // ⚠️ Remove first in case it's already present (for retriggers)
        this.renderer.removeClass(container, className);
        void container.offsetWidth; // force reflow

        this.renderer.addClass(container, className);

        // ✅ Remove highlight after 2.5s
        setTimeout(() => {
          this.renderer.removeClass(container, className);
        }, 2500);
      }
    }, 100); // wait to ensure DOM is rendered
  }
}
ngOnInit(): void {
  // 1. Decode token
  const token = localStorage.getItem('token');
  if (token) {
    const decoded: any = jwtDecode(token);
    this.currentUserId = decoded.userId ? Number(decoded.userId) : null;
    this.userRole = decoded.role || null;
  }

  // 2. Fetch comment author
  this.userService.getUserById(Number(this.comment.userId)).subscribe({
    next: (user) => { if (user) this.userC = user; },
    error: (error) => console.error('Error fetching user:', error)
  });

  // 3. Fetch replies' users
this.comment.replies?.forEach(reply => {
  const userId = Number(reply.userId);

  // Fetch reply's author
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

  // Fetch reply's sentiment/spam analysis
  this.commentService.getReview(reply.id).subscribe({
    next: (res) => {
      this.replyAnalyses[reply.id] = {
        sentiment: res.analysis.sentiment,
        spamLabel: res.analysis.spamLabel
      };
    },
    error: (err) => console.error(`Error analyzing reply ${reply.id}`, err)
  });
});

  // 4. Set like data
  this.likesCount = this.comment.likes?.length ?? 0;
  this.liked = this.comment.likes?.includes(this.currentUserId!) ?? false;

  // 5. Fetch sentiment analysis
  this.commentService.getReview(this.comment.id).subscribe({
    next: (res) => {
      console.log('[Analysis]', res.analysis);
      this.sentiment = res.analysis.sentiment;
      this.spamLabel = res.analysis.spamLabel;  // ✅ add this

    },
    error: (err) => {
      console.error('Error loading sentiment/spam analysis', err);
    }
  });
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
  Swal.fire({
    title: 'Report Comment',
    input: 'text',
    inputLabel: 'Reason for reporting',
    inputPlaceholder: 'Enter your reason...',
    inputAttributes: {
      maxlength: '100'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit Report',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    preConfirm: (value) => {
      if (!value.trim()) {
        Swal.showValidationMessage('Reason is required');
        return false;
      }
      return value;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.submitReport(result.value);
    }
  });
}


  submitReport(reason: string): void {
  this.commentService.reportReview(this.comment.id, reason).subscribe({
    next: () => {
      Swal.fire({
        title: 'Reported!',
        text: 'Your report has been submitted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    },
    error: (err) => {
      console.error('Error reporting review', err);
      Swal.fire('Error', 'Failed to report the comment.', 'error');
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

      Swal.fire({
        title: 'Comment Updated',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    },
    error: err => {
      console.error('Edit failed', err);
      Swal.fire('Error', 'Failed to update comment.', 'error');
    }
  });
}


deleteComment(): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete this comment.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.commentService.deleteReview(this.comment.id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Deleted!',
            text: 'The comment has been deleted.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          // Optionally emit event or remove from list
        },
        error: err => {
          console.error('Delete failed', err);
          Swal.fire('Error', 'Something went wrong while deleting.', 'error');
        }
      });
    }
  });
}


}