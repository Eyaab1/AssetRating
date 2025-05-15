import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import{Notification} from '../models/notification';
import { NotificationType } from '../enums/notification-type';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function getSafeLocalStorage(): Storage | null {
  return typeof window !== 'undefined' ? localStorage : null;
}

@Injectable({
  providedIn: 'root'
})

export class NotificationService implements OnInit{
  
  private baseUrl = `http://localhost:8081/api/notifications`;
  private socketUrl = `http://localhost:8081/ws`;
  private stompClient!: Client;
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    
  }

  private getAuthHeaders(): HttpHeaders {
    const token = getSafeLocalStorage()?.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
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
        n.relatedEntityId,
        n.relatedAssetId,
        n.actor?.id ?? 0 // ✅ Extract actorId safely
      )
    ))
  );
}

  markAsRead(id: String): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/read`, {}, {
      headers: this.getAuthHeaders()
    });
  }

 
  
}
