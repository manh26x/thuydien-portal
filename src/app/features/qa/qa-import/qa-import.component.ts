import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'aw-qa-import',
  templateUrl: './qa-import.component.html',
  styles: [
  ]
})
export class QaImportComponent implements OnInit {
  private fileImport: any;

  constructor() { }

  ngOnInit(): void {
  }

  doChangeFile(files) {
    this.fileImport = files;

  }

  doCheckFile() {

  }
}
