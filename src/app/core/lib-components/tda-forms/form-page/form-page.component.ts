import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';
import { IField } from '../../../interfaces';


@Component({
	selector: 'app-form-page',
	templateUrl: './form-page.component.html',
	styleUrls: ['./form-page.component.scss'],
})
export class FormPageComponent implements OnInit {

	@Input() classFields: IField[];
	@Input() formGroup: FormGroup;
	@Input() users: any[];
	@Output() fieldChanged: EventEmitter<any> = new EventEmitter();

	ngOnInit() {}

	fieldValueChanged(e: any) {
		console.log(e);
		if( e.field && e.field.options && e.field.options.length && e.value ) {
			const dependents = e.field.options.reduce((arr, cur) => {
				arr = arr.concat(cur.dependents);
				return arr;
			}, []);
			dependents.forEach((dep) => {
				const f = this.classFields.find(x => x._id === dep);
				if( f ) f.shouldShow = false;
				console.log(f);
			});
			const selectedOption = e.field.options.find(x => x._id === e.value);
			if( selectedOption && selectedOption.dependents && selectedOption.dependents.length ) {
				selectedOption.dependents.forEach((dep) => {
					const showField = this.classFields.find(x => x._id === dep);
					if( showField ) {
						showField.shouldShow = true;
						if( showField.required) this.formGroup.controls[dep].setValidators(Validators.required);
					}
					console.log(showField);
				});
			}
		}
	}

	generateAndEmitFormEvent({type, field, action, payload}) {

	}

	changeSlug(newName: string, needChange = false) {
		if (needChange) {
			this.formGroup.get('slug').setValue(newName.replace(/ +/g, '_').toLowerCase());
		}

	}

	getFormControlName(field) {
		return field._id + (field.referenceId ? '_'+field.referenceId : '' );
	}
}
