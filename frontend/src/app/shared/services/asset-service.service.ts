import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Asset } from '../models/asset';
import { Widget } from '../models/widget';
@Injectable({
  providedIn: 'root'
})
export class AssetServiceService {

  private baseUrl = 'http://localhost:8080/api/assets';

  constructor(private http: HttpClient) {}

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
  getAllAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getAssetById(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  addAsset(asset: Asset): Observable<Asset> {
    return this.http.post<Asset>(this.baseUrl, asset, { headers: this.getAuthHeaders() });
  }
  deleteAsset(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  
}
