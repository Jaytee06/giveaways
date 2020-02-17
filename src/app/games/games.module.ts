import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../core/directive/directives.module';

import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {GameService} from "../services/games.service";
import {GamesComponent} from "./games.component";
import {GamesRoutes} from "./games.routing";
import {NgPipesModule} from "angular-pipes";
import {DashboardModule} from "../dashboard/dashboard.module";
import {GameComponent} from "./game/game.component";
import {SfGameComponent} from './game/externalGame/sf-game.component';
import {FamobiGameComponent} from "./game/famobiGame/famobi-game.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DirectivesModule,
        RouterModule.forChild(GamesRoutes),
        LibComponentsModule,
        NgPipesModule,
        DashboardModule
    ],
    declarations: [
        GamesComponent,
        GameComponent,
        SfGameComponent,
        FamobiGameComponent,
    ],
    providers: [
        GameService,
    ]
})

export class GamesModule {}
