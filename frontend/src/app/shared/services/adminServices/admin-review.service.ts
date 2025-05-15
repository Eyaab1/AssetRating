import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminReviewReport } from '../../models/admin-review-report.model';
import { getSafeLocalStorage } from '../../utils/localstorage'; // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class AdminReviewService {
  private baseUrl = 'http://localhost:8081/admin/reports';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = getSafeLocalStorage()?.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

getAllReports(): Observable<AdminReviewReport[]> {
  return this.http.get<AdminReviewReport[]>(this.baseUrl, {
    headers: this.getAuthHeaders()
  });
}

  deleteReportedReview(reviewId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/review/${reviewId}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
}
