import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating } from '../models/rating';
@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = 'http://localhost:3002/ratings';
  constructor(private http:HttpClient) { }
  getRatingsByAsset(assetId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?assetId=${assetId}`);
  }

  addRating(rating: Rating ): Observable<any> {
    return this.http.post<any>(this.baseUrl, rating);
  }
}
