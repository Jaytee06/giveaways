import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {UserService} from "../services/user.service";
import {MyRafflesComponent} from "./my-raffles.component";
import {NgPipesModule} from "angular-pipes";
import {DashboardModule} from "../dashboard/dashboard.module";
import {MyRaffleRoutes} from "./my-raffles.routing";
import {RaffleService} from "../services/raffle.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        RouterModule.forChild(MyRaffleRoutes),
        LibComponentsModule,
        NgPipesModule,
        DashboardModule
    ],
    declarations: [
        MyRafflesComponent
    ],
    providers: [
        RaffleService,
        UserService
    ]
})

export class MyRafflesModule {}
