import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../../../shared/models/comment';
import { NgIf,NgFor,CommonModule } from '@angular/common';
import { UserServiceService } from '../../../../shared/services/user-service.service';
import { User } from '../../../../shared/models/user';
import { CommentService } from '../../../../shared/services/comment.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
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

  liked = false;          
  likesCount = 0;         
  showReplies = false;    
  showFullComment = false; 
  constructor(
    private userService: UserServiceService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    // Fetch user who made the comment
    this.userService.getUserById(Number(this.comment.userId)).subscribe({
      next: (user) => {
        if (user) {
          this.userC = user;
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      }
    });

    // Decode current logged in user
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.currentUserId = decoded.userId ? Number(decoded.userId) : null;
    }

    // Initialize likes
    this.likesCount = this.comment.likes ? this.comment.likes.length : 0;

    // Check if already liked
    if (this.comment.likes?.includes(this.currentUserId!)) {
      this.liked = true;
    }
  }

  toggleLikeComment(): void {
    if (!this.currentUserId) return;

    if (this.liked) {
      // 👎 Unlike
      this.commentService.unlikeReview(this.comment.id, this.currentUserId).subscribe({
        next: () => {
          this.liked = false;
          this.likesCount = Math.max(this.likesCount - 1, 0);
        },
        error: (err) => console.error('Error unliking comment', err)
      });
    } else {
      // ❤️ Like
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
        console.log('Reply sent to comment:', this.comment.id);
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
   
}





