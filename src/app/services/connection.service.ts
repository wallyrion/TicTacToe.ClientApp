import { Injectable, OnInit } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { BASE_URL } from 'src/constants';
import { Subject } from 'rxjs';
import { GameEvent, GameInvitation, Outcome } from '../models/game';
import { Guid } from 'guid-typescript';
import { UserService } from './user.service';

@Injectable()
export class ConnectionService {
  private sessionId = Guid.create().toString();
  private _hubConnection: HubConnection | undefined;
  public send$ = new Subject<GameEvent>()
  public invite$ = new Subject<GameInvitation>()
  public accept$ = new Subject<string>()
  constructor(
    private readonly _userService: UserService
  ) { }

  initializeHub(): void {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(`${BASE_URL}/game`)
      .build();

    this._hubConnection.start().catch(err => console.error(err.toString()));

    this._hubConnection.on('Send', (data: any) => {
      const gameEvent = JSON.parse(data) as GameEvent;
      if (this.sessionId === gameEvent.sessionId) {
        return;
      }

      this.send$.next(gameEvent);
    });

    this._hubConnection.on('invite', (data: GameInvitation) => {
      if (data.opponentId !== this._userService.currentUser.id) {
        return;
      }
      
      this.invite$.next(data);
    });

    this._hubConnection.on('accepted', (gameId: string) => {
      this.accept$.next(gameId);
    });
  }

  public sendGameEvent(index: number, outcome: Outcome | undefined) {
    if (!this._hubConnection) {
      console.error('_hubConnection is undefined')
      return;
    }

    let ev = {
      index: index.toString(),
      sessionId: this.sessionId.toString(),
      outcome: outcome
    } as GameEvent
    
    this._hubConnection.invoke('Send', JSON.stringify(ev))
  }

}
