import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseService } from '../../../../services/base.service';

@Component({
	selector: 'active-filter',
	templateUrl: './active-filter.component.html',
	styleUrls: ['./active-filter.component.css'],
	providers: [],
})
export class ActiveFilterComponent implements OnInit {

	constructor(private baseService: BaseService) {
	}

	@Input() title = 'Active';
	@Input() disabled = false;

	@Output() filterChanged: EventEmitter<any> = new EventEmitter(true);

	filters: any = {};
	active: boolean = null;
	activeOptions: any = [
		{ name: 'Yes', value: true },
		{ name: 'No', value: false },
	];

	ngOnInit() {
		// remember the users last change
		if (this.baseService.storedFilters && typeof this.baseService.storedFilters.active !== 'undefined') {
			this.filters.active = this.baseService.storedFilters.active;
			this.filterChanged.emit(this.filters);
		}
	}
}
