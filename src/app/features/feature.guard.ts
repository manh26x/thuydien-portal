import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {FeatureEnum} from '../shared/model/feature.enum';
import {FeatureGroupByRole, UserRole} from '../auth/model/user-auth';
import {AuthService} from '../auth/auth.service';

interface RouteData {
  feature?: string;
  role?: string | string[];
}

@Injectable({
  providedIn: 'root'
})

export class FeatureGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const routeData: RouteData = route.data;
    if (routeData.feature) {
      if (routeData.feature === FeatureEnum.HOME) {
        return true;
      } else if (routeData.role) {
        const featureList: FeatureGroupByRole = this.auth.getUserRole();
        const roleList: UserRole[] = featureList[routeData.feature];
        const userRole: string[] = Array.isArray(routeData.role) ? routeData.role : [routeData.role];
        if (roleList && roleList.find(role => userRole.indexOf(role.rightId) >= 0)) {
          return true;
        } else {
          this.router.navigate(['public', 'access-denied']);
          return false;
        }
      } else {
        console.error('FeatureGuard', 'Not Found Role');
        return false;
      }
    } else {
      console.error('FeatureGuard', 'Not Found Feature');
      return false;
    }
  }
}
