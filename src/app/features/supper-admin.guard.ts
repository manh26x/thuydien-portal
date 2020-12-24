import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {UserAuth} from '../auth/model/user-auth';

@Injectable({
  providedIn: 'root'
})
export class SupperAdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userLogged: UserAuth = this.auth.getUserInfo();
    if (userLogged.isSupperAdmin) {
      return true;
    } else {
      this.router.navigate(['user', 'view', userLogged.userName]);
      return false;
    }

  }

}
