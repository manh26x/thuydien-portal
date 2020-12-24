import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {concatMap, finalize, map, takeUntil} from 'rxjs/operators';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {BaseComponent} from '../../../core/base.component';
import {UserDetail} from '../model/user';
import {UserEnum} from '../model/user.enum';
import {UserAuth} from '../../../auth/model/user-auth';
import {AuthService} from '../../../auth/auth.service';
import {Message} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {ApiErrorResponse} from '../../../core/model/error-response';

@Component({
  selector: 'aw-user-view',
  templateUrl: './user-view.component.html',
  styles: [
  ]
})
export class UserViewComponent extends BaseComponent implements OnInit {
  userDetail: UserDetail = {};
  userConst = UserEnum;
  userLogged: UserAuth;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private indicator: IndicatorService,
    private auth: AuthService
  ) {
    super();
    this.userLogged = this.auth.getUserInfo();
  }

  ngOnInit(): void {
    this.userService.setPage('view');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      concatMap(id => this.userService.getUserInfo(id).pipe(
        finalize(() => this.indicator.hideActivityIndicator())
      ))
    ).subscribe(res => {
      this.userDetail = res;
    }, err => {
      if (err instanceof ApiErrorResponse && err.code === '205') {
        this.router.navigate(['public', 'access-denied']);
      } else {
        throw err;
      }
    });
  }

  doCancel() {
    if (this.userLogged.isSupperAdmin) {
      this.router.navigate(['user']);
    } else {
      this.router.navigate(['']);
    }
  }

}
