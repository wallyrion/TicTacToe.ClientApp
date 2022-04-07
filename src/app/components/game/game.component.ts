import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { Guid } from 'guid-typescript';
import { BASE_URL } from 'src/constants';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';
import { GameEvent, GameInvitation, GameObject, GameOutcome, Mark, Outcome } from 'src/app/models/game';
import { ToastrService } from 'ngx-toastr';
import { calculateWin } from 'src/app/helpers/game-logic';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {
  private _hubConnection: HubConnection | undefined;
  public opponentEmail: string | undefined;
  sessionId = Guid.create();
  public isGameStarted = false;
  public invitation: GameInvitation | undefined;
  public mark = Mark;
  public outcomes = GameOutcome;
  public field: GameObject[] = []!
  public isInvitationRequested = false;
  public isCurrentUserTurn: boolean = null!;
  public currentUserMark: Mark = null!;
  public outcome: Outcome | undefined;
  constructor(
    private _cdr: ChangeDetectorRef,
    private _gameService: GameService,
    private _userService: UserService = null!,
    private _toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(`${BASE_URL}/game`)
      .build();

    console.log(this._hubConnection);

    this._hubConnection.start().catch(err => console.error(err.toString()));

    this._hubConnection.on('Send', (data: any) => {
      console.log('change turn', data);
      let gameEvent = JSON.parse(data) as GameEvent;
      if (this.sessionId.toString() == gameEvent.sessionId) {
        return;
      }

      this.isCurrentUserTurn = !this.isCurrentUserTurn;
      const index = +gameEvent.index;
      let temp = [...this.field];
      this.field = [];
      temp[index].mark = this.currentUserMark === Mark.X ? Mark.O : Mark.X;
      this.field = [...temp]
      console.log(this.field);
      this.outcome = gameEvent.outcome
      this._cdr.detectChanges();
    });

    this._hubConnection.on('invite', (data: GameInvitation) => {
      if (data.user2Email !== this._userService.currentUser.email) {
        return;
      }
      console.log(data);
      this.invitation = data;
      this._cdr.detectChanges();
    });

    this._hubConnection.on('accepted', (gameId: string) => {
      if (this.invitation?.gameId !== gameId) {
        return;
      }

      this.startGame(this.invitation);
      this._cdr.detectChanges();
    });
  }

  public onCheckMark(item: GameObject, index: number) {
    if (!this.isCurrentUserTurn || item.mark !== Mark.NA || this.outcome) {
      return;
    }

    this.isCurrentUserTurn = !this.isCurrentUserTurn;
    // item.mark = this.currentUserMark;
    this.field[index].mark = this.currentUserMark;
    this.field = [...this.field]
    const res = calculateWin(this.field, this.currentUserMark)
    if (res) {
      this.outcome =  { type: GameOutcome.Win, indexes: res, winnerId: this._userService.currentUser.id }
    } else if (!res && this.field.every(x => x.mark !== Mark.NA)){
      this.outcome = {type: GameOutcome.Draw }
    }
    
    let ev = {
      index: index.toString(),
      sessionId: this.sessionId.toString(),
      outcome: this.outcome
    } as GameEvent
    if (this._hubConnection) {
      this._hubConnection.invoke('Send', JSON.stringify(ev));
    }
    
    this._cdr.detectChanges();
  }

  public startGame(inv?: GameInvitation) {
    this.isGameStarted = true;
    this.field = this.fillArrayWithCells();
    this.isCurrentUserTurn = inv?.firstTurnPlayerId === this._userService.currentUser.id
    this.currentUserMark = this.isCurrentUserTurn ? Mark.X : Mark.O
  }

  public onInvite() {
    console.log(this.opponentEmail)
    if (!this.opponentEmail) {
      return;
    }

    this._gameService.inviteToGame(this._userService.currentUser.email, this.opponentEmail)
      .subscribe(res => {
        console.log(res);
        this.isInvitationRequested = true;
        this.invitation = res;
        this._toastr.success('Invited');
        this._cdr.detectChanges();
      })
  }

  public onConfirmInvitation() {
    if (!this.invitation) {
      return;
    }

    this._gameService.acceptInvitation(this.invitation.gameId)
      .subscribe(() => {
        this.startGame(this.invitation);
      });
  }

  private fillArrayWithCells() {
    var list = [];
    for (var i = 0; i < 9; i++) {
      var obj = {
        mark: Mark.NA
      }
      list.push(obj);
    }
    return list;
  }

  public getOutcomeFromEnum(outcome: Outcome) {
    if (outcome.type === GameOutcome.Draw) {
      return 'draw'
    }

    const userId = this._userService.currentUser.id;
    if (outcome.type === GameOutcome.Win && outcome.winnerId === userId) {
      return 'win'
    }
    return 'lose'
  }


}
