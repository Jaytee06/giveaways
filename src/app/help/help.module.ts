import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {RaffleRoutes} from "./help.routing";
import {NgPipesModule} from "angular-pipes";
import {HiwComponent} from "./how-it-works/hiw.component";
import {DashboardModule} from "../dashboard/dashboard.module";
import {LtpComponent} from "./link-to-prime/ltp.component";
import {HtsComponent} from "./how-to-subscribe/hts.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        RouterModule.forChild(RaffleRoutes),
        LibComponentsModule,
        NgPipesModule,
        DashboardModule
    ],
    declarations: [
        HiwComponent,
        LtpComponent,
        HtsComponent
    ],
    entryComponents:[
        HiwComponent,
        LtpComponent,
        HtsComponent
    ],
    providers: [
    ]
})

export class HelpModule {}
