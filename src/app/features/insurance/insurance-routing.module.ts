import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InsuranceComponent} from "./insurance.component";
import {InsuranceViewComponent} from "./insurance-data/insurance-view/insurance-view.component";
import {InsuranceUpdateComponent} from "./insurance-data/insurance-update/insurance-update.component";
import {InsuranceTabviewComponent} from "./insurance-tabview/insurance-tabview.component";
import {CarBrandUpdateComponent} from "./car-brand/car-brand-update/car-brand-update.component";
import {CarBrandCreateComponent} from "./car-brand/car-brand-create/car-brand-create.component";
import {CarModalUpdateComponent} from "./car-modal/car-modal-update/car-modal-update.component";
import {CarModalCreateComponent} from "./car-modal/car-modal-create/car-modal-create.component";

const routes: Routes = [
  {path: '', component: InsuranceComponent,
  children: [
    {path: '', component: InsuranceTabviewComponent},
    {path: 'insurance/view/:id', component: InsuranceViewComponent},
    {path: 'insurance/update/:id', component: InsuranceUpdateComponent},
    {path: 'car-brand/update/:id', component: CarBrandUpdateComponent},
    {path: 'car-brand/create', component: CarBrandCreateComponent},
    {path: 'car-modal/update/:id', component: CarModalUpdateComponent},
    {path: 'car-modal/create', component: CarModalCreateComponent}
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule { }
