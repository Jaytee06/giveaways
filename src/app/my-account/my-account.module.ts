import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {UserService} from "../services/user.service";
import {NgPipesModule} from "angular-pipes";
import {DashboardModule} from "../dashboard/dashboard.module";
import {UserProfileComponent} from "./user-profile.component";
import {MyAccountRoutes} from "./my-account.routing";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        RouterModule.forChild(MyAccountRoutes),
        LibComponentsModule,
        NgPipesModule,
        DashboardModule
    ],
    declarations: [
        UserProfileComponent
    ],
    providers: [
        UserService
    ]
})

export class MyAccountModule {}
