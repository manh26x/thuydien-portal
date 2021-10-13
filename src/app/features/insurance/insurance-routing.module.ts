import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InsuranceComponent} from "./insurance.component";
import {InsuranceViewComponent} from "./insurance-data/insurance-view/insurance-view.component";
import {InsuranceUpdateComponent} from "./insurance-data/insurance-update/insurance-update.component";
import {InsuranceTabviewComponent} from "./insurance-tabview/insurance-tabview.component";

const routes: Routes = [
  {path: '', component: InsuranceComponent,
  children: [
    {path: '', component: InsuranceTabviewComponent},
    {path: 'insurance/view/:id', component: InsuranceViewComponent},
    {path: 'insurance/update/:id', component: InsuranceUpdateComponent}
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule { }
