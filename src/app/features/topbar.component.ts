import { Component } from '@angular/core';
import { FeaturesComponent} from './features.component';

@Component({
  selector: 'aw-topbar',
  template: `
    <div class="layout-topbar">
      <a href="#" id="layout-menu-btn" class="menu-btn" (click)="features.onMenuButtonClick($event)">
        <i class="pi pi-bars"></i>
      </a>

      <div class="layout-topbar-menu-wrapper">
        <ul class="topbar-menu fadeInDown" [ngClass]="{'topbar-menu-active': features.topbarMenuActive}">
          <li class="profile-item" #profile [ngClass]="{'active-topmenuitem':features.activeTopbarItem === profile}">
            <a href="#" (click)="features.onTopbarItemClick($event, profile)">
              <img src="assets/images/avatar.png" alt="sale-app-layout" />
              <span class="topbar-item-name profile-name">Madison Hughes</span>
            </a>

            <ul class="fadeInDown animated">
              <li role="menuitem">
                <a href="#" (click)="features.onTopbarSubItemClick($event, 'profile')">
                  <i class="pi pi-fw pi-user"></i>
                  <span>Profile</span>
                  <span class="topbar-badge">5</span>
                </a>
              </li>
              <li role="menuitem">
                <a href="#" (click)="features.onTopbarSubItemClick($event, 'changePassword')">
                  <i class="pi pi-fw pi-cog"></i>
                  <span>Change password</span>
                </a>
              </li>
              <li role="menuitem">
                <a href="#" (click)="features.onTopbarSubItemClick($event, 'logout')">
                  <i class="pi pi-fw pi-sign-out"></i>
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </li>


        </ul>

        <a href="#" class="topbar-menu-btn" (click)="features.onTopbarMenuButtonClick($event)">
          <img src="assets/images/avatar.png" alt="sale-app-layout" />
        </a>
      </div>
    </div>
  `
})
export class TopBarComponent {
  constructor(public features: FeaturesComponent) {}
}
