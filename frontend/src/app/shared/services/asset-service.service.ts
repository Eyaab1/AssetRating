import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Asset } from '../models/asset';
import { Widget } from '../models/widget';
import { AssetRelease } from '../models/asset-release';
@Injectable({
  providedIn: 'root'
})
export class AssetServiceService {

  private baseUrl = 'http://localhost:8081/api/assets';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    
      const token = localStorage.getItem('token');
      if (token) {
        return new HttpHeaders({
          'Authorization': `Bearer ${token}`,
        });
      
    }
    return new HttpHeaders();
  }
  getAllAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getAssetById(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  addAsset(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData, { headers: this.getAuthHeaders() });
  }
  deleteAsset(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  getAssetsByCategory(categoryId: number): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.baseUrl}/categories/${categoryId}/assets`, { headers: this.getAuthHeaders() });
  }
  getReleasesByAsset(assetId: string): Observable<AssetRelease[]> {
    return this.http.get<AssetRelease[]>(`${this.baseUrl}/${assetId}/releases`, { headers: this.getAuthHeaders() });
  }
  uploadAssetReleaseFull(payload: {
    originalAssetId: string;
    version: string;
    documentation: string;
    fileUrl: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/release/full`, payload, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }
  

  uploadDocumentationFile(fileData: FormData): Observable<string> {
    return this.http.post<string>('http://localhost:8081/api/assets/docs/upload', fileData, {
      headers: this.getAuthHeaders()
    });
  }
  uploadReleaseDocumentation(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    return this.http.post('http://localhost:8081/api/assets/releases/docs/upload', formData, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
  
  
  updateAsset(id: string, asset: Asset): Observable<Asset> {
    return this.http.put<Asset>(`${this.baseUrl}/edit/${id}`, asset, {
      headers: this.getAuthHeaders()
    });
  }

  getRecommendedAssets(userId: number): Observable<Asset[]> {
  return this.http.get<Asset[]>(`${this.baseUrl}/recommended?userId=${userId}`, { headers: this.getAuthHeaders() });

}
incrementDownload(assetId: string): Observable<void> {
  return this.http.put<void>(
    `${this.baseUrl}/${assetId}/download`,
    {}, 
    { headers: this.getAuthHeaders() }
  );
}

  
  
  }
  
  

