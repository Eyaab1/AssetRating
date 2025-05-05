import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating } from '../models/rating';
@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = 'http://localhost:8081/api/ratings';
  constructor(private http:HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          });
        }
      }
      return new HttpHeaders();
    }
  getRatingsByAsset(assetId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/average/${assetId}`, { headers: this.getAuthHeaders() });
  }

  addRating(ratingPayload: {
    userId: number;
    assetId: string;
    functionality: number;
    performance: number;
    integration: number;
    documentation: number;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/rate`, ratingPayload, {
      headers: this.getAuthHeaders()
    });
  }
  
  getAverageRatingPerCategory(assetId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/averageBycategory/${assetId}`, { headers: this.getAuthHeaders() } );
  }
  getAveragerating(assetId:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/average/${assetId}`, { headers: this.getAuthHeaders() } );
  }
  getUserRating(userId: number, assetId: string) {
    return this.http.get<any>(`${this.baseUrl}/user/${userId}/asset/${assetId}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  updateRating(ratingPayload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, ratingPayload, {
      headers: this.getAuthHeaders()
    });
  }
  
}
