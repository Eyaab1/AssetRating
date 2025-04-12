import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:3001/comments';
  constructor(private http:HttpClient) { }


  getCommentsByAsset(assetId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?assetId=${assetId}`);
  }

  addComment(comment: Comment): Observable<any> {
    return this.http.post<any>(this.baseUrl, comment);
  }
}
