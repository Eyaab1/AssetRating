import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private baseUrl = 'http://localhost:8081/api/reviews';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCommentsByAsset(assetId: string ): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/asset/${assetId}`, {
      headers: this.getAuthHeaders()
    });
  }

  addComment(commentPayload: {
    userId: number;
    assetId: string;
    comment: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, commentPayload, {
      headers: this.getAuthHeaders()
    });
  }
  likeReview(commentId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${commentId}/like`, null, {
      params: { userId: userId.toString() },
      headers: this.getAuthHeaders()
    });
  }
  unlikeReview(commentId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${commentId}/unlike`, null, {
      params: { userId: userId.toString() },
      headers: this.getAuthHeaders()
    });
  } 
  replyToReview(commentId: number, payload: { userId: number; comment: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${commentId}/reply`, payload,{headers: this.getAuthHeaders()});
  }


  updateReview(commentId: number, newComment: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}/${commentId}`, { comment: newComment ,headers: this.getAuthHeaders()});
  }

  // ➡️ Delete a review
  deleteReview(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${commentId}`,{headers: this.getAuthHeaders()});
  }

  // ➡️ Get review by ID
  getReviewById(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.baseUrl}/${commentId}`,{headers: this.getAuthHeaders()});
  }
getReview(commentId: number): Observable<{ review: Comment, analysis: { sentiment: string, spamLabel: string } }> {
  return this.http.get<{ review: Comment, analysis: { sentiment: string, spamLabel: string } }>(
    `${this.baseUrl}/${commentId}`, 
    { headers: this.getAuthHeaders() }
  );
}

  // ➡️ Get reviews by user
  getReviewsByUser(userId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/user/${userId}`,{headers: this.getAuthHeaders()});
  }

  getLikesCount(commentId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${commentId}/likes/count`, {
      headers: this.getAuthHeaders()
    });
  }
  
  hasUserLiked(commentId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/${commentId}/likes/hasLiked`, {
      params: { userId: userId.toString() },
      headers: this.getAuthHeaders()
    });
  }
  reportReview(commentId: number, reason: string) {
    return this.http.post(
      `${this.baseUrl}/${commentId}/report`,{ reason: reason },{ headers: this.getAuthHeaders() } 
    );
  }
  addReviewForRelease(comment: Comment): Observable<any> {
    return this.http.post(`${this.baseUrl}/reviews/release`, comment);
  }
  
  getReviewsForRelease(releasedAssetId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/reviews/release/${releasedAssetId}`);
  }
  
}
