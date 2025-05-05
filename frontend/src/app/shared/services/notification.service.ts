import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import{Notification} from '../models/notification';
import { NotificationType } from '../enums/notification-type';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  private baseUrl = 'http://localhost:8081/api/notifications';

  constructor(private http: HttpClient) {}
  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  getNotifications(): Observable<Notification[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(data => data.map(n =>
        new Notification(
          n.id,
          n.content,
          n.read,
          new Date(n.createdAt),
          n.type as NotificationType,
          n.relatedEntityId
        )
      ))
    );
  }
  markAsRead(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/read`, {}, {
      headers: this.getAuthHeaders()
    });
  }
  
}
