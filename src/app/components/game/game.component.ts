import { Component, OnInit } from '@angular/core';

export enum Mark {
  NA,
  X,
  O,
}

interface GameObject {
  mark: Mark
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public mark = Mark;
  public field: GameObject[] = []!
  constructor() { }

  ngOnInit(): void {
    this.field = this.fillArrayWithCells()
  }

  public onCheckMark(item: GameObject) {
    item.mark = Mark.X;
    this.field = [...this.field]
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
