import {Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {filter} from 'rxjs/operators';

@Component({
  /* tslint:disable:component-selector */
  selector: '[aw-menuitem]',
  /* tslint:enable:component-selector */
  template: `
		<ng-container>
			<a [attr.href]="item.url" (click)="itemClick($event)" *ngIf="!item.routerLink || item.items"
			   (keydown.enter)="itemClick($event)" [ngClass]="item.class"
			   [attr.target]="item.target" [attr.tabindex]="0" pRipple>
				<i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
				<span>{{item.label}}</span>
				<i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
				<span class="menuitem-badge" *ngIf="item.badge">{{item.badge}}</span>
			</a>
			<a (click)="itemClick($event)" *ngIf="item.routerLink && !item.items"
			   [routerLink]="item.routerLink" routerLinkActive="active-menuitem-routerlink" [ngClass]="item.class"
			   [routerLinkActiveOptions]="{exact: true}" [attr.target]="item.target" [attr.tabindex]="0" pRipple>
				<i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
				<span>{{item.label}}</span>
				<i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
				<span class="menuitem-badge" *ngIf="item.badge">{{item.badge}}</span>
			</a>
			<ul *ngIf="item.items && active"
				[@children]="(active ? 'visibleAnimated' : 'hiddenAnimated')">
				<ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
					<li aw-menuitem [item]="child" [index]="i"></li>
				</ng-template>
			</ul>
		</ng-container>
  `,
  animations: [
    trigger('children', [
      state('void', style({
        height: '0px'
      })),
      state('hiddenAnimated', style({
        height: '0px'
      })),
      state('visibleAnimated', style({
        height: '*'
      })),
      state('visible', style({
        height: '*',
        'z-index': 100
      })),
      state('hidden', style({
        height: '0px',
        'z-index': '*'
      })),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('void => visibleAnimated, visibleAnimated => void',
        animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class MenuitemComponent implements OnInit, OnDestroy {
  @HostBinding('class.active-menuitem') active = false;
  @Input() item: any;

  @Input() index: number;

  @Input() root: boolean;

  constructor(public router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(_ => {
        if (this.item.routerLink) {
          this.updateActiveStateFromRoute();
        } else {
          this.active = false;
        }
      });
  }

  ngOnInit() {
    if (this.item.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }

  updateActiveStateFromRoute() {
    this.active = this.router.isActive(this.item.routerLink[0], !this.item.items);
  }

  itemClick(event: Event) {
    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault();
      return true;
    }

    // execute command
    if (this.item.command) {
      this.item.command({originalEvent: event, item: this.item});
    }

    // toggle active state
    if (this.item.items) {
      this.active = !this.active;
    } else {
      // activate item
      this.active = true;
    }
  }

  ngOnDestroy() {}
}
