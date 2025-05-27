import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { UserDTO } from '../models/user-dto.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { getSafeLocalStorage } from '../utils/localstorage';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl ='http://localhost:8081/auth/user'; 
  private currentUser:User|null = null;
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
  getUser(id: string): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(map(data => new User(data.idUser, data.firstName, data.lastName, data.role)));
  }

 
  // login(username: string, password: string): Observable<User> {
  //   return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
  //     .pipe(
  //       map(data => new User(data)),
  //       tap(user => this.currentUser = user)
  //     );
  // }

getCurrentUser(): Observable<User | null> {
    if (this.currentUser) {
      return of(this.currentUser);
    }
    return of(null);
  }
getUserById(userId: number): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/${userId}`);
}

  getUserByEmail(email: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/email/${email}`, {
      headers: this.getAuthHeaders()
    });
  }
updatePassword(request: { userId: number, oldPassword: string, newPassword: string }): Observable<{ message: string }> {
  return this.http.put<{ message: string }>(
    `${this.apiUrl}/update-password`,
    request,
    { headers: this.getAuthHeaders() }
  );
}

}
