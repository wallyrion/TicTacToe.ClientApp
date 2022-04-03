import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginViewModel } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly _userService: UserService,
    private readonly _router: Router,
    private readonly _toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  public onSubmit(model: LoginViewModel) {
    this._userService.login(model)
      .subscribe({
        next: (user) => {
          this._userService
          this._toastr.success('Logged in successfully')
          this._router.navigate(['game']);
        },
        error: () => this._toastr.error('Error during authorization')
      })
  }

}
