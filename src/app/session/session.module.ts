import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginoneComponent } from './loginone/loginone.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { LockScreenComponent } from './lockscreen/lockscreen.component';
import { SubscribesComponent } from './subscribes/subscribes.component';
import { UnderMaintanceComponent } from './under-maintance/under-maintance.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SessionRoutes } from './session.routing';
import {LibComponentsModule} from "../core/lib-components/lib-components.module";
import {UnsubscribeComponent} from "./unsubscribe/unsubscribe.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(SessionRoutes),
      LibComponentsModule
  ],
  declarations: [ 
    LoginoneComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ComingSoonComponent,
    LockScreenComponent,
    SubscribesComponent,
    UnderMaintanceComponent,
    NotFoundComponent,
    UnsubscribeComponent
  ]
})

export class SessionDemoModule {}
