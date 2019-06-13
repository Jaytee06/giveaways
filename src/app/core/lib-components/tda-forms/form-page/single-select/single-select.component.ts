import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-single-select',
	templateUrl: './single-select.component.html',
	styleUrls: ['./single-select.component.scss'],
})
export class SingleSelectComponent implements OnInit, AfterViewChecked {

	@Input() required: boolean;
	@Input() placeholder;
	@Input() control;
	@Input() options;
	@Output() change = new EventEmitter();

	isInitialized = false;


	constructor() {
	}

	ngOnInit() {
	}

	ngAfterViewChecked(): void {
		if (!this.isInitialized) {
			this.isInitialized = true;
			this.change.next(this.control.value ? this.control.value: '');
		}
	}

	somethingChanged() {
		this.change.next(this.control.value ? this.control.value: '');
	}
}
