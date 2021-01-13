import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ConfirmationService, PrimeNGConfig} from 'primeng/api';
import {MenuService} from './menu.service';
import {NavigationCancel, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {IndicatorService} from '../shared/indicator/indicator.service';
import {IdleService} from '../core/service/idle.service';
import {environment} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {concatMap, delay, map, startWith, switchMap, tap} from 'rxjs/operators';
import {FeatureEnum} from '../shared/model/feature.enum';
import {AppTranslateService} from '../core/service/translate.service';
import {RoleService} from '../shared/service/role.service';
import {groupBy} from 'lodash-es';
import {UserAuthInfo} from '../auth/model/user-auth';
import {IndicatorComponent} from '../core/indicator.component';

@Component({
  selector: 'aw-features',
  templateUrl: './features.component.html'
})

export class FeaturesComponent extends IndicatorComponent implements OnInit, AfterViewInit {
  model: any[];
  userInfo: UserAuthInfo;
  menuSubscription: Subscription;
  topbarMenuActive: boolean;
  staticMenuDesktopInactive: boolean;
  staticMenuMobileActive: boolean;
  menuClick: boolean;
  isRouting = false;
  routingTimeout = null;

  constructor(
    private menuService: MenuService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private indicator: IndicatorService,
    private idle: IdleService,
    private auth: AuthService,
    private confirm: ConfirmationService,
    private translate: TranslateService,
    private appTranslate: AppTranslateService,
    private roleService: RoleService
  ) {
    super();
    this.model = [];
    this.userInfo = {};
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.idle.startWatching(environment.idleTimeout).subscribe((isTimedOut) => {
      if (isTimedOut) {
        this.logout(false, 'message.sessionExpire');
      }
    });
    this.loadUserInformation();
  }

  ngAfterViewInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.indicator.hideActivityIndicator();
        clearTimeout(this.routingTimeout);
        this.routingTimeout = setTimeout(() => {
          this.isRouting = true;
        }, 200);
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        clearTimeout(this.routingTimeout);
        this.routingTimeout = setTimeout(() => {
          this.isRouting = false;
        }, 400);
      }
    });
  }

  loadUserInformation(): void {
    this.toggleActivityIndicatorLoading(true);
    this.menuSubscription = this.appTranslate.languageChanged$.pipe(
      startWith(''),
      switchMap(() => this.appTranslate.getTranslationAsync('menu').pipe(
        delay(300),
        concatMap((lang) => this.roleService.getUserRole().pipe(
          map((authDetail) => ({
            resLang: lang,
            resUser: authDetail.user,
            resRole: authDetail.listRole
          }))
        ))
      )),
      map(({resLang, resUser, resRole}) => {
        const menuList = [];
        const userFeature = groupBy(resRole, 'menuName');
        menuList.push({label: resLang[FeatureEnum.HOME], icon: 'pi pi-fw pi-home', routerLink: ['/']});
        Object.keys(userFeature).forEach((featureId) => {
          const feature = userFeature[featureId];
          menuList.push({label: resLang[featureId], icon: feature[0].menuIcon, routerLink: [feature[0].menuUrl]});
        });
        return {resLang, resUser, userFeature, menuList};
      }),
      tap(({resUser, userFeature}) => {
        this.auth.setUserInfo(resUser);
        this.auth.setUserRole(userFeature);
      })
    ).subscribe(res => {
      this.userInfo = res.resUser;
      this.model = res.menuList;
      this.toggleActivityIndicatorLoading(false);
    }, err => {
      this.roleService.logDebug(err);
      this.toggleActivityIndicatorFailed(true);
    });
  }

  tryAgain() {
    this.loadUserInformation();
  }

  topBarLogoutClick(): void {
    this.logout(true, 'message.confirmLogout');
  }

  logout(rejectAble: boolean, msgTranslateKey: string) {
    let okBtn = 'message.accept';
    if (!rejectAble) {
      okBtn = 'message.ok';
      this.auth.logOut();
      this.idle.stopTimer();
    }
    this.confirm.confirm({
      key: 'globalDialog',
      header: this.translate.instant('message.notification'),
      message: this.translate.instant(msgTranslateKey),
      acceptVisible: true,
      rejectVisible: rejectAble,
      acceptLabel: this.translate.instant(okBtn),
      rejectLabel: this.translate.instant('message.reject'),
      accept: () => {
        this.router.navigate(['auth', 'login']);
      },
      reject: () => {}
    });

  }

  onLayoutClick() {
    if (!this.menuClick) {
      if (this.staticMenuMobileActive) {
        this.hideMenu();
      }
    }
    this.menuClick = false;
  }

  onMenuButtonClick(event) {
    this.menuClick = true;
    this.topbarMenuActive = false;

    if (this.isDesktop()) {
      this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    } else {
      this.staticMenuMobileActive = !this.staticMenuMobileActive;
    }

    event.preventDefault();
  }

  hideMenu(): void {
    this.staticMenuMobileActive = false;
  }

  onMenuClick(_) {
    this.menuClick = true;
  }

  isMobile() {
    return window.innerWidth < 768;
  }

  isDesktop() {
    return window.innerWidth >= 768;
  }

  isTablet() {
    const width = window.innerWidth;
    return width <= 768 && width > 640;
  }

  destroy() {
    super.destroy();
    this.menuSubscription.unsubscribe();
  }
}




