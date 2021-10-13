import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'aw-car-brand',
  templateUrl: './car-brand.component.html',
  styles: [
  ]
})
export class CarBrandComponent implements OnInit {
  statusList = [];
  formFilter: any;
  totalItems = 1;
  carBrandList = [
    {id: 1, name: 'VinFast'}

  ];
  page = 0;
  pageSize = 10;
  isHasInsert = true;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  hasErrorFilter(searchValue: string, pattern: string) {

  }

  doFilter() {

  }

  lazyLoadCarBrand($event: any) {

  }

  gotoUpdate(id) {
    this.router.navigate(['insurance', 'car-brand', 'update', id]);
  }

  deleteCarBrand(carBrand: any) {

  }

  gotoCreate() {
    this.router.navigate(['insurance', 'car-brand', 'create']);
  }

  changePage($event: any) {

  }
}
