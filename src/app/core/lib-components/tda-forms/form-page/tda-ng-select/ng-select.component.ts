import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { IproductGroup, IService } from '../../../../interfaces';

@Component({
	selector: 'app-ng-select',
	templateUrl: './ng-select.component.html',
	styleUrls: ['./ng-select.component.scss'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => NgSelectComponent),
		multi: true,
	}],
})
export class NgSelectComponent implements OnInit, ControlValueAccessor {

	@Input() placeholder = 'Select {{field.name}}';
	@Input() clearable: boolean;
	@Input() required;
	@Input() items;
	@Input() multiple;
	@Input() closeOnSelect;
	@Input() hideSelected;
	@Input() bindLabel;
	@Input() bindValue;
	@Input() editable;
	@Input() ngPopUpComponent;
	@Input() service: IService<IproductGroup>;
	@Input() structure;
	@Input() defaultValue;

	control: FormControl = new FormControl();
	items$: BehaviorSubject<IproductGroup[]> = new BehaviorSubject(this.items);
	private touched = false;

	constructor(
		private dialog: MatDialog,
	) {
	}

	// it's monified magic for NG_VALUE_ACCESSOR
	onChange = (e) => alert(e);
	onTouched = () => this.touched = true;
	writeValue = (delta: any) => this.control.setValue(delta);
	registerOnChange = (fn) => this.onChange = fn;
	registerOnTouched = (fn) => this.onTouched = fn;

	setDisabledState?(isDisabled: boolean): void {
		console.log('setDisabledState');
		isDisabled ? this.control.disable() : this.control.enable();
	}

	ngOnInit() {
		this.items$ = new BehaviorSubject(this.items);
		if (this.service) {
			this.service.get$().subscribe(data => this.items$.next(data));
		}
	}

	openProductGroup(isNew = false) {
		if (!this.ngPopUpComponent) return;
		let value: IproductGroup = isNew ? { ...this.defaultValue } : this.items$.getValue().find(i => i._id === this.control.value);
		const dialogRef = this.dialog.open(this.ngPopUpComponent, { data: { value, structure: this.structure } });
		dialogRef.afterClosed().subscribe(action => {
			if (!action) return;
			switch (action.action_type) {
				case 'save':
					value = { ...action.payload, _id: value._id };
					this.service.save$(value).subscribe(() => this.service.get$().subscribe(data => this.items$.next(data)));
					break;
				case 'delete':
					this.service.delete$(value._id).subscribe(() => this.service.get$().subscribe(data => this.items$.next(data)));
					break;
				case 'close':
				default:
					break;
			}
		});
	}
}
