import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'aw-news-data',
  templateUrl: './news-data.component.html',
  styles: [
  ]
})
export class NewsDataComponent implements OnInit {
  newsList = [
    {id: '123456', name: 'Hưởng lãi xuất không kỳ hạn', status: 1, groupProduct: 'Thẻ tín dụng', groupCustomer: 'KHDN', publisher: 'Trịnh Quang Anh'},
    {id: '01234', name: 'Hưởng lãi xuất không kỳ hạn', status: 1, groupProduct: 'Thẻ tín dụng', groupCustomer: 'KHDN', publisher: 'Trịnh Quang Anh'},
    {id: '09874', name: 'Hưởng lãi xuất không kỳ hạn', status: 1, groupProduct: 'Thẻ tín dụng', groupCustomer: 'KHDN', publisher: 'Trịnh Quang Anh'},
    {id: '467657', name: 'Hưởng lãi xuất không kỳ hạn', status: 1, groupProduct: 'Thẻ tín dụng', groupCustomer: 'KHDN', publisher: 'Trịnh Quang Anh'},
    {id: '34327', name: 'Hưởng lãi xuất không kỳ hạn', status: 1, groupProduct: 'Thẻ tín dụng', groupCustomer: 'KHDN', publisher: 'Trịnh Quang Anh'},
    {id: '234237', name: 'Hưởng lãi xuất không kỳ hạn', status: 1, groupProduct: 'Thẻ tín dụng', groupCustomer: 'KHDN', publisher: 'Trịnh Quang Anh'}
  ];
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotoCreate() {
    this.router.navigate(['news', 'create']);
  }

}
