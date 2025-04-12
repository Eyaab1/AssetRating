import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Asset } from '../models/asset';
import { Widget } from '../models/widget';

@Injectable({
  providedIn: 'root'
})
export class AssetServiceService {

  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }
  getAllAssets(): Observable<any[]> {
    const endpoints = ['widgets', 'utilities', 'sheets', 'themes', 'templates'];

    const requests = endpoints.map(endpoint =>
      this.http.get<any[]>(`${this.baseUrl}/${endpoint}`).pipe(
        map(items => items.map(item => ({ ...item, assetType: endpoint.slice(0, -1) }))) 
      )
    );

    return forkJoin(requests).pipe(
      map((results: any[][]) => results.flat()) 
    );
  }
  getAssetById(id: string): Observable<any> {
    const endpoints = ['widgets', 'utilities', 'sheets', 'themes', 'templates'];
    const requests = endpoints.map(endpoint => 
      this.http.get<any[]>(`${this.baseUrl}/${endpoint}`).pipe(
        map(items => {
          const found = items.find(item => item.id === id);
          return found ? { ...found, assetType: endpoint.slice(0, -1) } : null;
        })
      )
    );
    return forkJoin(requests).pipe(
      map((results: any[]) => {
        const foundAsset = results.filter(item => item !== null)[0];
        if (!foundAsset) {
          throw new Error(`Asset with id ${id} not found`);
        }
        return foundAsset;
      })
    );
  }
  getAssetByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?name=${name}`);
  }
  private getEndpointByType(type: string): string {
    switch (type) {
      case 'Widget': return 'widgets';
      case 'Utility': return 'utilities';
      case 'Sheet': return 'sheets';
      case 'Theme': return 'themes';
      case 'Template': return 'templates';
      default: return 'assets';
    }
  }
  addAsset(asset: Asset): Observable<Asset> {
    const endpoint = this.getEndpointByType(asset.assetType);
    return this.http.post<Asset>(`${this.baseUrl}/${endpoint}`, asset);

  }
  
}
