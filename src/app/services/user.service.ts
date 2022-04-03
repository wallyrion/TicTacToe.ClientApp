import { LoginViewModel } from './../models/user/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'https://localhost:7270/User';
  constructor(private http: HttpClient) { }

  register(user: LoginViewModel){
    return this.http.post(`${this.baseUrl}/register`, user)
  }
}
