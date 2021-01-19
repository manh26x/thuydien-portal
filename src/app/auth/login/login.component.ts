import {Component, OnDestroy, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {concatMap, filter, finalize, map, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {UtilService} from '../../core/service/util.service';
import {Message} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Language} from '../../core/model/language.enum';
import {ApiErrorGetUserInfo} from '../../core/model/error-response';

@Component({
  selector: 'aw-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;
  isLoading = false;
  msgInvalid: Message[] = [];
  constructor(
    private render: Renderer2,
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private util: UtilService,
    private translate: TranslateService
  ) {
    this.render.addClass(document.body, 'login-body');
    this.initForm();
  }

  ngOnInit(): void {
    of(this.activeRoute.snapshot.queryParams['logout']).pipe(
      filter(params => {
        return !!params;
      }),
      tap(() => {
        this.formLogin.get('username').setValue(this.activeRoute.snapshot.queryParams['uid']);
      }),
      filter(() => this.auth.isAuthed()),
      tap(() => this.auth.logOut())
    ).subscribe();
  }

  doLogin(): void {
    if (this.formLogin.invalid) {
      this.util.validateAllFields(this.formLogin);
      return;
    }
    this.isLoading = true;
    this.auth.login(this.formLogin.value)
      .pipe(
        concatMap(auth => this.auth.checkUserPortal(auth.access_token).pipe(
          map(res => ({ resAuth: auth, resCheckPortal: res }))
        )),
        finalize(() => this.isLoading = false)
      ).subscribe((auth) => {
        if (auth.resCheckPortal.message.code === '401') {
          this.msgInvalid = [];
          this.msgInvalid.push({ severity: 'error', summary: '', detail: this.translate.instant('invalid.message') });
        } else {
          this.auth.setToken(auth.resAuth.access_token, auth.resAuth.expires_in);
          this.auth.setRefreshToken(auth.resAuth.refresh_token);
          this.gotoView();
        }
      }, (err) => {
        this.msgInvalid = [];
        if (err instanceof ApiErrorGetUserInfo) {
          this.msgInvalid.push({ severity: 'error', summary: '', detail: this.translate.instant('errorGetUserInfo') });
        } else if (err.status === 400) {
            this.msgInvalid.push({ severity: 'error', summary: '', detail: this.translate.instant('invalid.message') });
        } else {
          this.msgInvalid.push({ severity: 'error', summary: '', detail: this.translate.instant('error') });
        }
      }
    );
  }

  initForm() {
    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formLogin.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  gotoView() {
    const uri = this.activeRoute.snapshot.queryParamMap.get('returnUrl') || '/';
    this.router.navigate([uri]);
  }

  changeLang(key) {
    localStorage.setItem(Language.LOCAL_KEY, key);
    location.reload();
  }

  ngOnDestroy() {
    this.render.removeClass(document.body, 'login-body');
  }

}
