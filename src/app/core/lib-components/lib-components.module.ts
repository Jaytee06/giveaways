import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TcgTableComponent} from './tcg-table/tcg-table.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from "./material.module";
import {CustomTypeaheadSearchComponent} from "./tda-forms/form-page/custom-typeahead-search/custom-typeahead-search.component";
import {TdaFormsModule} from "./tda-forms/tda-forms.module";
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import {TcgDeleteDialogComponent} from "./dialogs/tcg-delete-dialog/tcg-delete-dialog.component";
import {TcgConfirmDialogComponent} from "./dialogs/tcg-confirm-dialog/tcg-confirm-dialog.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {LoaderComponent} from "./loader/loader.component";
import {CountDownTimerComponent} from "./count-down-timer/count-down-timer.component";
import {NgCircleProgressModule} from "ng-circle-progress";
import {HowItWorksComponent} from "./how-it-works/how-it-works.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {RouterModule} from "@angular/router";
import {NgxWheelModule} from "ngx-wheel";
import {NgxMaskModule} from "ngx-mask";
import {ObjectSummationComponent} from "./object-summation/object-summation.component";
import {FiltersComponent} from "./filters/filters.component";
import { ActiveFilterComponent } from "./filters/active-filter/active-filter.component";
import {DateRangeFilterComponent} from "./filters/date-range-filter/date-range-filter.component";
import {ExportFilterComponent} from "./filters/export-filter/export-filter.component";
import { RolesFilterComponent } from "./filters/role-filter/role-filter.component";
import { SearchTextFilterComponent } from "./filters/search-text-filter/search-text-filter.component";
import { SelectFilterComponent } from "./filters/select-filter/select-filter.component";
import { SortFilterComponent } from "./filters/sort-filter/sort-filter.component";
import { StatusesFilterComponent } from "./filters/statuses-filter/statuses-filter.component";


@NgModule({
    declarations: [
        TcgTableComponent,
        TcgDeleteDialogComponent,
        TcgConfirmDialogComponent,
        CustomTypeaheadSearchComponent,
        LoaderComponent,
        CountDownTimerComponent,
        HowItWorksComponent,
        NotificationsComponent,
        ObjectSummationComponent,
        FiltersComponent,
        ActiveFilterComponent,
        DateRangeFilterComponent,
        ExportFilterComponent,
        RolesFilterComponent,
        SearchTextFilterComponent,
        SelectFilterComponent,
        SortFilterComponent,
        StatusesFilterComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        TdaFormsModule,
        NgSelectModule,
        NgxDaterangepickerMd.forRoot(),
        NgCircleProgressModule.forRoot({
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 0,
            animation: false
        }),
        NgxWheelModule,
        NgxMaskModule.forRoot(),
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
        NgxDaterangepickerMd,
        CountDownTimerComponent,
        HowItWorksComponent,
        NotificationsComponent,
        NgxWheelModule,
        NgxMaskModule,
        ObjectSummationComponent,
        FiltersComponent,
        ActiveFilterComponent,
        DateRangeFilterComponent,
        ExportFilterComponent,
        RolesFilterComponent,
        SearchTextFilterComponent,
        SelectFilterComponent,
        SortFilterComponent,
        StatusesFilterComponent,
    ],
    entryComponents: [
        TcgDeleteDialogComponent
    ]
})
export class LibComponentsModule {}
