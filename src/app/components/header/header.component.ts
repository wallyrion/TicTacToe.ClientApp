import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user/user';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private userService: UserService,
    private gameService: GameService,
    private router: Router
  ) { }

  get user(): UserModel | undefined {
    return this.userService.currentUser;
  }

  ngOnInit(): void {
  }

  onStartNewGame() {
    this.gameService.newGame$.next(true);
  }

  onLogout() {
    this.userService.logout();
    this.router.navigate(['login'])
  }

}
