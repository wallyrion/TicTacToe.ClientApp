import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from 'src/constants';
import { GameInvitation } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly baseUrl = `${BASE_URL}/Game`;

  constructor(
    private http: HttpClient,
  ) { }

  inviteToGame(opponentId: string) {
    return this.http.post<GameInvitation>(`${this.baseUrl}/invite`, { opponentId })
  }

  acceptInvitation(gameId: string) {
    return this.http.post(`${this.baseUrl}/accept/${gameId}`, {})
  }
}
