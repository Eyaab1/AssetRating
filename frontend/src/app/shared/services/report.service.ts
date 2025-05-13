import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getSafeLocalStorage } from '../utils/localstorage';
import { Report } from '../models/report';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl = 'http://localhost:8081/api/reviews/reports';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = getSafeLocalStorage()?.getItem('token');
    const headersConfig: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headersConfig);
  }

  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }
  getReportsByCurrentUser(): Observable<Report[]> {
  return this.http.get<Report[]>(this.baseUrl + '/user', {
    headers: this.getAuthHeaders()
  });
}

}
