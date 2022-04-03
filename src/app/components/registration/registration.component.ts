import { LoginViewModel } from '../../models/user/user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  public isLoading = false;
  constructor(
    private readonly _userService: UserService,
    private readonly _router: Router,
    private readonly _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  public onSubmit(model: LoginViewModel) {
    this.isLoading = true;
    this._userService.register(model)
      .pipe(
        tap({
          next: () => this.isLoading = false,
          error: () => this.isLoading = false
        })
      )
      .subscribe({
        next: () => {
          this._toastr.success('Registration was successfully completed')
          this._router.navigate(['game']);
        },
        error: () => this._toastr.error('Error during registration')
      })
  }

}
