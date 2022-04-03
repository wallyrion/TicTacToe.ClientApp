import { LoginViewModel } from '../../models/user/user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  public form!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _router: Router,
    private readonly _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      email: [''],
      password: [''],
    });
  }

  public onSubmit() {
    const loginModel = this.form.value as LoginViewModel;
    this._userService.register(loginModel)
      .subscribe({
        next: x => {
          this._toastr.success('Registration was successfully completed')
          this._router.navigate(['game']);
        },
        error: () => this._toastr.error('Error during registration')
      })

  }

}
