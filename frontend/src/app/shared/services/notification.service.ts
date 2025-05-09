import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

export class NotificationService {
  
  private baseUrl = `http://localhost:8081/api/notifications`;
  private socketUrl = `http://localhost:8081/ws`;
  private stompClient!: Client;
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  constructor(private http: HttpClient) {}

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

  // connectToSocket(userId: number): void {
  //   if (typeof window === 'undefined') return; // ✅ SSR-safe
  
  //   this.stompClient = new Client({
  //     brokerURL: this.socketUrl,
  //     webSocketFactory: () => new SockJS(this.socketUrl),
  //     reconnectDelay: 5000,
  //     debug: (str) => console.log('[WebSocket Debug]', str),
  //     onConnect: () => {
  //       console.log('WebSocket connected!');
  //       this.stompClient.subscribe(`/topic/notifications/${userId}`, (message: IMessage) => {
  //         const n = JSON.parse(message.body);
  //         const notification = new Notification(
  //           n.id,
  //           n.content,
  //           n.read,
  //           new Date(n.createdAt),
  //           n.type as NotificationType,
  //           n.relatedEntityId
  //         );
  //         this.notificationSubject.next(notification);
  //       });
  //     }
  //   });
  
  //   this.stompClient.activate();
  // }
  

  // disconnectSocket(): void {
  //   if (this.stompClient?.active) {
  //     this.stompClient.deactivate();
  //   }
  // }
  
}
