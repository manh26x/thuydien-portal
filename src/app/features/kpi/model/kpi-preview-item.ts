import { Type } from '@angular/core';

export class KpiPreviewItem {
  constructor(public component: Type<any>, public kpiList: any[], public titleList: any[]) {}
}
