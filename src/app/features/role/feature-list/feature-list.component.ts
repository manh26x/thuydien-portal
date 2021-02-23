import {Component, Input, OnInit} from '@angular/core';
import {FeatureMenu} from '../model/feature';

@Component({
  selector: 'aw-feature-list',
  templateUrl: './feature-list.component.html',
  styles: [
  ]
})
export class FeatureListComponent implements OnInit {
  @Input() featureList: FeatureMenu[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  doChangFeature(evt) {
    console.log(evt);
  }

}
