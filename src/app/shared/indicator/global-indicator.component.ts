import {Component, HostBinding, OnInit} from '@angular/core';
import {IndicatorService} from './indicator.service';

/**
 * @auth: TruongNH
 * Loading in all app component
 */
@Component({
  selector: 'aw-global-indicator',
  template: `
    <div class="indicator global-indicator" *ngIf="isLoading">
      <p-progressSpinner strokeWidth="3" [style]="{width: '70px', height: '70px'}"></p-progressSpinner>
    </div>
  `,
  styles: [`:host{top: 0;bottom: 0;left: 0;right: 0;margin: auto;position: absolute;}`]
})
export class GlobalIndicatorComponent implements OnInit {
  isLoading = false;
  @HostBinding('class.invisible') isHidden = true;
  constructor(
    private indicatorService: IndicatorService
  ) { }

  ngOnInit() {
    this.indicatorService.isLoading$.subscribe((res) => {
      this.isLoading = res;
      this.isHidden = !res;
    });
  }
}
