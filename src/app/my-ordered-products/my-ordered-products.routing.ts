import { Routes } from '@angular/router';

import {MyOrderedProductsComponent} from "./my-ordered-products.component";

export const OrderedProductRouts: Routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full',
},{
  path: '',
  children: [{
    path: 'list',
    component: MyOrderedProductsComponent
  },]
}];
