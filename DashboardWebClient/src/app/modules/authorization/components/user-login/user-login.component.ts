import { Component } from '@angular/core';
import { AuthLoginData } from '../../interfaces/auth-login-data.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../services/authorization.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styles: ``
})
export class UserLoginComponent {
  UserLoginData: AuthLoginData = {
    login: '',
    password: '',
  }

  loginForm: FormGroup;

  isLoading!: boolean;
  isLoadingDataSubscribtion: any;
  errorMessage = '';
  submitted = false;
  submittedClick = false;

  constructor(private authService: AuthorizationService, private router: Router,
    private formBuilder: FormBuilder) {

    this.loginForm = this.formBuilder.group({
      login: [this.UserLoginData.login, Validators.required],
      password: [this.UserLoginData.password, Validators.required]
    });
  }

  //login to app
  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: result => {
          this.submitted = true;
          this.router.navigate([""]);
        },
        error: error => {
          this.errorMessage = error;
        }
      });
    }
  }
}
