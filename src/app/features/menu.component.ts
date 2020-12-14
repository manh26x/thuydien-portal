import { Component, OnInit } from '@angular/core';
import {FeaturesComponent} from './features.component';
import {AppTranslateService} from '../core/service/translate.service';
import {concatMap, startWith} from 'rxjs/operators';

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

  constructor(
    public features: FeaturesComponent,
    private appTranslate: AppTranslateService
  ) { }

  ngOnInit() {
    this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.appTranslate.getTranslationAsync('menu').pipe(
        res => res
      ))
    ).subscribe(res => {
      this.model = [
        {label: res.home, icon: 'pi pi-fw pi-home', routerLink: ['/']},
        {label: res.news, icon: 'pi pi-fw pi-book', routerLink: ['/news']},
        {label: res.user, icon: 'pi pi-fw pi-user', routerLink: ['/user']},
        {label: res.qna, icon: 'pi pi-fw pi-question-circle', routerLink: ['/qna']},
        {label: res.tags, icon: 'pi pi-fw pi-list', routerLink: ['/tags']},
        {label: res.calculateTool, icon: 'pi pi-fw pi-desktop', routerLink: ['/calculate-tool']}
      ];
    });
  }

  onMenuClick(event) {
    this.features.onMenuClick(event);
  }
}
