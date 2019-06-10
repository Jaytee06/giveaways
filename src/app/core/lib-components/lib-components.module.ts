import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TcgTableComponent} from './tcg-table/tcg-table.component';
import {
    MatCheckboxModule,
    MatIconModule, MatInputModule,
    MatListModule,
    MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        TcgTableComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatMenuModule,
        MatListModule,
        MatSelectModule,
        MatTooltipModule,
        MatIconModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatInputModule
    ],
    exports: [
        TcgTableComponent
    ]
})
export class LibComponentsModule {}
