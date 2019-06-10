import {NgModule} from '@angular/core';

import {LibComponentsModule} from '../core/lib-components/lib-components.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LibComponentsModule,
        NgSelectModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        LibComponentsModule,
        NgSelectModule
    ]
})

export class SharedModule {}
