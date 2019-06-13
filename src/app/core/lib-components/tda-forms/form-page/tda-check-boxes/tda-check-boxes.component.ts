import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-tda-check-boxes',
	templateUrl: './tda-check-boxes.component.html',
	styleUrls: ['./tda-check-boxes.component.scss'],
})
export class TdaCheckBoxesComponent implements OnInit, AfterViewChecked {

	@Input() minChecked;
	@Input() maxChecked;
	@Input() required;
	@Input() allowOther: boolean;
	@Input() placeholder;
	@Input() options: any[];
	@Input() formGroup: FormArray;
	@Output() change = new EventEmitter();

	isInitialized = false;
	otherControl: AbstractControl;

	constructor() {
	}

	// // get set the value from component
	// get value(): string[] | null {
	// 	return this.formGroup.value;
	// }
	//
	// @Input() set value(options: string[] | null) {
	// 	if (!options) options = [];
	// 	options.forEach(op => this.formGroup.push(new FormControl(op)));
	// }

	ngOnInit() {
		this.setRequired();
		const otherValue = this.formGroup.value.findIndex(v => this.options.findIndex(o => o.text === v) === -1);
		if (this.allowOther) {
			if (otherValue === -1) {
				this.otherControl = new FormControl('');
				this.formGroup.push(this.otherControl);
			} else {
				this.otherControl = this.formGroup.at(otherValue);
			}
		}
	}


	setRequired() {
		if (this.required) {
			this.formGroup.setValidators(Validators.required);
		}
	}

	onChange(event) {
		if (event.checked) {
			this.formGroup.push(new FormControl(event.source.value.text));

		} else {
			const i = this.formGroup.controls.findIndex(x => x.value === event.source.value.text);
			this.formGroup.removeAt(i);
		}

		this.change.emit();
	}

	// formGroup.value.indexOf(option) > -1
	getChecked(option) {
		return this.formGroup.value.findIndex(x => x.toLowerCase() == option.text.toLowerCase()) > -1;
	}

	ngAfterViewChecked(): void {
		if (!this.isInitialized) {
			this.isInitialized = true;
			this.change.emit();
		}
	}
}
