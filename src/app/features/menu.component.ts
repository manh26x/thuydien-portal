import { Component, OnInit } from '@angular/core';
import {FeaturesComponent} from './features.component';

@Component({
  selector: 'aw-menu',
  template: `
    <div class="layout-sidebar" (click)="onMenuClick($event)" (mouseenter)="features.onMenuMouseEnter($event)" (mouseleave)="features.onMenuMouseLeave($event)">
      <div class="layout-sidebar-logo">
        <a href="/">
          <img src="assets/images/logo.png" alt="sale-app-layout" />
        </a>
        <a href="#" id="layout-sidebar-anchor" class="layout-sidebar-anchor" title="Slim Menu" (click)="features.onAnchorClick($event)">
          <i class="pi" [ngClass]="{'pi-circle-on': features.slimMenuAnchor, 'pi-circle-off': !features.slimMenuAnchor}"></i>
        </a>
      </div>

      <div class="layout-menu-container">
        <ul class="layout-menu">
          <li aw-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
        </ul>
      </div>
    </div>

  `
})
export class MenuComponent implements OnInit {

  model: any[];

  constructor(public features: FeaturesComponent) { }

  ngOnInit() {
    this.model = [
      {label: 'Trang chủ', icon: 'pi pi-fw pi-home', routerLink: ['/']},
      {label: 'Bản tin bán hàng', icon: 'pi pi-fw pi-tablet', routerLink: ['/news']},
      {
        label: 'Quản lý hệ thống', icon: 'pi pi-fw pi-star', routerLink: ['/system'],
        items: [
          {label: 'Danh sách quyền', icon: 'pi pi-fw pi-id-card', routerLink: ['/system/role-management']}
        ]
      }
    ];
  }

  onMenuClick(event) {
    this.features.onMenuClick(event);
  }
}
