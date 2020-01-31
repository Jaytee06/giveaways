import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';
import { HighchartsChartModule } from 'highcharts-angular';

import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {UserService} from "../services/user.service";
import {MyReferralsComponent} from "./my-referrals.component";
import {NgPipesModule} from "angular-pipes";
import {DashboardModule} from "../dashboard/dashboard.module";
import {MyReferralRoutes} from "./my-referrals.routing";
import {RaffleService} from "../services/raffle.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        RouterModule.forChild(MyReferralRoutes),
        LibComponentsModule,
        NgPipesModule,
        DashboardModule,
        HighchartsChartModule
    ],
    declarations: [
        MyReferralsComponent
    ],
    providers: [
        RaffleService,
        UserService
    ]
})

export class MyReferralsModule {}
