import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {UserService} from "../services/user.service";
import {MyOrderedProductsComponent} from "./my-ordered-products.component";
import {OrderedProductRouts} from "./my-ordered-products.routing";
import {NgPipesModule} from "angular-pipes";
import {DashboardModule} from "../dashboard/dashboard.module";
import {OrderedProductService} from "../services/ordered-product.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        RouterModule.forChild(OrderedProductRouts),
        LibComponentsModule,
        NgPipesModule,
        DashboardModule
    ],
    declarations: [
        MyOrderedProductsComponent
    ],
    providers: [
        OrderedProductService,
    ]
})

export class MyOrderedProductsModule {}
