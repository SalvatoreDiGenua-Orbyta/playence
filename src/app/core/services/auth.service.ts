import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { StorageService, STORAGE_KEYS } from './storage.service';
import { User, AuthResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(
    this.storage.getItem<User>(STORAGE_KEYS.CURRENT_USER),
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  public currentUser = signal<User | null>(this.storage.getItem<User>(STORAGE_KEYS.CURRENT_USER));

  login(credentials: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((response) => this.setAuthData(response)));
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(tap((response) => this.setAuthData(response)));
  }

  logout(): void {
    this.storage.clearAuth();
    this.currentUserSubject.next(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private setAuthData(response: AuthResponse): void {
    this.storage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
    this.storage.setItem(STORAGE_KEYS.CURRENT_USER, response.user);
    this.currentUserSubject.next(response.user);
    this.currentUser.set(response.user);
  }

  isAuthenticated(): boolean {
    return !!this.storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  getToken(): string | null {
    // Note: Since items are strictly parsed with JSON.parse in StorageService,
    // we need to make sure tokens are set as JSON strings or we handle it specially.
    // Actually in StorageService, item ? JSON.parse(item) : null;
    // If token is just a base64 string, JSON.parse will fail.
    // We should just use localStorage directly for the string token.
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }
}
