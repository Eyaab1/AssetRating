import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TopRatedDTO } from '../models/top-rated-dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getSafeLocalStorage } from '../utils/localstorage';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private baseUrl = 'http://localhost:8081/api/analytics';
  constructor(private http:HttpClient) { }
  

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
  
      
  getTopRatedCategory(): Observable<TopRatedDTO> {
    return this.http.get<TopRatedDTO>(`${this.baseUrl}/top-category`,{headers: this.getAuthHeaders()});
  }
  
  getTopRatedTag(): Observable<TopRatedDTO> {
    return this.http.get<TopRatedDTO>(`${this.baseUrl}/top-tag`,{headers: this.getAuthHeaders()});
  }
  getAllRatedCatg(){
    return this.http.get<any[]>(`${this.baseUrl}/allToRatedCatg`,{headers: this.getAuthHeaders()});
  }
  getAllRatedTags(){
    return this.http.get<any[]>(`${this.baseUrl}/allToRatedTags`,{headers: this.getAuthHeaders()});
  }
  getTopRatedAssets(): Observable<{ name: string; averageRating: number }[]> {
    return this.http.get<{ name: string; averageRating: number }[]>(
      `${this.baseUrl}/top-rated-assets`,
      { headers: this.getAuthHeaders() }
    );
  }
  getAssetStatusDistribution(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/asset-status-distribution`, {
      headers: this.getAuthHeaders()
    });
  }
  
    
}
