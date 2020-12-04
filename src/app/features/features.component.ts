import { Component, OnInit } from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {MenuService} from './menu.service';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'aw-features',
  templateUrl: './features.component.html'
})

export class FeaturesComponent implements OnInit {
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

  constructor(
    private menuService: MenuService,
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
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

  onTopbarMenuButtonClick(event) {
    this.topbarItemClick = true;
    this.topbarMenuActive = !this.topbarMenuActive;

    this.hideOverlayMenu();

    event.preventDefault();
  }

  onTopbarItemClick(event, item) {
    this.topbarItemClick = true;

    if (this.activeTopbarItem === item) {
      this.activeTopbarItem = null;
    } else {
      this.activeTopbarItem = item;
    }

    event.preventDefault();
  }

  onTopbarSubItemClick(event, action) {
    event.preventDefault();
    if (action === 'logout') {
      this.authService.logOut();
      this.router.navigate(['auth', 'login']);
    }
  }

  onRightPanelButtonClick(event) {
    this.rightPanelClick = true;
    this.rightPanelActive = !this.rightPanelActive;
    event.preventDefault();
  }

  onRightPanelClick() {
    this.rightPanelClick = true;
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




