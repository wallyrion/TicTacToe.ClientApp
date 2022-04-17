import { LoginViewModel, RefreshTokenRequest, RefreshTokenResponse, TokenResponse, UserModel } from './../models/user/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Subject, tap } from 'rxjs';
import { BASE_URL } from 'src/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${BASE_URL}/User`;
  private user: UserModel | undefined;
  public isUserLoading = false;
  public user$ = new Subject<UserModel | undefined>();
  set currentUserToken(response: TokenResponse | undefined) {
    if (!response) {
      this.user = undefined;
      localStorage.clear();
      return;
    }

    this.user = response.userViewModel;
    localStorage.setItem('current-user-id', response.userViewModel.id)
    localStorage.setItem('access-token', response.accessToken)
    localStorage.setItem('refresh-token', response.refreshToken)
  }

  get currentUser(): UserModel {
    return this.user as any;
  }

  get cachedAccessToken(): string | null {
    return localStorage.getItem('access-token');
  }

  get cachedRefreshToken(): string | null {
    return localStorage.getItem('refresh-token');
  }

  get cachedUserId(): string | null {
    return localStorage.getItem('current-user-id');
  }

  constructor(
    private http: HttpClient,
  ) {
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
      `${this.baseUrl}/refresh_token`, {refreshToken: this.cachedRefreshToken, userId: this.cachedUserId} as RefreshTokenRequest)
      .pipe(
        tap((tokens: RefreshTokenResponse) => {
          localStorage.setItem('access-token', tokens.accessToken)
          localStorage.setItem('refresh-token', tokens.refreshToken)
        })
      )
  }


  private getCurrentUser() {
    this.isUserLoading = true;
    return this.http.get<UserModel>(`${this.baseUrl}/my-info`)
    .pipe(tap({
      next: (user) => {
        this.user = user;
        this.user$.next(user);
      },
      error: (err) => {
        this.user$.next(undefined)
      }
    }),
    finalize(() => {
      this.isUserLoading = false;
    }))
  }

  initialize() {
    this.getCurrentUser().subscribe()
  }

  logout() {
    this.currentUserToken = undefined;
  }

  findOpponent(part: string) {
    const encodedPart = encodeURIComponent(part);
    return this.http.get<UserModel[]>(`${this.baseUrl}/search?part=${encodedPart}`)
  }
}
