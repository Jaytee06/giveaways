import {NgModule} from '@angular/core';

import {LibComponentsModule} from '../core/lib-components/lib-components.module';
import {CommonModule} from '@angular/common';
import {DirectivesModule} from "./directive/directives.module";
import {DragulaModule} from "ng2-dragula";
import {FileUploadModule} from "ng2-file-upload";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatExpansionModule} from "@angular/material";
import {AngularFirestore} from "@angular/fire/firestore";

@NgModule({
    imports: [
        CommonModule,
        DirectivesModule,
        DragulaModule,
        FileUploadModule,
        FlexLayoutModule,
        LibComponentsModule,
        MatExpansionModule,
    ],
    exports: [
        CommonModule,
        DirectivesModule,
        DragulaModule,
        FileUploadModule,
        FlexLayoutModule,
        LibComponentsModule,
        MatExpansionModule,
    ],
    providers:[
        AngularFirestore
    ]
})

export class SharedModule {}
