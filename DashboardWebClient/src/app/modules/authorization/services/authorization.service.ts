import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthUserData } from '../models/auth-user-data.model';
import { AuthLoginResponseData } from '../interfaces/auth-login-response-data.interface';
import { multipleErrorHandler } from '../../utils/error-handlers';
import { AuthLoginData } from '../interfaces/auth-login-data.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  decodeUserDetails: any;
  baseUrl = environment.apiUrl;
  userData$ = new BehaviorSubject<AuthUserData>(new AuthUserData());
  token!: string | null;
  constructor(private http: HttpClient, private router: Router) {}

  //login to app
  login(userDetails: AuthLoginData) {
    return this.http.post<AuthLoginResponseData>(this.baseUrl + "/SignIn", userDetails)
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          this.setUserDetails();

          return response;
        }),
        catchError(error => {
          return multipleErrorHandler(error);
        })
      );
  }

  //set user data from token
  setUserDetails() {
    const userDetails = new AuthUserData();

    this.token = localStorage.getItem('token');

    if (this.token) {
      this.decodeUserDetails = JSON.parse(window.atob(this.token.split(".")[1]));
    }

    userDetails.login = this.decodeUserDetails.sub;
    userDetails.userId = this.decodeUserDetails.userId;
    userDetails.isLoggedIn = true;

    this.userData$.next(userDetails);
  }

 

  //logout from app
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
    this.userData$.next(new AuthUserData());
  }
}
