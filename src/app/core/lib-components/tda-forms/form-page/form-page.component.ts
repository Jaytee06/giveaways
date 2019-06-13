import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

	ngOnInit() {
	}

	fieldValueChanged(e) {

	}


	generateAndEmitFormEvent({type, field, action, payload}) {

	}

	getFormControlName(field) {
		return field._id + (field.referenceId ? '_'+field.referenceId : '' );
	}
}
