import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TcgTableComponent} from './tcg-table/tcg-table.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from "./material.module";
import {CustomTypeaheadSearchComponent} from "./tda-forms/form-page/custom-typeahead-search/custom-typeahead-search.component";
import {TdaFormsModule} from "./tda-forms/tda-forms.module";
import {TcgDeleteDialogComponent} from "./dialogs/tcg-delete-dialog/tcg-delete-dialog.component";
import {TcgConfirmDialogComponent} from "./dialogs/tcg-confirm-dialog/tcg-confirm-dialog.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {LoaderComponent} from "./loader/loader.component";
import {CountDownTimerComponent} from "./count-down-timer/count-down-timer.component";
import {NgCircleProgressModule} from "ng-circle-progress";
import {HowItWorksComponent} from "./how-it-works/how-it-works.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {RouterModule} from "@angular/router";


@NgModule({
    declarations: [
        TcgTableComponent,
        TcgDeleteDialogComponent,
        TcgConfirmDialogComponent,
        CustomTypeaheadSearchComponent,
        LoaderComponent,
        CountDownTimerComponent,
        HowItWorksComponent,
        NotificationsComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        TdaFormsModule,
        NgSelectModule,
        NgCircleProgressModule.forRoot({
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 0,
            animation: false
        })
    ],
    exports: [
        TcgTableComponent,
        TcgDeleteDialogComponent,
        TcgConfirmDialogComponent,
        MaterialModule,
        CustomTypeaheadSearchComponent,
        TdaFormsModule,
        NgSelectModule,
        LoaderComponent,
        CountDownTimerComponent,
        HowItWorksComponent,
        NotificationsComponent
    ]
})
export class LibComponentsModule {}
