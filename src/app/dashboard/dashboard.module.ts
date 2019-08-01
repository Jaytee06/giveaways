import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import { DashboardComponent } from './dashboard-v1/dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import {MyWidgetComponent} from "./widgets/my-tickets/my-widget.component";
import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {TicketService} from "../services/ticket.service";
import {TwitchChannelComponent} from "./widgets/twitch-channel/twitch-channel.component";
import {TriviaQuizzesComponent} from "./widgets/trivia-quizzes/trivia-quizzes.component";
import {TriviaService} from "../services/trivia.service";
import {RafflesComponent} from "./widgets/raffles/raffles.component";
import {RaffleService} from "../services/raffle.service";
import {SpinWheelComponent} from "./widgets/spin-wheel/spin-wheel.component";
import {TicketOppsComponent} from "./widgets/ticket-opportunities/ticket-opps.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule,
    RouterModule.forChild(DashboardRoutes),
    LibComponentsModule
  ],
  declarations: [
    DashboardComponent,
    MyWidgetComponent,
    TwitchChannelComponent,
    TriviaQuizzesComponent,
    RafflesComponent,
    SpinWheelComponent,
    TicketOppsComponent
  ],
	exports: [
		TwitchChannelComponent,
		MyWidgetComponent,
      SpinWheelComponent
	],
  providers: [
    TicketService,
    TriviaService,
    RaffleService
  ]
})

export class DashboardModule {}
