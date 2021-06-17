import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}
  private token: string;
  isAuthenticated = false;
  private authStatus = new Subject<boolean>();
  private userId: string;
  private expiresInTimer: any;

  private BACKEND_URL = environment.apiUrl + 'user/';

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatus.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const postData: AuthData = {
      email,
      password,
    };
    this.httpClient.post(this.BACKEND_URL + 'signup', postData).subscribe(
      (response) => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatus.next(false);
      }
    );
  }

  loginUser(email: string, password: string) {
    const postData: AuthData = {
      email,
      password,
    };
    this.httpClient
      .post<{ token: string; expiresIn: number; userId: string }>(
        this.BACKEND_URL + 'login',
        postData
      )
      .subscribe(
        (response) => {
          // console.log('logged in token: ', response.token);
          if (response.token) {
            this.token = response.token;
            this.setAuthTimer(response.expiresIn);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatus.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + response.expiresIn * 1000
            );
            this.saveAuthData(response.token, expirationDate, response.userId);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatus.next(false);
        }
      );
  }

  private setAuthTimer(duration: number) {
    this.expiresInTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatus.next(true);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate,
      userId,
    };
  }

  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatus.next(false);
    clearTimeout(this.expiresInTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }
}
