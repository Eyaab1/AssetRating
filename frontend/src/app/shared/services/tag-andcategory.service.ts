import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';

@Injectable({
  providedIn: 'root'
})
export class TagAndcategoryService {
  private apiUrl1 = 'http://localhost:8081/api/tags';
  private apiUrl2 = 'http://localhost:8081/api/categories';
  constructor( private http: HttpClient) { }
  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  
  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.apiUrl1, { headers: this.getAuthHeaders() });
  }
  getAllCategories(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.apiUrl2, { headers: this.getAuthHeaders() });
  }
  createTag(tag: { name: string }): Observable<Tag> {
    
    return this.http.post<Tag>(this.apiUrl1, tag, {  headers: this.getAuthHeaders()  });
  }
  addCategory(category: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl2, category, { headers: this.getAuthHeaders() });
  }
}
