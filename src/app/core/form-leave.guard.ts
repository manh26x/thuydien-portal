import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {BeforeLeave} from './model/before-leave';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class FormLeaveGuard implements CanDeactivate<BeforeLeave> {
  constructor(private translate: TranslateService) {
  }

  /**
   * @author TruongNH
   * date: 08/12/2020
   * desc: confirm before leave page
   */
  canDeactivate(
    component: BeforeLeave,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (nextState.url.includes('login') && nextState.root.queryParams['expired'] === '1') {
      return true;
    }
    if (typeof component.canLeave === 'function') {
      const check = component.canLeave();
      if (typeof check === 'undefined' || check) {
        return true;
      } else {
        return confirm(this.translate.instant('message.beforeLeave'));
      }
    } else {
      return true;
    }
  }

}
