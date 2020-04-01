import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from '../material.module';
import { FormPageComponent } from './form-page/form-page.component';
import { TcgAddressForm2Component } from './form-page/tcg-address-form2/tcg-address-form2.component';
import { TdaCheckBoxesComponent } from './form-page/tda-check-boxes/tda-check-boxes.component';
import { TdaFormComponent } from './tda-form/tda-form.component';
import { TdaArrayInputComponent } from './form-page/tda-array-input/tda-array-input.component';
import { SingleSelectComponent } from './form-page/single-select/single-select.component';
import { NgSelectComponent } from './form-page/tda-ng-select/ng-select.component';
import {CKEditorModule} from "ng2-ckeditor";
import { PopUpComponent } from './form-page/tda-ng-select/pop-up/pop-up.component';

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		FormsModule,
		MaterialModule,
		NgxMaskModule,
		NgSelectModule,
		NgxCurrencyModule,
		ReactiveFormsModule,
		CKEditorModule,
	],
	declarations: [
		FormPageComponent,
		NgSelectComponent,
		SingleSelectComponent,
		TcgAddressForm2Component,
		TdaArrayInputComponent,
		TdaCheckBoxesComponent,
		TdaFormComponent,
		PopUpComponent
	],
	entryComponents: [
		PopUpComponent
	],
	exports: [
		FormPageComponent,
		FormsModule,
		ReactiveFormsModule,
		TdaCheckBoxesComponent,
		TdaFormComponent,
		CKEditorModule,
	],
})
export class TdaFormsModule {
}

