import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseService } from '../../../../services/base.service';

@Component({
	selector: 'select-filter',
	templateUrl: './select-filter.component.html',
	styleUrls: ['./select-filter.component.css'],
})
export class SelectFilterComponent implements OnInit {

	constructor(private baseService: BaseService) {
	}

	@Output() filterChanged: EventEmitter<any> = new EventEmitter(true);
	@Input() filterSettings: any;
	@Input() multiple = false;
	@Input() disabled = false;

	selected;

	ngOnInit() {
		// remember the users last change
		if (this.baseService.storedFilters) {
			if (this.baseService.storedFilters[this.filterSettings.name]) {
				this.selected = this.baseService.storedFilters[this.filterSettings.name];
			} else {
				this.selected = null;
			}
			this.emit();
		} else {
			this.selected = null;
		}
	}

	emit() {
		this.filterChanged.emit({ [this.filterSettings.name]: this.selected });
	}
}
