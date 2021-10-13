import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'aw-car-modal',
  templateUrl: './car-modal.component.html',
  styles: [
  ]
})
export class CarModalComponent implements OnInit {
  formFilter: any;
  statusList = [];
  carModalList = [
    {id: 1, name: 'Mike'}
  ];
  isHasInsert = true;
  page = 0;
  pageSize = 10;
  totalItems = 1;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  doFilter() {

  }

  hasErrorFilter(searchValue: string, pattern: string) {

  }

  lazyLoadCarModal($event: any) {

  }

  gotoUpdate(id) {
    this.router.navigate(['insurance', 'car-modal', 'update', id]);
  }

  deleteCarModal(carModal: any) {

  }

  changePage($event: any) {

  }

  gotoCreate() {
    this.router.navigate(['insurance', 'car-modal', 'create']);
  }
}
