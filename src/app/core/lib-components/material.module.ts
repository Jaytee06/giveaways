import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDialogModule,
	MatDividerModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatProgressBarModule,
	MatRadioModule,
	MatSelectModule,
	MatSnackBarModule,
	MatSlideToggleModule,
	MatSortModule,
	MatStepperModule,
	MatTableModule,
	MatTabsModule,
	MatTooltipModule, MatAutocompleteModule, MatBadgeModule,
} from '@angular/material';
import {
	MatDatepickerModule, MatMomentDateModule, MAT_DATE_FORMATS,
	MAT_DATE_LOCALE, MomentDateModule, MomentDateAdapter, DateAdapter,
	MatDateFormats
} from '@coachcare/datepicker';

/* Format as you desire, based on moment.js format strings */
export const MaterialDateFormats: MatDateFormats = {
	parse: {
		date: 'MM/DD/YYYY',
		datetime: 'MM/DD/YYYY h:mm A',
		time: 'h:mm A'
	},
	display: {
		date: 'MM/DD/YYYY',
		datetime: 'MM/DD/YYYY h:mm A',
		time: 'h:mm A',
		dateA11yLabel: 'LL',
		monthDayLabel: 'MMMM DD, YYYY',
		monthDayA11yLabel: 'MMMM D',
		monthYearLabel: 'MMMM YYYY',
		monthYearA11yLabel: 'MMMM YYYY',
		timeLabel: 'HH:mm'
	},
};

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatAutocompleteModule,
		MatCardModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatMomentDateModule,
		MatDialogModule,
		MatDividerModule,
		MatFormFieldModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatNativeDateModule,
		MatPaginatorModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatRadioModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatStepperModule,
		MatTableModule,
		MatTooltipModule,
		MatTabsModule,
		MatBadgeModule,
	],

	exports: [
		MatButtonModule,
		MatAutocompleteModule,
		MatCardModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatMomentDateModule,
		MatDialogModule,
		MatDividerModule,
		MatFormFieldModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatNativeDateModule,
		MatPaginatorModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatRadioModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatStepperModule,
		MatTableModule,
		MatTooltipModule,
		MatTabsModule,
		MatBadgeModule,
	],
	declarations: [],
	providers: [
		{
			provide: MAT_DATE_LOCALE,
			useValue: 'en'
		},
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE]
		},
		{
			provide: MAT_DATE_FORMATS,
			useValue: MaterialDateFormats
		},
	]
})
export class MaterialModule {
}
