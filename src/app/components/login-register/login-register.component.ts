import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginViewModel } from 'src/app/models/user/user';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  @Output() submit = new EventEmitter<LoginViewModel>();
  @Input() public isRegistration = false;
  @Input() public isLoading = false;

  public form!: FormGroup;

  constructor(
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      email: [''],
      password: [''],
    });
  }

  public onSubmit() {
    const loginModel = this.form.value as LoginViewModel;
    this.submit.next(loginModel);
  }

}
