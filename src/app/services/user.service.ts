import { LoginViewModel, UserModel } from './../models/user/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'https://localhost:7270/User';
  public user: UserModel | undefined;

  set currentUser(user: UserModel | undefined) {
    this.user = user;
    localStorage.setItem('current-user', JSON.stringify(user))
  }

  constructor(
    private http: HttpClient,
  ) {
    const userJson = localStorage.getItem('current-user');

    if (userJson) {
      this.user = JSON.parse(userJson);
    }
  }

  register(user: LoginViewModel) {
    return this.http.post<UserModel>(`${this.baseUrl}/register`, user)
      .pipe(tap(user => {
        this.currentUser = user;
      }))

  }

  login(user: LoginViewModel) {
    return this.http.post<UserModel>(`${this.baseUrl}/login`, user)
      .pipe(tap(user => this.currentUser = user))
  }

  logout() {
    this.user = undefined;
    localStorage.removeItem('current-user');
  }
}
