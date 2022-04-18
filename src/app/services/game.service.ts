import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BASE_URL } from 'src/constants';
import { GameEventDto, GameInvitation } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public newGame$ = new Subject;
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

  handleNextTurn(gameId: string, cellIndex: number) {
    return this.http.post<GameEventDto>(`${this.baseUrl}/next-turn`, {
      gameId,
      cellIndex
    })
  }
}
