import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private baseUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getCommentsByAsset(assetId: string): Observable<any[]> {
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
}
