import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';
import { GameInvitation, GameObject, GameOutcome, Mark, Outcome } from 'src/app/models/game';
import { ToastrService } from 'ngx-toastr';
import { calculateWin } from 'src/app/helpers/game-logic';
import { ConnectionService } from 'src/app/services/connection.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [ConnectionService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {
  public opponentId: string | undefined;
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
    private readonly _connectionService: ConnectionService
  ) { }

  ngOnInit(): void {
    this._connectionService.initializeHub();
    this._connectionService.send$
      .pipe(
        filter(x => x.gameId === this.invitation?.gameId)
      )
      .subscribe(data => {
        this.isCurrentUserTurn = !this.isCurrentUserTurn;
        const index = +data.index;
        let temp = [...this.field];
        this.field = [];
        temp[index].mark = this.currentUserMark === Mark.X ? Mark.O : Mark.X;
        this.field = [...temp]
        this.outcome = data.outcome
        this._cdr.detectChanges();
      })

    this._connectionService.invite$.subscribe(data => {
      this.invitation = data;
      this._cdr.detectChanges();
    })


    this._connectionService.accept$
      .pipe(filter(gameId => gameId === this.invitation?.gameId))
      .subscribe(() => {
        this.startGame(this.invitation);
        this._cdr.detectChanges();
      })

  }

  public onCheckMark(item: GameObject, index: number) {
    if (!this.isCurrentUserTurn || item.mark !== Mark.NA || this.outcome) {
      return;
    }

    this.isCurrentUserTurn = !this.isCurrentUserTurn;
    this.field[index].mark = this.currentUserMark;
    this.field = [...this.field]
    const res = calculateWin(this.field, this.currentUserMark)
    if (res) {
      this.outcome = { type: GameOutcome.Win, indexes: res, winnerId: this._userService.currentUser.id }
    } else if (!res && this.field.every(x => x.mark !== Mark.NA)) {
      this.outcome = { type: GameOutcome.Draw }
    }

    if (!this.invitation) {
      throw new Error ('Invitation cannot be null');
    }

    this._connectionService.sendGameEvent(index, this.outcome, this.invitation.gameId);
    this._cdr.detectChanges();
  }

  public startGame(inv?: GameInvitation) {
    this.isGameStarted = true;
    this.field = this.fillArrayWithCells();
    this.isCurrentUserTurn = inv?.firstTurnPlayerId === this._userService.currentUser.id
    this.currentUserMark = this.isCurrentUserTurn ? Mark.X : Mark.O
  }

  public onInvite() {
    if (!this.opponentId) {
      throw new Error('Can not invite to game. OpponentId can not be null')
    }

    this._gameService.inviteToGame(this.opponentId)
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

  public getOutcomeFromEnum(outcome: Outcome): 'draw' | 'win' | 'lose' {
    if (outcome.type === GameOutcome.Draw) {
      return 'draw'
    }

    const userId = this._userService.currentUser.id;
    if (outcome.type === GameOutcome.Win && outcome.winnerId === userId) {
      return 'win'
    }
    return 'lose'
  }

  public onSelected(userId: string | undefined) {
    this.opponentId = userId;
    this._cdr.markForCheck();
  }


}
