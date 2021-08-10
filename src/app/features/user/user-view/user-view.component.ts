import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {concatMap, finalize, map, takeUntil} from 'rxjs/operators';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {BaseComponent} from '../../../core/base.component';
import {UserDetail} from '../model/user';
import {UserEnum} from '../model/user.enum';
import {ApiErrorResponse} from '../../../core/model/error-response';

import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'aw-user-view',
  templateUrl: './user-view.component.html',
  styles: [
  ]
})
export class UserViewComponent extends BaseComponent implements OnInit {
  userDetail: UserDetail = {};
  userConst = UserEnum;
  isApprove: boolean = false;
  approveEmitter$: BehaviorSubject<boolean> = new BehaviorSubject(this.isApprove);

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private indicator: IndicatorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isApprove = params['isApprove'] === 'true';
      this.approveEmitter$.next(this.isApprove);
    });
    this.userService.setPage('view');
    this.indicator.showActivityIndicator();
    this.route.paramMap.pipe(
      takeUntil(this.nextOnDestroy),
      map(res => res.get('id')),
      concatMap(id => this.userService.getUserInfo(id).pipe(
        finalize(() => this.indicator.hideActivityIndicator())
      ))
    ).subscribe(res => {
      this.userService.logDebug(res);
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
    this.router.navigate(['user']);
  }

}
