import { Component, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { BaseService } from '../../../../services/base.service';
import { FieldTypeEnum, IField } from '../../../interfaces';
import { TcgDeleteDialogComponent } from '../../dialogs/tcg-delete-dialog/tcg-delete-dialog.component';


@Component({
	selector: 'app-tda-form',
	templateUrl: './tda-form.component.html',
	styleUrls: ['./tda-form.component.scss'],
})
export class TdaFormComponent implements OnInit {

	@Input() structure: IField[] = [];
	@Input() values: any = {};
	@Input() showButtons: boolean = true;
	@Input() deleteIsForbidden: boolean;
	@Input() cancelOverride;
	@Output() delete$: Subject<null> = new Subject();
	@Output() save$: Subject<any> = new Subject();
	form: FormGroup;

	constructor(
		private _dialog: MatDialog,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _formBuilder: FormBuilder,
		private _baseService: BaseService,
	) {
	}

	ngOnInit() {
		this._createFormGroup();
	}

	delete() {
		const dialogRef = this._dialog.open(TcgDeleteDialogComponent, {
			data: {
				name: this.values.name,
				// title: "patient"
			},
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result === true) {
				// console.log(result);
				this.delete$.next();
			}
		});
	}

	save() {
		this._markAsTouched();
		if (!this.form.valid) return;
		this.save$.next(this.form.value);
	}

	cancel() {
		this.cancelOverride
			? this.cancelOverride()
			: this._router.navigate(['../'], { relativeTo: this._activatedRoute }).then();
	}

	private _createFormGroup() {
		this.form = this._formBuilder.group({});
		this.structure.forEach((field) => {
			if (field) {
				let defaultValue;
				switch (field.type) {
					// case 'Text':
					// 	break;

					case FieldTypeEnum.Input:
					case FieldTypeEnum.Textarea:
					case FieldTypeEnum.ngSelect:
					case FieldTypeEnum.MultiSelect:
					case FieldTypeEnum.SimpleCheckBox:
						// case 'Select':
						// case 'Radio':
						// case 'Physician':
						// case 'Clinic':
						// case 'Lab':
						// case 'User':
						this._createDynamicControl(this.form, field);
						break;
					case FieldTypeEnum.Address:
						defaultValue = this._getFieldValue(field._id);
						const validators = [];
						if (field.required && !field.originallyHidden) validators.push(Validators.required);
						if (!defaultValue) {
							defaultValue = { address: '', city: '', state: '', zip: '' };
						}
						const group = this._formBuilder.group({});
						['address', 'city', 'state', 'zip'].forEach(name => {
							const control = this._formBuilder.control(defaultValue[name], validators);
							group.addControl(name, control);
						});
						group.addControl('address2', this._formBuilder.control(defaultValue.address2));
						this.form.addControl(field._id, group);
						break;
					case FieldTypeEnum.ArrayInput:
						defaultValue = this._getFieldValue(field._id, []);
						const formArray = this._formBuilder.array(defaultValue);
						if (field.required && !field.originallyHidden) {
							formArray.setValidators(Validators.required);
						}
						this.form.addControl(field._id, formArray);
						break;

					// case 'Checkbox':
					// 	// todo
					// 	// defaultValue = this.getSaleValue(field._id);
					// 	defaultValue = undefined;
					// 	if (!defaultValue) {
					// 		defaultValue = [];
					// 	}
					// 	const formArray = this.fb.array(defaultValue);
					// 	if (field.required && !field.originallyHidden) {
					// 		formArray.setValidators(Validators.required);
					// 	}
					// 	this.form.addControl(field._id, formArray);
					// 	break;
				}
			}

		});
	}

	private _createDynamicControl(target: FormGroup, field: IField) {
		let fieldId = field._id;
		const defaultValue = this._getFieldValue(fieldId);
		const validators = [];
		if (field.required && !field.originallyHidden) {
			validators.push(Validators.required);
		}
		if (field.typeAttribute === 'Email') {
			validators.push(Validators.email);
		}

		// check if it should show on first render
		if( field.originallyHidden ) {
			const master = this.structure.find((f) => {
				if( f.options && f.options.length ) {
					const option = f.options.find((op) => {
						if( op.dependents && op.dependents.length && op.dependents.indexOf(field._id) > -1 ) return op;
					});
					if( option && option._id === this._getFieldValue(f._id) ) return true;
				}
				return false;
			});
			if( master ) field.shouldShow = true;
		}

		const control = this._formBuilder.control({ value: defaultValue, disabled: field.disabled }, validators);
		target.addControl(fieldId, control);
	}

	private _getFieldValue(_id, defaultValue: any = null) {
		if( _id.indexOf('.') > -1 ) {
			const _ids = _id.split('.');
			let values = this.values;
			for (let i = 0; i < _ids.length; i++) {
				values = values && values[_ids.splice(0, 1)[0]];
			}
			return values && typeof values[_ids[0]] !== 'undefined' && values[_ids[0]] !== null ? values[_ids[0]] : defaultValue;
		}
		return this.values[_id] ? this.values[_id] : defaultValue;
	}

	private _markAsTouched(form = this.form) {
		Object.keys(form.controls).forEach(inner => {
			// const abstractControl = form.get(inner);
			const abstractControl = form.controls[inner];
			if ((abstractControl as FormGroup).controls) {
				this._markAsTouched(abstractControl as FormGroup);
			} else {
				abstractControl.markAsTouched();
				abstractControl.updateValueAndValidity();
			}
		});
	}
}
