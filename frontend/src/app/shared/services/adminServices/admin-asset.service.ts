import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from '../../models/asset';
import { AssetRelease } from '../../models/asset-release';
import { StatusType } from '../../enums/StatusType';
import { Framework } from '../../enums/framework';
import { ProjectType } from '../../enums/ProjectType';
import { Format } from '../../enums/Format';
@Injectable({
  providedIn: 'root'
})
export class AdminAssetService {
  private baseUrl = 'http://localhost:8081/admin/assets';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  // ✅ Get all assets
  getAllAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  // ✅ Get assets by type
  getAssetsByType(type: string): Observable<Asset[]> {
    return this.http.get<Asset[]>(`${this.baseUrl}/type/${type}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get asset by ID
  getAssetById(id: string): Observable<Asset> {
    return this.http.get<Asset>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Create asset (multipart)
  addAsset(formData: FormData): Observable<Asset> {
    return this.http.post<Asset>(this.baseUrl, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Update asset
  updateAsset(id: string, asset: Asset): Observable<Asset> {
    return this.http.put<Asset>(`${this.baseUrl}/${id}`, asset, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Soft delete asset
  deleteAsset(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Upload full release
  uploadAssetRelease(payload: {
    originalAssetId: string;
    version: string;
    documentation: string;
    fileUrl: string;
  }): Observable<Asset> {
    return this.http.post<Asset>(`${this.baseUrl}/release/full`, payload, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }

  // ✅ Upload release documentation
  uploadReleaseDocumentation(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/releases/docs/upload`, formData, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  // ✅ Get releases by asset ID
  getReleasesByAsset(assetId: string): Observable<AssetRelease[]> {
    return this.http.get<AssetRelease[]>(`${this.baseUrl}/${assetId}/releases`, {
      headers: this.getAuthHeaders()
    });
  }
  filterAssets(filters: {
    type?: string;
    name?: string;
    publisher?: string;
    status?: StatusType;
    framework?: Framework;
    format?: Format;
    projectType?: ProjectType;
  }): Observable<Asset[]> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<Asset[]>(`${this.baseUrl}/filter`, { params,headers: this.getAuthHeaders() });
  }
  getDistinctAssetNames(type: string): Observable<string[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<string[]>(`${this.baseUrl}/distinct/names?type=${type}`, { headers });
  }

  getDistinctPublishers(type: string): Observable<string[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<string[]>(`${this.baseUrl}/distinct/publishers?type=${type}`, { headers });
  }

}
