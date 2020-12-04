import {Component, OnInit} from '@angular/core';
import {FeaturesComponent} from './features.component';

@Component({
  selector: 'aw-config',
  template: `
        <a style="cursor: pointer" id="layout-config-button" class="layout-config-button" (click)="onConfigButtonClick($event)">
            <i class="pi pi-cog"></i>
        </a>
        <div class="layout-config" [ngClass]="{'layout-config-active': features.configActive}" (click)="features.onConfigClick($event)">
            <h5>Menu Type</h5>
            <div class="p-field-radiobutton">
                <p-radioButton name="menuMode" value="static" [(ngModel)]="features.menuMode" inputId="mode1"></p-radioButton>
                <label for="mode1">Static</label>
            </div>
            <div class="p-field-radiobutton">
                <p-radioButton name="menuMode" value="overlay" [(ngModel)]="features.menuMode" inputId="mode2"></p-radioButton>
                <label for="mode2">Overlay</label>
            </div>
            <div class="p-field-radiobutton">
                <p-radioButton name="menuMode" value="horizontal" [(ngModel)]="features.menuMode" inputId="mode3"></p-radioButton>
                <label for="mode3">Horizontal</label>
            </div>
            <div class="p-field-radiobutton">
                <p-radioButton name="menuMode" value="slim" [(ngModel)]="features.menuMode" inputId="mode4"></p-radioButton>
                <label for="mode4">Slim</label>
            </div>
            <div class="p-field-radiobutton">
                <p-radioButton name="menuMode" value="toggle" [(ngModel)]="features.menuMode" inputId="mode5"></p-radioButton>
                <label for="mode5">Toggle</label>
            </div>

            <h5>Menu Color</h5>
            <div class="p-field-radiobutton">
                <p-radioButton name="lightMenu" [value]="true" [(ngModel)]="features.lightMenu" inputId="lightMenu1"></p-radioButton>
                <label for="lightMenu1">Light</label>
            </div>
            <div class="p-field-radiobutton">
                <p-radioButton name="lightMenu" [value]="false" [(ngModel)]="features.lightMenu" inputId="lightMenu2"></p-radioButton>
                <label for="lightMenu2">Dark</label>
            </div>

            <h5>Input Style</h5>
            <div class="p-field-radiobutton">
                <p-radioButton name="inputStyle" value="outlined" [(ngModel)]="features.inputStyle" inputId="inputStyle1"></p-radioButton>
                <label for="inputStyle1">Outlined</label>
            </div>
            <div class="p-field-radiobutton">
                <p-radioButton name="inputStyle" value="filled" [(ngModel)]="features.inputStyle" inputId="inputStyle2"></p-radioButton>
                <label for="inputStyle2">Filled</label>
            </div>

            <h5>Ripple Effect</h5>
			<p-inputSwitch [ngModel]="features.ripple" (onChange)="features.onRippleChange($event)"></p-inputSwitch>
        </div>
    `
})
export class ConfigComponent implements OnInit {

  constructor(public features: FeaturesComponent) {}

  ngOnInit() {

  }

  isIE() {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  }

  replaceLink(linkElement, href) {
    if (this.isIE()) {
      linkElement.setAttribute('href', href);
    } else {
      const id = linkElement.getAttribute('id');
      const cloneLinkElement = linkElement.cloneNode(true);

      cloneLinkElement.setAttribute('href', href);
      cloneLinkElement.setAttribute('id', id + '-clone');

      linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

      cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', id);
      });
    }
  }

  onConfigButtonClick(event) {
    this.features.configActive = !this.features.configActive;
    this.features.configClick = true;
    event.preventDefault();
  }
}
