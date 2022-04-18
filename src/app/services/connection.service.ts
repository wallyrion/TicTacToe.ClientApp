import { Injectable, OnInit } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { BASE_URL } from 'src/constants';
import { Subject } from 'rxjs';
import { GameEvent, GameEventDto, GameInvitation, Outcome } from '../models/game';
import { Guid } from 'guid-typescript';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ConnectionService {
  private sessionId = Guid.create().toString();
  private _hubConnection: HubConnection | undefined;
  public send$ = new Subject<GameEvent>()
  public invite$ = new Subject<GameInvitation>()
  public accept$ = new Subject<string>()
  public opponentTurn$ = new Subject<GameEventDto>()
  constructor(
    private readonly _userService: UserService,
    private readonly _toastr: ToastrService,
  ) { }

  initializeHub(): void {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .withUrl(`${BASE_URL}/hubs/game`, {
        headers: {},
        accessTokenFactory: () => {
          console.log('current token', this._userService.cachedAccessToken as string);
          return this._userService.cachedAccessToken as string;
        }
      })
      .build()
      ;

      console.log('build', this._hubConnection?.connectionId);

    this._hubConnection.onreconnecting(() => {
      console.log('on onreconnecting', this._hubConnection?.connectionId);
    })

    this._hubConnection.onreconnected(() => {
      console.log('on onreconnected', this._hubConnection?.connectionId);
    })

    this._hubConnection.keepAliveIntervalInMilliseconds = 1000

    this._hubConnection.start().then(res => {
      console.log('started', res, this._hubConnection?.connectionId)
    }).catch(err => console.error(err.toString()));

    this._hubConnection.on('Send', (data: any) => {
      const gameEvent = JSON.parse(data) as GameEvent;
      if (this.sessionId === gameEvent.sessionId) {
        return;
      }

      this.send$.next(gameEvent);
    });

    this._hubConnection.on('invite', (data: GameInvitation) => {
      if (data.user2Id !== this._userService.currentUser.id) {
        return;
      }
      
      this._toastr.show(`${data.user1Email} invited you to the game.`, '', {
      })
      this.invite$.next(data);
    });

    this._hubConnection.on('accepted', (gameId: string) => {
      this.accept$.next(gameId);
    });

    this._hubConnection.on('opponentTurn', (data: GameEventDto) => {
      this.opponentTurn$.next(data);
    });
  }

  public sendGameEvent(index: number, outcome: Outcome | undefined, gameId: string) {
    if (!this._hubConnection) {
      throw new Error('_hubConnection is undefined')
    }

    let ev = {
      index: index.toString(),
      sessionId: this.sessionId.toString(),
      outcome: outcome,
      gameId

    } as GameEvent
    
    this._hubConnection.invoke('Send', JSON.stringify(ev))
  }

}
