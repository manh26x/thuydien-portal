import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ConfirmationService, PrimeNGConfig} from 'primeng/api';
import {MenuService} from './menu.service';
import {NavigationCancel, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {IndicatorService} from '../shared/indicator/indicator.service';
import {IdleService} from '../core/service/idle.service';
import {environment} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'aw-features',
  templateUrl: './features.component.html'
})

export class FeaturesComponent implements OnInit, AfterViewInit {
  menuMode = 'static';

  topbarMenuActive: boolean;

  overlayMenuActive: boolean;

  slimMenuActive: boolean;

  slimMenuAnchor = false;

  toggleMenuActive: boolean;

  staticMenuDesktopInactive: boolean;

  staticMenuMobileActive: boolean;

  lightMenu = true;

  menuClick: boolean;

  topbarItemClick: boolean;

  activeTopbarItem: any;

  resetMenu: boolean;

  menuHoverActive: boolean;

  rightPanelActive: boolean;

  rightPanelClick: boolean;

  configActive: boolean;

  configClick: boolean;

  inputStyle = 'outlined';

  ripple: boolean;

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
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
//    this.idle.startWatching(environment.idleTimeout).subscribe((isTimedOut) => {
//      if (isTimedOut) {
//        this.logout(false, 'message.sessionExpire');
//      }
//    });
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

  logout(rejectAble: boolean, msgTranslateKey: string) {
    const okBtn = rejectAble ? 'message.accept' : 'message.ok';
    this.confirm.confirm({
      key: 'globalDialog',
      header: this.translate.instant('message.notification'),
      message: this.translate.instant(msgTranslateKey),
      acceptVisible: true,
      rejectVisible: rejectAble,
      acceptLabel: this.translate.instant(okBtn),
      rejectLabel: this.translate.instant('message.reject'),
      accept: () => {
        this.auth.logOut();
        this.router.navigate(['auth', 'login']);
        this.idle.stopTimer();
      },
      reject: () => {}
    });

  }

  onLayoutClick() {
    if (!this.topbarItemClick) {
      this.activeTopbarItem = null;
      this.topbarMenuActive = false;
    }

    if (!this.rightPanelClick) {
      this.rightPanelActive = false;
    }

    if (!this.menuClick) {
      if (this.isHorizontal()) {
        this.menuService.reset();
      }

      if (this.overlayMenuActive || this.staticMenuMobileActive) {
        this.hideOverlayMenu();
      }

      if (this.slimMenuActive) {
        this.hideSlimMenu();
      }

      if (this.toggleMenuActive) {
        this.hideToggleMenu();
      }

      this.menuHoverActive = false;
    }

    if (this.configActive && !this.configClick) {
      this.configActive = false;
    }

    this.configClick = false;
    this.topbarItemClick = false;
    this.menuClick = false;
    this.rightPanelClick = false;
  }

  onMenuButtonClick(event) {
    this.menuClick = true;
    this.topbarMenuActive = false;

    if (this.isOverlay()) {
      this.overlayMenuActive = !this.overlayMenuActive;
    }
    if (this.isToggle()) {
      this.toggleMenuActive = !this.toggleMenuActive;
    }
    if (this.isDesktop()) {
      this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
    } else {
      this.staticMenuMobileActive = !this.staticMenuMobileActive;
    }

    event.preventDefault();
  }

  onMenuClick($event) {
    this.menuClick = true;
    this.resetMenu = false;
  }

  onAnchorClick(event) {
    if (this.isSlim()) {
      this.slimMenuAnchor = !this.slimMenuAnchor;
    }
    event.preventDefault();
  }

  onMenuMouseEnter(event) {
    if (this.isSlim()) {
      this.slimMenuActive = true;
    }
  }

  onMenuMouseLeave(event) {
    if (this.isSlim()) {
      this.slimMenuActive = false;
    }
  }

  onRippleChange(event) {
    this.ripple = event.checked;
  }

  onConfigClick(event) {
    this.configClick = true;
  }

  isHorizontal() {
    return this.menuMode === 'horizontal';
  }

  isSlim() {
    return this.menuMode === 'slim';
  }

  isOverlay() {
    return this.menuMode === 'overlay';
  }

  isToggle() {
    return this.menuMode === 'toggle';
  }

  isStatic() {
    return this.menuMode === 'static';
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

  hideOverlayMenu() {
    this.overlayMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  hideSlimMenu() {
    this.slimMenuActive = false;
    this.staticMenuMobileActive = false;
  }

  hideToggleMenu() {
    this.toggleMenuActive = false;
    this.staticMenuMobileActive = false;
  }
}




