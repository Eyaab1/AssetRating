import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl ='/api/users'
  private currentUser:User|null = null;
  constructor(private http:HttpClient) { }

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

}
