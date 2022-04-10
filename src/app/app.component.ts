import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private readonly _userService: UserService
    ) {
    
  }
  ngOnInit(): void {
    this._userService.initialize();
  }

  title = 'tic-tac-toe';
}
