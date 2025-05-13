import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DecodedToken } from '../../../shared/decoded-token';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://localhost:8081/auth';

  constructor(private http: HttpClient,private router:Router) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
  
  decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);

  }
  getRole(): string | null {
    const token = this.decodeToken();
    if (token) {
      return token.role;
    } else return null;}
    
  
}