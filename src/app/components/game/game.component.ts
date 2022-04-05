import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { Guid } from 'guid-typescript';
import { BASE_URL } from 'src/constants';

export enum Mark {
  NA,
  X,
  O,
}

interface GameEvent {
  index: string;
  sessionId: string;
}

interface GameObject {
  mark: Mark
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {
  private _hubConnection: HubConnection | undefined;
  sessionId = Guid.create();
  public isGameStarted = false;

  public mark = Mark;
  public field: GameObject[] = []!
  constructor(
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.field = this.fillArrayWithCells()
    this._hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(`${BASE_URL}/game`)
      .build();

      console.log(this._hubConnection);

    this._hubConnection.start().catch(err => console.error(err.toString()));

    this._hubConnection.on('Send', (data: any) => {
      const received = `Received: ${data}`;
      console.log(received);
      let gameEvent = JSON.parse(data) as GameEvent;
      if (this.sessionId.toString() == gameEvent.sessionId) {
        return;
      }

      const index = +gameEvent.index;
      let temp = [...this.field];
      this.field = [];
      temp[index].mark = Mark.O;
      this.field = [...temp]
      console.log(this.field);
      this._cdr.detectChanges();
    });

    this._hubConnection.on('Invite', (data: any) => {
      const received = `Received invite: ${data}`;
      
    });
  }

  public onCheckMark(item: GameObject, index: number) {
    item.mark = Mark.X;
    this.field = [...this.field]

    let ev = {
      index: index.toString(),
      sessionId: this.sessionId.toString()
    } as GameEvent
    if (this._hubConnection) {
      this._hubConnection.invoke('Send',JSON.stringify(ev) );
    }
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
}
