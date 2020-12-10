import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {concatMap, finalize, map, takeUntil} from 'rxjs/operators';
import {IndicatorService} from '../../../shared/indicator/indicator.service';
import {BaseComponent} from '../../../core/base.component';
import {UserDetail} from '../model/user';

@Component({
  selector: 'aw-user-view',
  templateUrl: './user-view.component.html',
  styles: [
  ]
})
export class UserViewComponent extends BaseComponent implements OnInit {
  initValue: UserDetail;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private indicator: IndicatorService
  ) {
    super();
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
      this.initValue = res;
    });
  }

  doCancel() {
    this.router.navigate(['user']);
  }

}
