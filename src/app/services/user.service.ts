import { LoginViewModel, RefreshTokenRequest, RefreshTokenResponse, TokenResponse, UserModel } from './../models/user/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { BASE_URL } from 'src/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${BASE_URL}/User`;
  private user: UserModel | undefined;

  set currentUserToken(response: TokenResponse | undefined) {
    if (!response) {
      this.user = undefined;
      localStorage.clear();
      return;
    }

    this.user = response.userViewModel;
    localStorage.setItem('current-user', JSON.stringify(response.userViewModel))
    localStorage.setItem('access-token', response.accessToken)
    localStorage.setItem('refresh-token', response.refreshToken)
  }

  get currentUser(): UserModel {
    return this.user as any;
  }

  get accessToken(): string | null {
    return localStorage.getItem('access-token');
  }

  get refreshToken(): string | null {
    return localStorage.getItem('refresh-token');
  }

  constructor(
    private http: HttpClient,
  ) {
    const userJson = localStorage.getItem('current-user');

    if (userJson) {
      this.user = JSON.parse(userJson);
    }
  }

  register(response: LoginViewModel) {
    return this.http.post<TokenResponse>(`${this.baseUrl}/register`, response)
      .pipe(tap(user => {
        this.currentUserToken = user;
      }))

  }

  login(response: LoginViewModel) {
    return this.http.post<TokenResponse>(`${this.baseUrl}/login`, response)
      .pipe(tap(user => this.currentUserToken = user))
  }

  refreshTokens() {
    return this.http.post<RefreshTokenResponse>(
      `${this.baseUrl}/refresh_token`, {refreshToken: this.refreshToken, userId: this.currentUser.id} as RefreshTokenRequest)
      .pipe(
        tap((tokens: RefreshTokenResponse) => {
          localStorage.setItem('access-token', tokens.accessToken)
          localStorage.setItem('refresh-token', tokens.refreshToken)
        })
      )
  }

  logout() {
    this.currentUserToken = undefined;
  }
}
