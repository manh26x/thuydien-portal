import { Component } from '@angular/core';

@Component({
  selector: 'aw-footer',
  template: `
    <div class="layout-footer clearfix">
      <a href="/">
        <img src="assets/images/logo.png" alt="sale-app-layout" height="20"/>
      </a>
      <div class="layout-footer-icons">
        <a href="#twitter" class="icon-link"><i class="pi pi-twitter icon"></i></a>
        <a href="#facebook" class="icon-link"><i class="pi pi-facebook icon"></i></a>
        <a href="#github" class="icon-link"><i class="pi pi-github icon"></i></a>
      </div>
    </div>
  `
})
export class FooterComponent {

}
