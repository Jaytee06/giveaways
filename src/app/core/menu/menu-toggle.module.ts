import { NgModule } from '@angular/core';

import { MenuToggleAnchorDirective, MenuToggleLinkDirective, MenuToggleDirective } from './menu-toggle';
import {UserService} from "../../services/user.service";

@NgModule({
  declarations: [
    MenuToggleAnchorDirective,
    MenuToggleLinkDirective,
    MenuToggleDirective,
  ],
  exports: [
    MenuToggleAnchorDirective,
    MenuToggleLinkDirective,
    MenuToggleDirective,
   ],
  providers:[UserService]
})
export class MenuToggleModule { }
