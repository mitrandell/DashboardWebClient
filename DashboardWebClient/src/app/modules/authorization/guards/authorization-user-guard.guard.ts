import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthorizationService } from '../services/authorization.service';
import { AuthUserData } from '../models/auth-user-data.model';

@Injectable({
  providedIn: 'root'
})

export class AuthorizationUserGuard implements CanActivate {
  userDataSubscribtion: any;
  userData = new AuthUserData();

  constructor(private router: Router, private authService: AuthorizationService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userData = data;
    });
  }

  //implementation CanActivate iterface to be a guard deciding if a route can be activated
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userData.isLoggedIn) {
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
