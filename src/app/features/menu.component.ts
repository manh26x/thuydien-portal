import {Component, OnDestroy, OnInit} from '@angular/core';
import {FeaturesComponent} from './features.component';
import {AppTranslateService} from '../core/service/translate.service';
import {concatMap, map, startWith} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {FeatureEnum} from '../shared/model/feature.enum';

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
export class MenuComponent implements OnInit, OnDestroy {

  model: any[];
  menuSubscription: Subscription;
  constructor(
    public features: FeaturesComponent,
    private appTranslate: AppTranslateService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.menuSubscription = this.appTranslate.languageChanged$.pipe(
      startWith(''),
      concatMap(() => this.appTranslate.getTranslationAsync('menu').pipe(
        res => res
      ))
    ).subscribe(res => {
      this.model = res;
    });
  }

  onMenuClick(event) {
    this.features.onMenuClick(event);
  }

  ngOnDestroy() {
    this.menuSubscription.unsubscribe();
  }
}
