import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {TicketService} from "../services/ticket.service";
import {TriviaService} from "../services/trivia.service";
import {UserService} from "../services/user.service";
import {TriviaComponent} from "./trivia.component";
import {TriviaRoutes} from "./trivia.routing";
import {NgPipesModule} from "angular-pipes";
import {DashboardModule} from "../dashboard/dashboard.module";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		DirectivesModule,
		RouterModule.forChild(TriviaRoutes),
		LibComponentsModule,
		NgPipesModule,
		DashboardModule
	],
    declarations: [
        TriviaComponent
    ],
    providers: [
        TicketService,
        TriviaService,
    ]
})

export class TriviaModule {}
