import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDTO } from '../../models/user-dto.model';
import { UpdateUserRequest } from '../../models/update-user-request.model';
import { getSafeLocalStorage } from '../../utils/localstorage'; // make sure this path is correct

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private baseUrl = 'http://localhost:8081/admin/users';

  constructor(private http: HttpClient) {}

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

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  createUser(user: UserDTO): Observable<string> {
    return this.http.post(this.baseUrl, user, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  updateUserRole(id: number, role: string): Observable<string> {
    const request: UpdateUserRequest = { role };
    return this.http.put(`${this.baseUrl}/${id}/role`, request, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  toggleActivation(id: number, enabled: boolean): Observable<string> {
    const request: UpdateUserRequest = { enabled };
    return this.http.put(`${this.baseUrl}/${id}/activation`, request, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
}
