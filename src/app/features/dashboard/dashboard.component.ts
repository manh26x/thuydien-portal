import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aw-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {
  options: any;

  overlays: any[];
  constructor() { }


  ngOnInit() {
    this.options = {
      center: {lat: 20.976794764101914, lng: 105.78475211270884},
      zoom: 12
    };
  }

  handleMapClick($event: any) {

  }

  handleOverlayClick($event: any) {

  }


}
