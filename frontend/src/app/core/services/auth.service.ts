import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  User,
  LoginData,
  RegisterData,
  AuthResponse,
} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getStoredUser(),
  );

  public readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: LoginData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/api/auth/login`, credentials)
      .pipe(tap((res) => this.handleAuthResponse(res)));
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/api/auth/register`, userData)
      .pipe(tap((res) => this.handleAuthResponse(res)));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');

    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/api/auth/me`)
      .pipe(tap((user) => this.setUser(user)));
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    this.setUser(response.user);
  }

  private setUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
